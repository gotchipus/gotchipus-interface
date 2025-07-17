import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const TESTNET_BASE_URL = 'https://testnet.dplabs-internal.com';
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
      console.warn(`Request failed, retrying in ${RETRY_DELAY}ms. Retries left: ${retries - 1}`, error);
      await sleep(RETRY_DELAY);
      return fetchWithRetry(url, options, retries - 1);
    }
    
    throw error;
  }
}

function shouldRetry(error: any): boolean {
  return (
    error.name === 'AbortError' ||
    error.code === 'ECONNRESET' ||
    error.code === 'ENOTFOUND' ||
    error.code === 'ECONNREFUSED' ||
    error.message?.includes('fetch failed')
  );
}

function createErrorResponse(error: any, path: string, method: string) {
  const errorDetails = {
    message: error.message || 'Unknown error',
    code: error.code,
    name: error.name,
    path,
    method,
    timestamp: new Date().toISOString(),
  };
  
  console.error('Testnet proxy error:', errorDetails);
  
  if (error.name === 'AbortError') {
    return NextResponse.json(
      { error: 'Request timeout', details: errorDetails },
      { status: 504 }
    );
  }
  
  if (error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED') {
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