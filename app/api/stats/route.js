import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET() {
  try {
    const USER_ID = '62122525';
    let rawPredictions = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;
    let detectedUsername = 'NajwiekszyGyat';

    // Pobieramy zakłady z API s7k4
    while (hasMore) {
      const externalApiUrl = `https://s7k4.vercel.app/api/predictions?status=resolved&limit=${limit}&offset=${offset}&userId=${USER_ID}`;
      const res = await fetch(externalApiUrl, { cache: 'no-store' });

      if (!res.ok) break;

      const data = await res.json();
      const predictions = data.predictions || [];

      if (predictions.length > 0) {
        rawPredictions = rawPredictions.concat(predictions);
        offset += limit;
        if (predictions.length < limit) hasMore = false;
      } else {
        hasMore = false;
      }

      if (offset >= 10000) hasMore = false;
    }

    // Wyciągamy tylko zakłady gracza i ODWRACAMY KOLEJNOŚĆ (od najstarszego do najnowszego)
    const validBets = rawPredictions
      .filter((p) => p && p.userBet)
      .reverse(); // API zwraca najnowsze jako pierwsze, więc reverse() układa je chronologicznie!

    if (validBets.length > 0 && validBets[0].userBet?.username) {
      detectedUsername = validBets[0].userBet.username;
    }

    let totalBets = 0;
    let wins = 0;
    let losses = 0;
    let totalWagered = 0;
    let totalGains = 0;
    let totalLossesAmount = 0;

    let currentWinStreak = 0;
    let maxWinStreak = 0;
    let currentLossStreak = 0;
    let maxLossStreak = 0;

    let cumulativeProfit = 0;
    const chartData = [{ timestamp: 0, pnl: 0 }]; // Punkt zero na samym starcie konta

    validBets.forEach((p, idx) => {
      totalBets++;
      const betAmount = Number(p.userBet.pointsBet || 0);
      const wonAmount = Number(p.userBet.pointsWon || 0);
      const profit = wonAmount > 0 ? wonAmount - betAmount : -betAmount;

      totalWagered += betAmount;
      cumulativeProfit += profit;

      const timestamp = new Date(p.created_at || p.updated_at || Date.now()).getTime() || idx;

      chartData.push({
        timestamp: timestamp,
        pnl: cumulativeProfit
      });

      if (profit > 0) {
        wins++;
        totalGains += profit;
        currentWinStreak++;
        if (currentWinStreak > maxWinStreak) maxWinStreak = currentWinStreak;
        currentLossStreak = 0;
      } else {
        losses++;
        totalLossesAmount += Math.abs(profit);
        currentLossStreak++;
        if (currentLossStreak > maxLossStreak) maxLossStreak = currentLossStreak;
        currentWinStreak = 0;
      }
    });

    const netProfit = totalGains - totalLossesAmount;
    const winRate = totalBets > 0 ? ((wins / totalBets) * 100).toFixed(1) : '0';
    const roi = totalWagered > 0 ? ((netProfit / totalWagered) * 100).toFixed(1) : '0';

    const formatNum = (num) => {
      const sign = num < 0 ? '-' : num > 0 ? '+' : '';
      const abs = Math.abs(num);
      if (abs >= 1000000) return sign + (abs / 1000000).toFixed(1) + 'M';
      if (abs >= 1000) return sign + (abs / 1000).toFixed(1) + 'K';
      return sign + Math.round(abs).toString();
    };

    const avgBet = totalBets > 0 ? Math.round(totalWagered / totalBets) : 0;
    const avgWin = wins > 0 ? Math.round(totalGains / wins) : 0;
    const avgLoss = losses > 0 ? Math.round(totalLossesAmount / losses) : 0;

    const stats = {
      username: detectedUsername,
      kickId: USER_ID,
      totalProfit: formatNum(netProfit),
      netProfitRaw: netProfit,
      winRate: winRate + '%',
      roi: roi + '%',
      totalBets: totalBets.toString(),
      totalGains: formatNum(totalGains),
      totalLosses: '-' + formatNum(totalLossesAmount).replace('+', '').replace('-', ''),
      avgBetSize: formatNum(avgBet).replace('+', ''),
      avgWin: formatNum(avgWin),
      avgLoss: '-' + formatNum(avgLoss).replace('+', '').replace('-', ''),
      winStreak: maxWinStreak.toString(),
      lossStreak: maxLossStreak.toString(),
      wonLost: `${wins}/${losses}`,
      chartData: chartData
    };

    return NextResponse.json({ success: true, stats }, { headers: corsHeaders });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: corsHeaders });
  }
}
