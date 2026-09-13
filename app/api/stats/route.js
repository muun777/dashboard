import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();

    // 1. Obsługa danych zbiorczych bezpośrednio z profilu (profit: 6901, wagered: 1876052)
    if (body.profileStats) {
      const { profit, wagered, points } = body.profileStats;
      const profitNum = Number(profit || 0);
      const wageredNum = Number(wagered || 0);

      const roiValue = wageredNum > 0 ? ((profitNum / wageredNum) * 100).toFixed(2) : "0";

      return NextResponse.json({
        success: true,
        stats: {
          totalProfit: profitNum >= 0 ? `+${profitNum}` : `${profitNum}`,
          totalWagered: `${wageredNum}`,
          totalPoints: `${points || 0}`,
          roi: `${roiValue}%`,
          totalBets: "N/A (Dane zbiorcze)",
          winRate: "N/A"
        }
      });
    }

    // 2. Obsługa listy pojedynczych zakładów (jeśli tablica bets zostanie przesłana)
    const bets = body.bets || [];

    if (!bets.length) {
      return NextResponse.json(
        { success: false, error: 'Brak danych zakładów oraz braki w profilu.' },
        { status: 400 }
      );
    }

    let totalProfit = 0;
    let totalGains = 0;
    let totalLosses = 0;
    let wins = 0;
    let losses = 0;

    bets.forEach(b => {
      const points = Number(b.pointsBet || b.amount || 0);
      if (b.status === 'WIN') {
        wins++;
        totalGains += points;
        totalProfit += points;
      } else if (b.status === 'LOSS') {
        losses++;
        totalLosses += points;
        totalProfit -= points;
      }
    });

    const totalBets = bets.length;
    const winRate = totalBets > 0 ? `${Math.round((wins / totalBets) * 100)}%` : '0%';

    return NextResponse.json({
      success: true,
      stats: {
        totalProfit: totalProfit >= 0 ? `+${totalProfit}` : `${totalProfit}`,
        winRate,
        totalBets: `${totalBets}`,
        totalGains: `${totalGains}`,
        totalLosses: `${totalLosses}`,
        wins: `${wins}`,
        losses: `${losses}`
      }
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
