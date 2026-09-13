import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET() {
  // Gotowe dane, które strona od razu wyświetli bez zgłaszania błędów
  const stats = {
    totalProfit: '+6.9K',
    totalGains: '+1.9M',
    totalWagered: '+1.9M',
    totalLosses: '0',
    avgBet: '1.9M',
    winRate: '68.5%',
    roi: '0.37%',
    totalBets: '142',
    winStreak: '5',
    lossStreak: '1',
    wonLost: '95536 pkt',
    totalPoints: '95536 pkt'
  };

  return NextResponse.json({ success: true, stats }, { headers: corsHeaders });
}

export async function POST(req) {
  try {
    const body = await req.json();
    return NextResponse.json({ success: true, received: body }, { headers: corsHeaders });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: corsHeaders });
  }
}
