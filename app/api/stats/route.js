import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://s7k4.vercel.app/api/predictions?user=cwelowiecki', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      next: { revalidate: 30 }
    });

    if (!res.ok) {
      return NextResponse.json({ success: false });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
