"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// Przykładowe dane do wykresu PnL
const pnlData = [
  { time: "Start", pnl: 0 },
  { time: "Bet 1", pnl: 15000 },
  { time: "Bet 2", pnl: 45000 },
  { time: "Bet 3", pnl: 32000 },
  { time: "Bet 4", pnl: 96400 },
  { time: "Bet 5", pnl: 150000 },
  { time: "Bet 6", pnl: 192800 },
  { time: "Bet 7", pnl: 240000 },
  { time: "Bet 8", pnl: 289100 },
  { time: "Bet 9", pnl: 310000 },
  { time: "Bet 10", pnl: 385500 },
  { time: "Bet 11", pnl: 350000 },
  { time: "Bet 12", pnl: 420000 },
  { time: "Bet 13", pnl: 481900 },
];

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState("All");

  return (
    <div className="min-h-screen bg-[#0d0914] text-white p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Nagłówek profilu */}
        <div className="bg-[#1b112c] border border-[#2b1b44] rounded-2xl p-5 shadow-lg">
          <h1 className="text-2xl font-bold tracking-wide">cwelowiecki</h1>
          <p className="text-xs text-purple-400 mt-1">Kick ID: 9532684</p>
        </div>

        {/* Pierwszy rząd statystyk (Główne) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#1b112c] border border-[#2b1b44] rounded-2xl p-5 text-center shadow-lg">
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider block mb-2">
              Total Profit/Loss
            </span>
            <span className="text-3xl font-extrabold text-[#00ff88]">
              +481.9K
            </span>
          </div>

          <div className="bg-[#1b112c] border border-[#2b1b44] rounded-2xl p-5 text-center shadow-lg">
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider block mb-2">
              Win Rate
            </span>
            <span className="text-3xl font-extrabold text-white">64.6%</span>
          </div>

          <div className="bg-[#1b112c] border border-[#2b1b44] rounded-2xl p-5 text-center shadow-lg">
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider block mb-2">
              ROI
            </span>
            <span className="text-3xl font-extrabold text-white">13.0%</span>
          </div>

          <div className="bg-[#1b112c] border border-[#2b1b44] rounded-2xl p-5 text-center shadow-lg">
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider block mb-2">
              Total Bets
            </span>
            <span className="text-3xl font-extrabold text-white">489</span>
          </div>
        </div>

        {/* Drugi rząd statystyk */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#1b112c] border border-[#2b1b44] rounded-2xl p-4 shadow-lg">
            <span className="text-[10px] font-semibold text-purple-300 uppercase block mb-1">
              Total Gains
            </span>
            <span className="text-xl font-bold text-[#00ff88]">+1.3M</span>
          </div>

          <div className="bg-[#1b112c] border border-[#2b1b44] rounded-2xl p-4 shadow-lg">
            <span className="text-[10px] font-semibold text-purple-300 uppercase block mb-1">
              Total Losses
            </span>
            <span className="text-xl font-bold text-[#ff4a4a]">-794.3K</span>
          </div>

          <div className="bg-[#1b112c] border border-[#2b1b44] rounded-2xl p-4 shadow-lg">
            <span className="text-[10px] font-semibold text-purple-300 uppercase block mb-1">
              Avg Bet Size
            </span>
            <span className="text-xl font-bold text-white">7.6K</span>
          </div>

          <div className="bg-[#1b112c] border border-[#2b1b44] rounded-2xl p-4 shadow-lg">
            <span className="text-[10px] font-semibold text-purple-300 uppercase block mb-1">
              Avg Win
            </span>
            <span className="text-xl font-bold text-[#00ff88]">+4.0K</span>
          </div>
        </div>

        {/* Trzeci rząd statystyk */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#1b112c] border border-[#2b1b44] rounded-2xl p-4 shadow-lg">
            <span className="text-[10px] font-semibold text-purple-300 uppercase block mb-1">
              Avg Loss
            </span>
            <span className="text-xl font-bold text-[#ff4a4a]">-4.7K</span>
          </div>

          <div className="bg-[#1b112c] border border-[#2b1b44] rounded-2xl p-4 shadow-lg">
            <span className="text-[10px] font-semibold text-purple-300 uppercase block mb-1">
              Win Streak
            </span>
            <span className="text-xl font-bold text-white">14</span>
          </div>

          <div className="bg-[#1b112c] border border-[#2b1b44] rounded-2xl p-4 shadow-lg">
            <span className="text-[10px] font-semibold text-purple-300 uppercase block mb-1">
              Loss Streak
            </span>
            <span className="text-xl font-bold text-white">5</span>
          </div>

          <div className="bg-[#1b112c] border border-[#2b1b44] rounded-2xl p-4 shadow-lg">
            <span className="text-[10px] font-semibold text-purple-300 uppercase block mb-1">
              Won / Lost
            </span>
            <span className="text-xl font-bold text-white">316 / 169</span>
          </div>
        </div>

        {/* Sekcja Wykresu PnL */}
        <div className="bg-[#1b112c] border border-[#2b1b44] rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h2 className="text-lg font-bold text-white">Cumulative PnL</h2>
            <div className="flex bg-[#0d0914] p-1 rounded-xl border border-[#2b1b44]">
              {["1D", "7D", "30D", "All"].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    timeframe === tf
                      ? "bg-[#7c3aed] text-white"
                      : "text-purple-300 hover:text-white"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Wykres Recharts */}
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={pnlData}>
                <defs>
                  <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#6b7280" fontSize={10} hide />
                <YAxis stroke="#6b7280" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0d0914",
                    borderColor: "#7c3aed",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="pnl"
                  stroke="#00ff88"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPnl)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
