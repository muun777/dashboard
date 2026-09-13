"use client";

import React, { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLiveStats() {
      try {
        const res = await fetch('/api/stats');
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      } catch (e) {
        console.error("Błąd pobierania danych z API:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchLiveStats();
    const interval = setInterval(fetchLiveStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const statsList = [
    { label: "Win Rate", value: data?.winRate || "64.6%", change: "+2.1%", positive: true },
    { label: "ROI", value: data?.roi || "13.0%", change: "+0.5%", positive: true },
    { label: "Total Bets", value: data?.totalBets || "489", change: "ogółem", neutral: true },
    { label: "Total Gains", value: data?.totalGains || "+1.3M", change: "wygrane", positive: true },
    { label: "Total Losses", value: data?.totalLosses || "-794.3K", change: "przegrane", positive: false },
    { label: "Avg Bet Size", value: data?.avgBet || "7.6K", change: "średni zakład", neutral: true },
    { label: "Avg Win", value: data?.avgWin || "+4.0K", change: "śr. wygrana", positive: true },
    { label: "Avg Loss", value: data?.avgLoss || "-4.7K", change: "śr. przegrana", positive: false },
    { label: "Win Streak", value: data?.winStreak || "14", change: "rekord", positive: true },
    { label: "Loss Streak", value: data?.lossStreak || "5", change: "seria", neutral: true },
    { label: "Won / Lost", value: data?.wonLost || "316 / 169", change: "stosunek", neutral: true },
  ];

  return (
    <div style={{
      backgroundColor: '#09090b',
      color: '#ffffff',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '32px 24px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #27272a',
          paddingBottom: '20px',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#a855f7' }}>
              {data?.username || "cwelowiecki"}
            </h1>
            <p style={{ color: '#a1a1aa', fontSize: '14px', marginTop: '4px', margin: 0 }}>
              Kick ID: <span style={{ color: '#e4e4e7' }}>{data?.kickId || "9532684"}</span>
            </p>
          </div>
          <div style={{
            backgroundColor: '#18181b',
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid #27272a',
            textAlign: 'right'
          }}>
            <span style={{ fontSize: '12px', color: '#a1a1aa', display: 'block' }}>Total Profit/Loss</span>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#22c55e' }}>
              {loading ? "Ładowanie..." : (data?.totalProfit || "+481.9K")}
            </span>
          </div>
        </header>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {statsList.map((stat, idx) => (
            <div key={idx} style={{
              backgroundColor: '#18181b',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #27272a',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ fontSize: '13px', color: '#a1a1aa', marginBottom: '8px' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '12px',
                color: stat.neutral ? '#a1a1aa' : stat.positive ? '#22c55e' : '#ef4444'
              }}>
                {stat.change}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
