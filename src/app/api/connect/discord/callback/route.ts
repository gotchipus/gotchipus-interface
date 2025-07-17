import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?windows=daily-task-hall&active=daily-task-hall&refresh=${Date.now()}`);
  }

  const token = request.cookies.get('discord_auth_jwt')?.value;
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

  try {
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
        client_secret: process.env.NEXT_PUBLIC_DISCORD_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/connect/discord/callback`,
      }),
    });
    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) throw new Error('Failed to get discord access token');

    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
    });
    const userData = await userResponse.json();
    const discordUserId = userData.id;
    const discordUsername = userData.username;

    const guildId = process.env.NEXT_PUBLIC_DISCORD_GUILD_ID!; 
    const botToken = process.env.NEXT_PUBLIC_DISCORD_BOT_TOKEN!;

    await fetch(`https://discord.com/api/guilds/${guildId}/members/${discordUserId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bot ${botToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ access_token: tokenData.access_token })
    });

    const memberCheck = await fetch(`https://discord.com/api/guilds/${guildId}/members/${discordUserId}`, {
      headers: { 'Authorization': `Bot ${botToken}` }
    });
    if (!memberCheck.ok) {
      throw new Error('Failed to verify user in guild.');
    }

    const upsertBody = {
      "address": walletAddress,
      "discord_id": discordUserId
    };
    const upsertResponse = await fetch(`${process.env.NEXT_PUBLIC_DEVELOPMENT_URL}/account/upsert_discord`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(upsertBody),
    });

    if (!upsertResponse.ok) {
      throw new Error(`API responded with status: ${upsertResponse.status}`);
    }

    console.log(`User ${discordUsername} (${discordUserId}) has successfully joined the Discord server.`);

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?windows=daily-task-hall&active=daily-task-hall&refresh=${Date.now()}`);

  } catch (error) {
    console.error(error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?windows=daily-task-hall&active=daily-task-hall&refresh=${Date.now()}`);
  }
}