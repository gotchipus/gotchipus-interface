import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const upstream = `${process.env.NEXT_PUBLIC_DEVELOPMENT_URL}/ollama/call_intent`;

  const originResp = await fetch(upstream, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (!originResp.ok || !originResp.body) {
    return new Response(
      JSON.stringify({ error: 'Upstream error' }),
      { status: 502, headers: { 'Content-Type': 'application/json' } },
    );
  }

  return new Response(originResp.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
    },
  });
}