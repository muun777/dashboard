"use client";

import { useEffect, useState, useMemo } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState("All"); // 1D, 7D, 30D, All

  const fetchLiveStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stats", { cache: "no-store" });
      if (!res.ok) throw new Error("Nie udało się pobrać danych z API.");
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
      } else {
        throw new Error(data.error || "Brak danych z API");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveStats();
  }, []);

  // Filtrowanie punktów wykresu zależnie od wybranego zakresu czasowego
  const filteredChartData = useMemo(() => {
    if (!stats?.chartData || stats.chartData.length === 0) return [];
    if (timeframe === "All") return stats.chartData;

    const now = Date.now();
    let days = 30;
    if (timeframe === "1D") days = 1;
    if (timeframe === "7D") days = 7;
    const cutoff = now - days * 24 * 60 * 60 * 1000;

    const filtered = stats.chartData.filter((d) => d.timestamp >= cutoff);
    return filtered.length > 0 ? filtered : stats.chartData;
  }, [stats, timeframe]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d0914] text-white">
        <div className="text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-[#8b5cf6] border-t-transparent"></div>
          <p className="mt-4 font-medium text-slate-400">Pobieranie zakładek na żywo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d0914] text-white">
        <div className="rounded-xl border border-red-500/30 bg-red-950/30 p-8 text-center backdrop-blur-md">
          <p className="text-lg font-semibold text-red-400">Błąd: {error}</p>
          <button
            onClick={fetchLiveStats}
            className="mt-4 rounded-lg bg-purple-600 px-6 py-2.5 font-medium text-white transition-all hover:bg-purple-500"
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0d0914] p-4 text-white sm:p-6 lg:p-10 font-sans">
      <div className="mx-auto max-w-7xl space-y-4">

        {/* Header User Box */}
        <div className="rounded-2xl border border-purple-900/30 bg-[#161026] p-6 shadow-2xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">{stats.username}</h1>
          <p className="mt-1 text-sm font-medium text-purple-400/80">Kick ID: {stats.kickId}</p>
        </div>

        {/* Top Big Cards Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <BigCard
            title="TOTAL PROFIT/LOSS"
            value={stats.totalProfit}
            color={stats.netProfitRaw >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}
          />
          <BigCard title="WIN RATE" value={stats.winRate} color="text-white" />
          <BigCard title="ROI" value={stats.roi} color="text-white" />
          <BigCard title="TOTAL BETS" value={stats.totalBets} color="text-white" />
        </div>

        {/* Middle Stats Row 1 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SmallCard title="TOTAL GAINS" value={stats.totalGains} color="text-[#22c55e]" />
          <SmallCard title="TOTAL LOSSES" value={stats.totalLosses} color="text-[#ef4444]" />
          <SmallCard title="AVG BET SIZE" value={stats.avgBetSize} color="text-white" />
          <SmallCard title="AVG WIN" value={stats.avgWin} color="text-[#22c55e]" />
        </div>

        {/* Middle Stats Row 2 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SmallCard title="AVG LOSS" value={stats.avgLoss} color="text-[#ef4444]" />
          <SmallCard title="WIN STREAK" value={stats.winStreak} color="text-white" />
          <SmallCard title="LOSS STREAK" value={stats.lossStreak} color="text-white" />
          <SmallCard title="WON/LOST" value={stats.wonLost} color="text-white" />
        </div>

        {/* Cumulative PnL Chart Box */}
        <div className="rounded-2xl border border-purple-900/30 bg-[#161026] p-6 shadow-2xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-semibold tracking-wide text-slate-200">Cumulative PnL</h2>

            {/* Timeframe Buttons */}
            <div className="flex items-center gap-1 rounded-xl bg-[#0d0914] p-1 border border-purple-900/40">
              {["1D", "7D", "30D", "All"].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
                    timeframe === tf
                      ? "bg-[#8b5cf6] text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* SVG PnL Line Chart */}
          <div className="h-72 w-full">
            <PnLChart data={filteredChartData} />
          </div>
        </div>

      </div>
    </main>
  );
}

function BigCard({ title, value, color }) {
  return (
    <div className="rounded-2xl border border-purple-900/30 bg-[#161026] p-6 shadow-xl transition-all hover:border-purple-700/50">
      <p className="text-xs font-bold uppercase tracking-widest text-purple-300/60">{title}</p>
      <p className={`mt-3 text-4xl font-black tracking-tight ${color}`}>{value}</p>
    </div>
  );
}

function SmallCard({ title, value, color }) {
  return (
    <div className="rounded-2xl border border-purple-900/30 bg-[#161026] p-5 shadow-lg transition-all hover:border-purple-700/50">
      <p className="text-[10px] font-bold uppercase tracking-widest text-purple-300/60">{title}</p>
      <p className={`mt-2 text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

// Komponent dynamicznego wykresu liniowego z gradientem SVG
function PnLChart({ data }) {
  if (!data || data.length < 2) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-slate-500">
        Za mało danych do wygenerowania wykresu dla tego zakresu.
      </div>
    );
  }

  const pnlValues = data.map((d) => d.pnl);
  const minPnL = Math.min(...pnlValues, 0);
  const maxPnL = Math.max(...pnlValues, 100);
  const range = maxPnL - minPnL || 1;

  const width = 800;
  const height = 260;
  const padding = 20;

  const points = data.map((d, index) => {
    const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((d.pnl - minPnL) / range) * (height - 2 * padding);
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(" L ")}`;
  const areaD = `${pathD} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`;

  const lastPnL = data[data.length - 1]?.pnl || 0;
  const lineColor = lastPnL >= 0 ? "#22c55e" : "#ef4444";

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full overflow-visible">
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lineColor} stopOpacity="0.35" />
          <stop offset="100%" stopColor={lineColor} stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {/* Tło gradientu pod linią */}
      <path d={areaD} fill="url(#chartGradient)" />

      {/* Linia wykresu */}
      <path
        d={pathD}
        fill="none"
        stroke={lineColor}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Ostatni punkt z efektem świecenia */}
      {data.length > 0 && (
        <circle
          cx={points[points.length - 1].split(",")[0]}
          cy={points[points.length - 1].split(",")[1]}
          r="5"
          fill={lineColor}
          className="animate-pulse"
        />
      )}
    </svg>
  );
}
