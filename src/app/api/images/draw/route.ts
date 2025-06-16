import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  try {
    const response = await fetch('https://api.gotchipus.com/images/draw', {
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