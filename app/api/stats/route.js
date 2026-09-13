import { NextResponse } from 'next/server';

let savedStats = null;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET() {
  return NextResponse.json({ success: true, stats: savedStats }, { headers: corsHeaders });
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (body.calculatedStats) {
      savedStats = body.calculatedStats;
      return NextResponse.json({ success: true, stats: savedStats }, { headers: corsHeaders });
    }

    return NextResponse.json({ success: false, error: 'Brak danych' }, { status: 400, headers: corsHeaders });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: corsHeaders });
  }
}
