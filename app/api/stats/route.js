import { NextResponse } from 'next/server';

// Przechowywanie danych w pamięci podręcznej serwera
let savedStats = {
  totalProfit: '+6.9K',
  totalGains: '+1.9M',
  totalLosses: '0',
  avgBet: '1.9M',
  winRate: '0%',
  roi: '0.37%',
  totalBets: '0',
  winStreak: '0',
  lossStreak: '0',
  wonLost: '95536 pkt'
};

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

    if (body.profileStats) {
      const profit = Number(body.profileStats.profit || 0);
      const wagered = Number(body.profileStats.wagered || 0);
      const points = Number(body.profileStats.points || 0);

      const formatNum = (num) => {
        if (Math.abs(num) >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (Math.abs(num) >= 1000) return (num / 1000).toFixed(1) + 'K';
        return Math.round(num).toString();
      };

      savedStats = {
        totalProfit: (profit >= 0 ? '+' : '-') + formatNum(Math.abs(profit)),
        totalGains: '+' + formatNum(wagered),
        totalLosses: '0',
        avgBet: formatNum(wagered),
        winRate: 'N/A',
        roi: wagered > 0 ? ((profit / wagered) * 100).toFixed(2) + '%' : '0%',
        totalBets: '1',
        winStreak: '1',
        lossStreak: '0',
        wonLost: `${points} pkt`
      };

      return NextResponse.json({ success: true, stats: savedStats }, { headers: corsHeaders });
    }

    return NextResponse.json({ success: false, error: 'Brak danych' }, { status: 400, headers: corsHeaders });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: corsHeaders });
  }
}
