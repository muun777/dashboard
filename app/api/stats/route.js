import { NextResponse } from 'next/server';

// Pamięć podręczna na czas działania serwera
let globalStats = null;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Obsługa zapytania PREFLIGHT (CORS)
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

// Zapytanie GET z Twojego dashboardu (pobiera zapisane statystyki)
export async function GET() {
  return NextResponse.json({ success: true, stats: globalStats }, { headers: corsHeaders });
}

// Zapytanie POST wysyłane z konsoli s7k4
export async function POST(req) {
  try {
    const body = await req.json();

    // 1. Zbiór z profilu (profit: 6901, wagered: 1876052, points: 95536)
    if (body.profileStats) {
      const profit = Number(body.profileStats.profit || 0);
      const wagered = Number(body.profileStats.wagered || 0);
      const points = Number(body.profileStats.points || 0);

      const formatNum = (num) => {
        if (Math.abs(num) >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (Math.abs(num) >= 1000) return (num / 1000).toFixed(1) + 'K';
        return Math.round(num).toString();
      };

      globalStats = {
        totalProfit: (profit >= 0 ? '+' : '-') + formatNum(Math.abs(profit)),
        totalGains: '+' + formatNum(wagered),
        totalLosses: '0',
        avgBet: formatNum(wagered),
        winRate: 'N/A',
        roi: wagered > 0 ? ((profit / wagered) * 100).toFixed(2) + '%' : '0%',
        totalBets: 'Profil',
        winStreak: '-',
        lossStreak: '-',
        wonLost: `${points} pkt`,
      };

      return NextResponse.json({ success: true, stats: globalStats }, { headers: corsHeaders });
    }

    // 2. Jeśli wysyłano zakłady w tablicy bets
    const bets = body.bets || [];
    if (!bets.length) {
      return NextResponse.json(
        { success: false, error: 'Brak danych' },
        { status: 400, headers: corsHeaders }
      );
    }

    let profit = 0;
    bets.forEach(b => {
      const p = Number(b.pointsBet || b.amount || 0);
      if (b.status === 'WIN') profit += p;
      if (b.status === 'LOSS') profit -= p;
    });

    globalStats = {
      totalProfit: profit >= 0 ? `+${profit}` : `${profit}`,
      winRate: '50%',
      roi: '0%',
      totalBets: `${bets.length}`,
      totalGains: `+${profit}`,
      totalLosses: '0',
      avgBet: '0',
      winStreak: '0',
      lossStreak: '0',
      wonLost: `${bets.length} / 0`
    };

    return NextResponse.json({ success: true, stats: globalStats }, { headers: corsHeaders });

  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: corsHeaders });
  }
}
