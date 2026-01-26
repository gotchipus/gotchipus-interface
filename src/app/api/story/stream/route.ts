import { NextRequest } from 'next/server';
import { getBackendUrl } from '@/lib/api-config';

export const runtime = 'edge';

export async function GET(_req: NextRequest) {
    const upstream = `${getBackendUrl()}/ai/story/stream`;
  
    const originResp = await fetch(upstream, { cache: 'no-store' });
    if (!originResp.body) {
      return new Response('empty body from python', { status: 502 });
    }
  
    const headers = new Headers({
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
    });
  
    return new Response(originResp.body, { status: 200, headers });
  }