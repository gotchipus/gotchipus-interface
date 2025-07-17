import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  const token = request.cookies.get('x_auth_jwt')?.value;
  if (!token) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?windows=daily-task-hall&active=daily-task-hall&refresh=${Date.now()}`);
  }

  let decodedToken: any;
  try {
    const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!);
    const { payload } = await jose.jwtVerify(token, secret);
    decodedToken = payload;
  } catch (err) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?windows=daily-task-hall&active=daily-task-hall&refresh=${Date.now()}`);
  }
  const walletAddress = decodedToken.address;

  const storedState = request.cookies.get('x_oauth_state')?.value;
  const codeVerifier = request.cookies.get('x_oauth_code_verifier')?.value;

  if (!state || !storedState || state !== storedState) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?windows=daily-task-hall&active=daily-task-hall&refresh=${Date.now()}`);
  }

  try {
    const tokenResponse = await fetch('https://api.x.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${process.env.NEXT_PUBLIC_X_DEV_CLIENT_ID}:${process.env.NEXT_PUBLIC_X_DEV_CLIENT_SECRET}`)}`
      },
      body: new URLSearchParams({
        code: code!,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/connect/x/callback`,
        code_verifier: codeVerifier!
      })
    });
    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) throw new Error('Failed to get access token');
    
    const meResponse = await fetch('https://api.x.com/2/users/me', {
      headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
    });
    const meData = await meResponse.json();
    const xUserId = meData.data.id;
    const xUsername = meData.data.username;

    const upsertBody = {
      "address": walletAddress,
      "x_id": xUserId
    };

    const upsertResponse = await fetch(`${process.env.NEXT_PUBLIC_DEVELOPMENT_URL}/account/upsert_x`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(upsertBody),
    });

    if (!upsertResponse.ok) {
      throw new Error(`API responded with status: ${upsertResponse.status}`);
    }

    console.log(`User ${xUsername} (${xUserId}) has successfully connected and is following the official account.`);

    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?windows=daily-task-hall&active=daily-task-hall&refresh=${Date.now()}`);
    response.cookies.delete('x_auth_jwt');
    response.cookies.delete('x_oauth_state');
    response.cookies.delete('x_oauth_code_verifier');
    return response;

  } catch (error) {
    console.error(error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?windows=daily-task-hall&active=daily-task-hall&refresh=${Date.now()}`);
  }
}