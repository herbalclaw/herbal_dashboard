'use client'

import { useState, useEffect } from 'react'

export default function ArenaBattle() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="p-8 text-white">Loading Arena...</div>
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Strategy Arena</h1>
          <p className="text-gray-400">Live battle between trading strategies</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Strategies', value: '8', color: 'text-emerald-400' },
            { label: 'Eliminated', value: '0', color: 'text-red-400' },
            { label: 'Top Performer', value: 'VPIN', color: 'text-yellow-400' },
            { label: 'Total Volume', value: '222', color: 'text-blue-400' },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Chart Placeholder */}
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 mb-8">
          <h2 className="text-xl font-bold mb-4">Live P&L Battle</h2>
          <div className="h-64 bg-gray-800/50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Chart will appear here</p>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-xl font-bold">Leaderboard</h2>
          </div>
          
          <div className="divide-y divide-gray-800">
            {[
              { name: 'VPIN', pnl: '+8.51%', trades: 60, win: 41 },
              { name: 'BollingerBands', pnl: '+8.17%', trades: 16, win: 48 },
              { name: 'TimeDecay', pnl: '+7.80%', trades: 43, win: 70 },
              { name: 'Momentum', pnl: '+6.53%', trades: 12, win: 59 },
              { name: 'HighProbConvergence', pnl: '+4.58%', trades: 34, win: 54 },
            ].map((s, i) => (
              <div key={s.name} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 w-6">{i + 1}</span>
                  <span>{s.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-bold">{s.pnl}</p>
                  <p className="text-sm text-gray-500">{s.trades} trades • {s.win}% win</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
