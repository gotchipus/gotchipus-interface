import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/lib/api-config';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Content field is required and must be a string' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const chatEndpoint = `${getBackendUrl()}/ai/chat`;

    const chatResp = await fetch(chatEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ msg: message }),
    });

    if (!chatResp.ok) {
      return new Response(
        JSON.stringify({ error: `Upstream service error: ${chatResp.status}` }),
        {
          status: chatResp.status,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const chatData = await chatResp.json();

    if (Number(chatData.code) !== 0 || chatData.status !== 'success') {
      return new Response(
        JSON.stringify({ error: chatData.data || 'Request failed' }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return NextResponse.json(chatData);
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}