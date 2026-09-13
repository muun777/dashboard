"use client";

import React, { useState, useEffect } from 'react';

export default function Home() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/stats');
        const json = await res.json();
        if (json.success && json.stats) {
          setStats(json.stats);
        }
      } catch (e) {
        console.error("Błąd pobierania statystyk:", e);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const statsList = [
    { label: "Win Rate", value: stats?.winRate || "0%", change: "wygrane", positive: true },
    { label: "ROI", value: stats?.roi || "0%", change: "zwrot", positive: true },
    { label: "Total Bets", value: stats?.totalBets || "0", change: "ogółem", neutral: true },
    { label: "Total Gains", value: stats?.totalGains || "0K", change: "wygrane", positive: true },
    { label: "Total Losses", value: stats?.totalLosses || "0K", change: "przegrane", positive: false },
    { label: "Avg Bet Size", value: stats?.avgBet || "0K", change: "średni zakład", neutral: true },
    { label: "Win Streak", value: stats?.winStreak || "0", change: "rekord", positive: true },
    { label: "Loss Streak", value: stats?.lossStreak || "0", change: "seria", neutral: true },
    { label: "Won / Lost", value: stats?.wonLost || "0 / 0", change: "stosunek", neutral: true },
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
              NajwiekszyGyat
            </h1>
            <p style={{ color: '#a1a1aa', fontSize: '14px', marginTop: '4px', margin: 0 }}>
              Profil Kick / s7k4
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
              {loading ? "Ładowanie..." : (stats?.totalProfit || "0K")}
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
