"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats");
        if (!res.ok) {
          throw new Error("Błąd podczas pobierania danych");
        }
        const data = await res.json();
        if (data.success && data.stats) {
          setStats(data.stats);
        } else {
          throw new Error(data.error || "Brak dostępnych statystyk");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="mt-4 text-slate-400">Ładowanie statystyk...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="rounded-lg border border-red-500/30 bg-red-950/20 p-6 text-center">
          <p className="text-red-400">Błąd: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500"
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white md:p-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 border-b border-slate-800 pb-4">
          <h1 className="text-3xl font-bold tracking-tight text-purple-400">
            Dashboard Statystyk
          </h1>
          <p className="text-sm text-slate-400">Podsumowanie wyników z zakładów</p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Całkowity Profit" 
            value={stats.totalProfit} 
            color={stats.totalProfit?.startsWith("+") ? "text-green-400" : "text-red-400"} 
          />
          <StatCard 
            title="Całkowity Obrót (Wagered)" 
            value={stats.totalGains || stats.totalWagered} 
            color="text-purple-400" 
          />
          <StatCard 
            title="Win Rate" 
            value={stats.winRate} 
            color="text-blue-400" 
          />
          <StatCard 
            title="Punkty / Saldo" 
            value={stats.wonLost || stats.totalPoints} 
            color="text-yellow-400" 
          />
          <StatCard 
            title="Średnia Stawka" 
            value={stats.avgBet || "N/A"} 
          />
          <StatCard 
            title="ROI" 
            value={stats.roi} 
          />
          <StatCard 
            title="Liczba Zakładów" 
            value={stats.totalBets} 
          />
          <StatCard 
            title="Win / Loss Streak" 
            value={`${stats.winStreak || 0} / ${stats.lossStreak || 0}`} 
          />
        </div>
      </div>
    </main>
  );
}

function StatCard({ title, value, color = "text-white" }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg backdrop-blur-sm">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</p>
      <p className={`mt-2 text-2xl font-bold ${color}`}>{value || "—"}</p>
    </div>
  );
}
