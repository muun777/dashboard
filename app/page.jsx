"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const USER_DATA = {
  username: "cwelowiecki",
  kickId: "9532684",
  stats: {
    totalPnL: "+481.9K",
    winRate: "64.6%",
    roi: "13.0%",
    totalBets: 489,
    totalGains: "+1.3M",
    totalLosses: "-794.3K",
    avgBetSize: "7.6K",
    avgWin: "+4.0K",
    avgLoss: "-4.7K",
    winStreak: 14,
    lossStreak: 5,
    wonLost: "316/169",
  },
};

const CHART_DATA = [
  { bet: 0, pnl: 0 },
  { bet: 50, pnl: 40000 },
  { bet: 100, pnl: 96400 },
  { bet: 150, pnl: 145000 },
  { bet: 200, pnl: 192800 },
  { bet: 250, pnl: 220000 },
  { bet: 300, pnl: 289100 },
  { bet: 350, pnl: 385500 },
  { bet: 400, pnl: 340000 },
  { bet: 450, pnl: 410000 },
  { bet: 489, pnl: 481900 },
];

export default function ProfileDashboard() {
  const [timeframe, setTimeframe] = useState("All");

  return (
    <div className="min-h-screen bg-[#110B22] text-white p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-4">
        
        {/* NAGŁÓWEK PROFILU */}
        <div className="bg-[#1D1235] border border-[#2E1D52] rounded-xl p-5 shadow-lg">
          <h1 className="text-2xl font-bold tracking-wide">{USER_DATA.username}</h1>
          <p className="text-sm text-gray-400 mt-1">
            Kick ID: <span className="text-gray-300 font-mono">{USER_DATA.kickId}</span>
          </p>
        </div>

        {/* PIERWSZY RZĄD: GŁÓWNE STATYSTYKI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#1D1235] border border-[#2E1D52] rounded-xl p-5 flex flex-col justify-between">
            <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Total Profit/Loss</span>
            <span className="text-3xl font-extrabold text-emerald-400 mt-2">{USER_DATA.stats.totalPnL}</span>
          </div>

          <div className="bg-[#1D1235] border border-[#2E1D52] rounded-xl p-5 flex flex-col justify-between">
            <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Win Rate</span>
            <span className="text-3xl font-extrabold text-white mt-2">{USER_DATA.stats.winRate}</span>
          </div>

          <div className="bg-[#1D1235] border border-[#2E1D52] rounded-xl p-5 flex flex-col justify-between">
            <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">ROI</span>
            <span className="text-3xl font-extrabold text-white mt-2">{USER_DATA.stats.roi}</span>
          </div>

          <div className="bg-[#1D1235] border border-[#2E1D52] rounded-xl p-5 flex flex-col justify-between">
            <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Total Bets</span>
            <span className="text-3xl font-extrabold text-white mt-2">{USER_DATA.stats.totalBets}</span>
          </div>
        </div>

        {/* DRUGI RZĄD */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatTile label="Total Gains" value={USER_DATA.stats.totalGains} color="text-emerald-400" />
          <StatTile label="Total Losses" value={USER_DATA.stats.totalLosses} color="text-rose-500" />
          <StatTile label="Avg Bet Size" value={USER_DATA.stats.avgBetSize} />
          <StatTile label="Avg Win" value={USER_DATA.stats.avgWin} color="text-emerald-400" />
        </div>

        {/* TRZECI RZĄD */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatTile label="Avg Loss" value={USER_DATA.stats.avgLoss} color="text-rose-500" />
          <StatTile label="Win Streak" value={USER_DATA.stats.winStreak} />
          <StatTile label="Loss Streak" value={USER_DATA.stats.lossStreak} />
          <StatTile label="Won/Lost" value={USER_DATA.stats.wonLost} />
        </div>

        {/* SEKCJA WYKRESU */}
        <div className="bg-[#1D1235] border border-[#2E1D52] rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-bold text-white">Cumulative PnL</h2>
            <div className="flex bg-[#110B22] p-1 rounded-lg border border-[#2E1D52] text-xs font-semibold">
              {["1D", "7D", "30D", "All"].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    timeframe === tf
                      ? "bg-[#6D28D9] text-white shadow"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[320px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2E1D52" vertical={false} />
                <XAxis dataKey="bet" hide />
                <YAxis
                  stroke="#6B7280"
                  fontSize={12}
                  tickFormatter={(val) => `${(val / 1000).toFixed(1)}K`}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#110B22",
                    borderColor: "#2E1D52",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  formatter={(value) => [`+${(value / 1000).toFixed(1)}K`, "PnL"]}
                  labelFormatter={(label) => `Zakład #${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="pnl"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#pnlGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatTile({ label, value, color = "text-white" }) {
  return (
    <div className="bg-[#1D1235] border border-[#2E1D52] rounded-xl p-4 flex flex-col justify-between">
      <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">{label}</span>
      <span className={`text-xl font-bold mt-1 ${color}`}>{value}</span>
    </div>
  );
}
