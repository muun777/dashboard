"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLiveStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stats", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Nie udało się pobrać statystyk na żywo.");
      }
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="mt-4 text-slate-400">Pobieranie najświeższych statystyk z API...</p>
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
            onClick={fetchLiveStats} 
            className="mt-4 rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500"
          >
            Odśwież dane
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white md:p-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-purple-400">
              Dashboard Statystyk
            </h1>
            <p className="text-sm text-slate-400">Dane pobierane na żywo z API Predictions</p>
          </div>
          <button
            onClick={fetchLiveStats}
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium hover:bg-purple-500 transition-colors"
          >
            🔄 Odśwież API
          </button>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Całkowity Profit" 
            value={stats.totalProfit} 
            color={stats.totalProfit?.startsWith("+") ? "text-green-400" : "text-red-400"} 
          />
          <StatCard 
            title="Suma Wygranych (Gains)" 
            value={stats.totalGains} 
            color="text-purple-400" 
          />
          <StatCard 
            title="Win Rate" 
            value={stats.winRate} 
            color="text-blue-400" 
          />
          <StatCard 
            title="Wygrane / Przegrane" 
            value={stats.wonLost} 
            color="text-yellow-400" 
          />
          <StatCard 
            title="Średnia Stawka" 
            value={stats.avgBet} 
          />
          <StatCard 
            title="ROI" 
            value={stats.roi} 
          />
          <StatCard 
            title="Liczba Zakładów" 
            value={stats.totalBets} 
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
