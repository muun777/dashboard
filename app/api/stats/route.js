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
    let allPredictions = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    // Pętla pobierająca wszystkie zakłady (All Time) strona po stronie
    while (hasMore) {
      const externalApiUrl = `https://s7k4.vercel.app/api/predictions?status=resolved&limit=${limit}&offset=${offset}&userId=${USER_ID}`;

      const res = await fetch(externalApiUrl, {
        cache: 'no-store'
      });

      if (!res.ok) {
        throw new Error(`Błąd połączenia z API s7k4: status ${res.status}`);
      }

      const data = await res.json();
      const predictions = data.predictions || [];

      if (predictions.length > 0) {
        allPredictions = allPredictions.concat(predictions);
        offset += limit;

        // Jeśli zwrócono mniej niż limit, oznacza to, że osiągnęliśmy koniec historii
        if (predictions.length < limit) {
          hasMore = false;
        }
      } else {
        hasMore = false;
      }

      // Zabezpieczenie przed nieskończoną pętlą (maksymalnie 50 stron / 5000 zakładów)
      if (offset >= 5000) {
        hasMore = false;
      }
    }

    let totalBets = 0;
    let wins = 0;
    let losses = 0;
    let totalWagered = 0;
    let totalWon = 0;

    // Przeliczanie statystyk ze WSZYSTKICH pobranych zakładów
    allPredictions.forEach((p) => {
      if (p.userBet) {
        totalBets++;
        const betAmount = Number(p.userBet.pointsBet || 0);
        const wonAmount = Number(p.userBet.pointsWon || 0);

        totalWagered += betAmount;

        if (p.userBet.status === 'won' || wonAmount > 0) {
          wins++;
          totalWon += wonAmount;
        } else {
          losses++;
        }
      }
    });

    const netProfit = totalWon - totalWagered;
    const winRate = totalBets > 0 ? ((wins / totalBets) * 100).toFixed(1) + '%' : '0%';
    const roi = totalWagered > 0 ? ((netProfit / totalWagered) * 100).toFixed(2) + '%' : '0%';

    const formatNum = (num) => {
      if (Math.abs(num) >= 1000000) return (num / 1000000).toFixed(1) + 'M';
      if (Math.abs(num) >= 1000) return (num / 1000).toFixed(1) + 'K';
      return Math.round(num).toString();
    };

    const calculatedStats = {
      totalProfit: (netProfit >= 0 ? '+' : '') + formatNum(netProfit),
      totalGains: '+' + formatNum(totalWon),
      totalLosses: '-' + formatNum(totalWagered - (netProfit > 0 ? totalWon - netProfit : 0)),
      avgBet: totalBets > 0 ? formatNum(totalWagered / totalBets) : '0',
      winRate: winRate,
      roi: roi,
      totalBets: totalBets.toString(),
      winStreak: '-',
      lossStreak: '-',
      wonLost: `${wins} / ${losses}`
    };

    return NextResponse.json({ success: true, stats: calculatedStats }, { headers: corsHeaders });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: corsHeaders });
  }
}
