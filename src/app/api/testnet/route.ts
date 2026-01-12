import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const TESTNET_BASE_URL = 'https://atlantic.dplabs-internal.com';
const REQUEST_TIMEOUT = 30000; 
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

interface FetchOptions {
  method: string;
  headers: Record<string, string>;
  body?: string;
  signal?: AbortSignal;
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url: string, options: FetchOptions, retries = MAX_RETRIES): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (retries > 0 && shouldRetry(error)) {
      // Log error message only, avoid logging full error object in Edge Runtime
      const errorMsg = (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') 
        ? error.message 
        : String(error || 'Unknown error');
      console.warn(`Request failed, retrying in ${RETRY_DELAY}ms. Retries left: ${retries - 1}. Error: ${errorMsg}`);
      await sleep(RETRY_DELAY);
      return fetchWithRetry(url, options, retries - 1);
    }
    
    throw error;
  }
}

function shouldRetry(error: any): boolean {
  // Safely extract error properties for Edge Runtime compatibility
  try {
    const errorName = typeof error?.name === 'string' ? error.name : '';
    const errorCode = typeof error?.code === 'string' ? error.code : '';
    const errorMessage = typeof error?.message === 'string' ? error.message : String(error || '');
    
    return (
      errorName === 'AbortError' ||
      errorCode === 'ECONNRESET' ||
      errorCode === 'ENOTFOUND' ||
      errorCode === 'ECONNREFUSED' ||
      errorMessage.includes('fetch failed') ||
      errorMessage.includes('ECONNRESET') ||
      errorMessage.includes('ECONNREFUSED')
    );
  } catch {
    // If error extraction fails, don't retry
    return false;
  }
}

function createErrorResponse(error: any, path: string, method: string) {
  // Safely extract error information for Edge Runtime compatibility
  // Avoid accessing properties that might trigger XMLHttpRequest references
  let errorMessage = 'Unknown error';
  let errorName = 'Error';
  let errorCode: string | undefined = undefined;
  
  try {
    // Safely extract error message
    if (typeof error?.message === 'string') {
      errorMessage = error.message;
    } else if (typeof error?.toString === 'function') {
      errorMessage = error.toString();
    } else {
      errorMessage = String(error || 'Unknown error');
    }
    
    // Safely extract error name
    if (typeof error?.name === 'string') {
      errorName = error.name;
    }
    
    // Safely extract error code (may not exist in Edge Runtime)
    if (typeof error?.code === 'string' || typeof error?.code === 'number') {
      errorCode = String(error.code);
    }
  } catch (e) {
    // If error extraction fails, use defaults
    errorMessage = 'Error processing request';
  }
  
  // Build error details with only serializable values
  const errorDetails: Record<string, string> = {
    message: errorMessage,
    name: errorName,
    path: path || '',
    method: method || 'UNKNOWN',
    timestamp: new Date().toISOString(),
  };
  
  // Only add code if it exists
  if (errorCode) {
    errorDetails.code = errorCode;
  }
  
  // Log error message only (avoid logging full error object in Edge Runtime)
  console.error('Testnet proxy error:', errorMessage, { path, method });
  
  // Check error types using safe string comparisons
  const isAbortError = errorName === 'AbortError' || errorMessage.includes('aborted');
  const isConnectionError = errorCode === 'ECONNRESET' || 
                           errorCode === 'ECONNREFUSED' ||
                           errorCode === 'ENOTFOUND' ||
                           errorMessage.includes('ECONNREFUSED') ||
                           errorMessage.includes('ECONNRESET') ||
                           errorMessage.includes('fetch failed');
  
  if (isAbortError) {
    return NextResponse.json(
      { error: 'Request timeout', details: errorDetails },
      { status: 504 }
    );
  }
  
  if (isConnectionError) {
    return NextResponse.json(
      { error: 'Connection failed', details: errorDetails },
      { status: 503 }
    );
  }
  
  return NextResponse.json(
    { error: 'Proxy request failed', details: errorDetails },
    { status: 500 }
  );
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/testnet', '');
  const searchParams = url.searchParams.toString();
  const targetUrl = `${TESTNET_BASE_URL}${path}${searchParams ? `?${searchParams}` : ''}`;
  
  try {
    const response = await fetchWithRetry(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Gotchipus-Frontend/1.0',
      },
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return createErrorResponse(error, path, 'GET');
  }
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/testnet', '');
  const searchParams = url.searchParams.toString();
  const targetUrl = `${TESTNET_BASE_URL}${path}${searchParams ? `?${searchParams}` : ''}`;
  
  try {
    const body = await request.json();
    
    const response = await fetchWithRetry(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Gotchipus-Frontend/1.0',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return createErrorResponse(error, path, 'POST');
  }
} 