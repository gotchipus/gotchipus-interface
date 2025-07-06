import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content } = body;

    if (!content || typeof content !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Content field is required and must be a string' }), 
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    const upstream = `${process.env.NEXT_PUBLIC_DEVELOPMENT_URL}/ollama/chat`;
    
    const originResp = await fetch(upstream, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
      cache: 'no-store'
    });

    if (!originResp.ok) {
      return new Response(
        JSON.stringify({ error: `Upstream service error: ${originResp.status}` }), 
        { 
          status: originResp.status, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!originResp.body) {
      return new Response(
        JSON.stringify({ error: 'Empty response from upstream service' }), 
        { 
          status: 502, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    const headers = new Headers({
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
    });

    return new Response(originResp.body, { status: 200, headers });
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