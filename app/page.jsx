"use client";

import { useEffect, useState, useMemo } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState("All");

  const fetchLiveStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stats", { cache: "no-store" });
      if (!res.ok) throw new Error("Błąd pobierania danych z serwera.");
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
      } else {
        throw new Error(data.error || "Brak danych");
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

  const filteredChartData = useMemo(() => {
    if (!stats?.chartData || stats.chartData.length === 0) return [];
    if (timeframe === "All") return stats.chartData;

    const now = Date.now();
    let days = 30;
    if (timeframe === "1D") days = 1;
    if (timeframe === "7D") days = 7;
    const cutoff = now - days * 24 * 60 * 60 * 1000;

    const filtered = stats.chartData.filter((d) => d.timestamp >= cutoff || d.timestamp === 0);
    return filtered.length > 0 ? filtered : stats.chartData;
  }, [stats, timeframe]);

  if (loading) {
    return (
      <div style={{ backgroundColor: '#0d0818', color: '#ffffff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#a78bfa', fontSize: '18px', fontWeight: 'bold' }}>Ładowanie statystyk...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: '#0d0818', color: '#ffffff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ backgroundColor: '#160e28', border: '1px solid #ef4444', padding: '24px', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ color: '#f87171' }}>Błąd: {error}</p>
          <button onClick={fetchLiveStats} style={{ marginTop: '16px', backgroundColor: '#7c3aed', color: '#fff', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
            Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  const containerStyle = {
    backgroundColor: '#0d0818',
    color: '#ffffff',
    minHeight: '100vh',
    padding: '24px',
    fontFamily: 'sans-serif'
  };

  const cardStyle = {
    backgroundColor: '#160e28',
    borderRadius: '16px',
    border: '1px solid rgba(139, 92, 246, 0.25)',
    padding: '20px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
  };

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Profil nagłówek */}
        <div style={cardStyle}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0, color: '#ffffff' }}>{stats.username}</h1>
          <p style={{ fontSize: '14px', color: '#a78bfa', marginTop: '4px', margin: 0 }}>Kick ID: {stats.kickId}</p>
        </div>

        {/* Główne Kafelki */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <BigCard title="TOTAL PROFIT/LOSS" value={stats.totalProfit} color={stats.netProfitRaw >= 0 ? "#22c55e" : "#ef4444"} cardStyle={cardStyle} />
          <BigCard title="WIN RATE" value={stats.winRate} color="#ffffff" cardStyle={cardStyle} />
          <BigCard title="ROI" value={stats.roi} color="#ffffff" cardStyle={cardStyle} />
          <BigCard title="TOTAL BETS" value={stats.totalBets} color="#ffffff" cardStyle={cardStyle} />
        </div>

        {/* Małe Kafelki Rząd 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <SmallCard title="TOTAL GAINS" value={stats.totalGains} color="#22c55e" cardStyle={cardStyle} />
          <SmallCard title="TOTAL LOSSES" value={stats.totalLosses} color="#ef4444" cardStyle={cardStyle} />
          <SmallCard title="AVG BET SIZE" value={stats.avgBetSize} color="#ffffff" cardStyle={cardStyle} />
          <SmallCard title="AVG WIN" value={stats.avgWin} color="#22c55e" cardStyle={cardStyle} />
        </div>

        {/* Małe Kafelki Rząd 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <SmallCard title="AVG LOSS" value={stats.avgLoss} color="#ef4444" cardStyle={cardStyle} />
          <SmallCard title="WIN STREAK" value={stats.winStreak} color="#ffffff" cardStyle={cardStyle} />
          <SmallCard title="LOSS STREAK" value={stats.lossStreak} color="#ffffff" cardStyle={cardStyle} />
          <SmallCard title="WON/LOST" value={stats.wonLost} color="#ffffff" cardStyle={cardStyle} />
        </div>

        {/* Sekcja Wykresu */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: '#e2e8f0' }}>Cumulative PnL</h2>
            <div style={{ display: 'flex', gap: '6px', backgroundColor: '#0d0818', padding: '4px', borderRadius: '8px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
              {["1D", "7D", "30D", "All"].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  style={{
                    backgroundColor: timeframe === tf ? '#7c3aed' : 'transparent',
                    color: timeframe === tf ? '#ffffff' : '#94a3b8',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: '280px', width: '100%' }}>
            <PnLChart data={filteredChartData} />
          </div>
        </div>

      </div>
    </div>
  );
}

function BigCard({ title, value, color, cardStyle }) {
  return (
    <div style={cardStyle}>
      <p style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', color: '#a78bfa', opacity: 0.7, margin: 0 }}>{title}</p>
      <p style={{ fontSize: '32px', fontWeight: '900', color: color, margin: '8px 0 0 0' }}>{value}</p>
    </div>
  );
}

function SmallCard({ title, value, color, cardStyle }) {
  return (
    <div style={cardStyle}>
      <p style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px', color: '#a78bfa', opacity: 0.7, margin: 0 }}>{title}</p>
      <p style={{ fontSize: '20px', fontWeight: 'bold', color: color, margin: '6px 0 0 0' }}>{value}</p>
    </div>
  );
}

function PnLChart({ data }) {
  if (!data || data.length < 2) {
    return <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>Brak danych do wygenerowania wykresu.</div>;
  }

  const pnlValues = data.map((d) => d.pnl);
  let rawMin = Math.min(...pnlValues);
  let rawMax = Math.max(...pnlValues);

  // Zapewniamy marginesy u góry i na dole wykresu
  const paddingMargin = (rawMax - rawMin) * 0.1 || 10;
  const minPnL = rawMin - paddingMargin;
  const maxPnL = rawMax + paddingMargin;
  const range = maxPnL - minPnL || 1;

  const width = 800;
  const height = 260;
  const paddingX = 10;
  const paddingY = 15;

  const points = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - ((d.pnl - minPnL) / range) * (height - 2 * paddingY);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(" L ")}`;
  const firstX = paddingX;
  const lastX = width - paddingX;
  const bottomY = height - paddingY;
  const areaD = `${pathD} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;

  const lastPnL = data[data.length - 1]?.pnl || 0;
  const lineColor = lastPnL >= 0 ? "#22c55e" : "#ef4444";

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lineColor} stopOpacity="0.35" />
          <stop offset="100%" stopColor={lineColor} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#chartGrad)" />
      <path d={pathD} fill="none" stroke={lineColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
