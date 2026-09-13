import { NextResponse } from 'next/server';

// Obsługa zapytania CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request) {
  try {
    const { bets } = await request.json();

    if (!bets || !Array.isArray(bets)) {
      return NextResponse.json(
        { success: false, error: "Brak danych" },
        { 
          status: 400,
          headers: { 'Access-Control-Allow-Origin': '*' }
        }
      );
    }

    let totalGains = 0;
    let totalLosses = 0;
    let wins = 0;
    let losses = 0;
    let currentStreak = 0;
    let maxWinStreak = 0;
    let maxLossStreak = 0;

    bets.forEach(bet => {
      const pnl = Number(bet.pnl || bet.profit || 0);
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
    const winRate = totalBets > 0 ? ((wins / totalBets) * 100).toFixed(1) + "%" : "0%";
    const totalVolume = totalGains + totalLosses;
    const roi = totalVolume > 0 ? ((netProfit / totalVolume) * 100).toFixed(1) + "%" : "0%";

    return NextResponse.json({
      success: true,
      stats: {
        totalProfit: (netProfit >= 0 ? "+" : "") + (netProfit / 1000).toFixed(1) + "K",
        winRate,
        roi,
        totalBets: totalBets.toString(),
        totalGains: "+" + (totalGains / 1000).toFixed(1) + "K",
        totalLosses: "-" + (totalLosses / 1000).toFixed(1) + "K",
        avgBet: totalBets > 0 ? ((totalGains + totalLosses) / totalBets / 1000).toFixed(1) + "K" : "0K",
        winStreak: maxWinStreak.toString(),
        lossStreak: maxLossStreak.toString(),
        wonLost: `${wins} / ${losses}`
      }
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { 
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' }
      }
    );
  }
}
