import { NextResponse } from 'next/server';
import { getBackendUrl } from '@/lib/api-config';

export const runtime = 'edge';

export async function GET() {
  try {
    const response = await fetch(`${getBackendUrl()}/images/draw`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error drawing images:', error);
    return NextResponse.json(
      { error: 'Failed to draw images' },
      { status: 500 }
    );
  }
} 