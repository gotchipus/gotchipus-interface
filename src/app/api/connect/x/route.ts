import { NextResponse } from 'next/server';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export function GET(request: Request) {
  const state = crypto.randomBytes(32).toString('hex');
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');
  
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  const payload = { address };
  const token = jwt.sign(payload, process.env.NEXT_PUBLIC_JWT_SECRET!, { expiresIn: '5m' });

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
  response.cookies.set('x_auth_jwt', token, { path: '/', httpOnly: true, secure: process.env.NEXT_PUBLIC_NODE_ENV === 'development', maxAge: 300 });
  response.cookies.set('x_oauth_state', state, { path: '/', httpOnly: true, maxAge: 3600 });
  response.cookies.set('x_oauth_code_verifier', codeVerifier, { path: '/', httpOnly: true, maxAge: 3600 });

  return response;
}