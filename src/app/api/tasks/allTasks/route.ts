import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  try {
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_DEVELOPMENT_URL}/task/active`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error getting all tasks:', error);
    return NextResponse.json(
      { error: 'Failed to get all tasks' },
      { status: 500 }
    );
  }
} 