import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 转换前端时间为时间戳（如果是字符串格式）
    const payload = {
      ...body,
      start_at: typeof body.start_at === 'string'
        ? Math.floor(new Date(body.start_at).getTime() / 1000)
        : body.start_at,
      end_at: typeof body.end_at === 'string'
        ? Math.floor(new Date(body.end_at).getTime() / 1000)
        : body.end_at,
    };

    // 转发到后端 /task/create
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DEVELOPMENT_URL}/task/create`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
