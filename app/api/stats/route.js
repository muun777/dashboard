import { NextResponse } from 'next/server';

let cachedStats = null;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET() {
  return NextResponse.json(
    { success: true, stats: cachedStats },
    { headers: corsHeaders }
  );
}

export async function POST(request) {
  try {
    const body = await request.json();
    let bets = body.bets || body;

    if (!Array.isArray(bets)) {
      bets = bets.predictions || bets.data || bets.history || [];
    }

    if (!bets || bets.length === 0) {
      return NextResponse.json(
        { success: false, error: "Brak historii zakładów" },
        { status: 400, headers: corsHeaders }
      );
    }

    let totalGains = 0;
    let totalLosses = 0;
    let wins = 0;
    let losses = 0;
    let currentStreak = 0;
    let maxWinStreak = 0;
    let maxLossStreak = 0;

    bets.forEach((bet) => {
      let pnl = Number(bet.pnl || bet.profit || bet.points || bet.change || 0);

      if (pnl === 0 && bet.amount) {
        if (bet.status === 'WON' || bet.won === true || bet.result === 'WIN') {
          pnl = Math.abs(Number(bet.amount));
        } else if (bet.status === 'LOST' || bet.won === false || bet.result === 'LOSS') {
          pnl = -Math.abs(Number(bet.amount));
        }
      }

      if (pnl > 0) {
        totalGains += pnl;
        wins++;
        currentStreak = currentStreak > 0 ? currentStreak + 1 : 1;
        if (currentStreak > maxWinStreak) maxWinStreak = currentStreak;
      } else if (pnl < 0) {
        totalLosses += Math.abs(pnl);
        losses++;
        currentStreak = currentStreak < 0 ? currentStreak - 1 : -1;
        if (Math.abs(currentStreak) > maxLossStreak) maxLossStreak = Math.abs(currentStreak);
      }
    });

    const totalBets = wins + losses;
    const netProfit = totalGains - totalLosses;
    const winRate = totalBets > 0 ? ((wins / totalBets) * 100).toFixed(1) + '%' : '0%';
    const totalVolume = totalGains + totalLosses;
    const roi = totalVolume > 0 ? ((netProfit / totalVolume) * 100).toFixed(1) + '%' : '0%';

    const formatNum = (num) => {
      if (Math.abs(num) >= 1000000) return (num / 1000000).toFixed(1) + 'M';
      if (Math.abs(num) >= 1000) return (num / 1000).toFixed(1) + 'K';
      return num.toString();
    };

    cachedStats = {
      totalProfit: (netProfit >= 0 ? '+' : '-') + formatNum(Math.abs(netProfit)),
      winRate,
      roi,
      totalBets: totalBets.toString(),
      totalGains: '+' + formatNum(totalGains),
      totalLosses: '-' + formatNum(totalLosses),
      avgBet: totalBets > 0 ? formatNum((totalGains + totalLosses) / totalBets) : '0',
      winStreak: maxWinStreak.toString(),
      lossStreak: maxLossStreak.toString(),
      wonLost: `${wins} / ${losses}`,
    };

    return NextResponse.json(
      { success: true, stats: cachedStats },
      { headers: corsHeaders }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
