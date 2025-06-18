import { NextResponse } from 'next/server';
import * as jose from 'jose';

export const runtime = 'edge';

export async function GET(request: Request) {
  const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/connect/discord/callback`;
  const discordAuthUrl = new URL('https://discord.com/api/oauth2/authorize');
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!);
  
  const token = await new jose.SignJWT({ address })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('5m')
    .sign(secret);

  discordAuthUrl.searchParams.set('client_id', process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!);
  discordAuthUrl.searchParams.set('redirect_uri', callbackUrl);
  discordAuthUrl.searchParams.set('response_type', 'code');
  discordAuthUrl.searchParams.set('scope', 'identify guilds.join');

  const response = NextResponse.redirect(discordAuthUrl.toString());
  response.cookies.set('discord_auth_jwt', token, { 
    path: '/', 
    httpOnly: true, 
    secure: process.env.NEXT_PUBLIC_NODE_ENV === 'development', 
    maxAge: 300 
  });
  return response;
}