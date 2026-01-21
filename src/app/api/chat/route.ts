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

    const getUserIntent = `${getBackendUrl()}/ollama/get_user_intent`;

    const getUserIntentResp = await fetch(getUserIntent, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!getUserIntentResp.ok) {
      return new Response(
        JSON.stringify({ error: `Upstream service error: ${getUserIntentResp.status}` }), 
        { 
          status: getUserIntentResp.status, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    const getUserIntentData = await getUserIntentResp.json();
    
    if (Number(getUserIntentData.code) !== 0) {
      return new Response(
        JSON.stringify({ error: `Upstream service error: ${getUserIntentData.message}` }), 
        { 
          status: 502, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    return NextResponse.json(getUserIntentData.data);
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