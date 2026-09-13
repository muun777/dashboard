import React from 'react';

export default function Home() {
  const stats = [
    { label: "Win Rate", value: "64.6%", change: "+2.1%", positive: true },
    { label: "ROI", value: "13.0%", change: "+0.5%", positive: true },
    { label: "Total Bets", value: "489", change: "12 dzisiaj", neutral: true },
    { label: "Total Gains", value: "+1.3M", change: "wygrane", positive: true },
    { label: "Total Losses", value: "-794.3K", change: "przegrane", positive: false },
    { label: "Avg Bet Size", value: "7.6K", change: "średni zakład", neutral: true },
    { label: "Avg Win", value: "+4.0K", change: "śr. wygrana", positive: true },
    { label: "Avg Loss", value: "-4.7K", change: "śr. przegrana", positive: false },
    { label: "Win Streak", value: "14", change: "rekord", positive: true },
    { label: "Loss Streak", value: "5", change: "seria", neutral: true },
    { label: "Won / Lost", value: "316 / 169", change: "stosunek", neutral: true },
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
        {/* Nagłówek */}
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
              cwelowiecki
            </h1>
            <p style={{ color: '#a1a1aa', fontSize: '14px', marginTop: '4px', margin: 0 }}>
              Kick ID: <span style={{ color: '#e4e4e7' }}>9532684</span>
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
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#22c55e' }}>+481.9K</span>
          </div>
        </header>

        {/* Kafelki ze statystykami */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {stats.map((stat, idx) => (
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

        {/* Sekcja Wykresu */}
        <div style={{
          backgroundColor: '#18181b',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #27272a'
        }}>
          <div style={{
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#f4f4f5' }}>
              Cumulative PnL
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['1D', '7D', '30D', 'All'].map((period, i) => (
                <button key={period} style={{
                  backgroundColor: i === 3 ? '#a855f7' : '#27272a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Podgląd miejsca na wykres */}
          <div style={{
            height: '240px',
            backgroundColor: '#09090b',
            borderRadius: '8px',
            border: '1px dashed #3f3f46',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            color: '#71717a',
            fontSize: '14px'
          }}>
            [ Miejsce na interaktywny wykres Recharts / Chart.js ]
          </div>
        </div>
      </div>
    </div>
  );
}
