import { NextResponse } from 'next/server';
import * as jose from 'jose';

export const runtime = 'edge';

export async function GET(request: Request) {
  const generateRandomBytes = (size: number) => {
    const arr = new Uint8Array(size);
    crypto.getRandomValues(arr);
    return Array.from(arr)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  async function sha256(text: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    return btoa(String.fromCharCode(...Array.from(new Uint8Array(hashBuffer))))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  const state = generateRandomBytes(32);
  const codeVerifier = generateRandomBytes(32);
  const codeChallenge = await sha256(codeVerifier);
  
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    const errorResponse = NextResponse.json({ error: 'Address is required' }, { status: 400 });
    errorResponse.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*');
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return errorResponse;
  }

  const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!);
  
  const token = await new jose.SignJWT({ address })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('5m')
    .sign(secret);

  const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/connect/x/callback`;
  const twitterAuthUrl = new URL('https://x.com/i/oauth2/authorize');
  twitterAuthUrl.searchParams.set('response_type', 'code');
  twitterAuthUrl.searchParams.set('client_id', process.env.NEXT_PUBLIC_X_DEV_CLIENT_ID!);
  twitterAuthUrl.searchParams.set('redirect_uri', callbackUrl);
  twitterAuthUrl.searchParams.set('scope', 'users.read follows.read tweet.read offline.access');
  twitterAuthUrl.searchParams.set('state', state);
  twitterAuthUrl.searchParams.set('code_challenge', codeChallenge);
  twitterAuthUrl.searchParams.set('code_challenge_method', 'S256');

  const response = NextResponse.redirect(twitterAuthUrl.toString());
  response.cookies.set('x_auth_jwt', token, { 
    path: '/', 
    httpOnly: true, 
    secure: process.env.NEXT_PUBLIC_NODE_ENV !== 'development', 
    maxAge: 300 
  });
  response.cookies.set('x_oauth_state', state, { 
    path: '/', 
    httpOnly: true, 
    maxAge: 3600 
  });
  response.cookies.set('x_oauth_code_verifier', codeVerifier, { 
    path: '/', 
    httpOnly: true, 
    maxAge: 3600 
  });

  return response;
}

export async function OPTIONS(request: Request) {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
}