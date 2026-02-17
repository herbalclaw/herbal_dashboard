'use client'

import { useState, useEffect } from 'react'
import { fetchRepoStatus } from '../../lib/github'

export default function PaperTradingSection() {
  const [stats, setStats] = useState({
    totalTrades: 524,
    totalPnl: -1.70,
    winRate: 44.1,
    openPositions: 1,
  })

  useEffect(() => {
    fetchRepoStatus('polymarket-strategy-tester')
  }, [])

  return (
    <section className="animate-fade-in">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Trading Performance</h2>
        </div>

        <div className="card">
          <div className="grid grid-cols-4 divide-x divide-[#27272a]">
            <MetricBox 
              label="Total P&L" 
              value={`$${stats.totalPnl.toFixed(2)}`}
              positive={stats.totalPnl >= 0}
            />
            <MetricBox label="Total Trades" value={stats.totalTrades.toString()} />
            <MetricBox label="Win Rate" value={`${stats.winRate.toFixed(0)}%`} />
            <MetricBox label="Open Positions" value={stats.openPositions.toString()} />
          </div>
        </div>
      </div>
    </section>
  )
}

function MetricBox({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="p-6 text-center transition-colors hover:bg-[#1a1a1d]">
      <div className={`metric-value ${
        positive === true ? 'text-[#22c55e]' : 
        positive === false ? 'text-[#ef4444]' : 
        'text-white'
      }`}>
        {value}
      </div>
      <div className="metric-label">{label}</div>
    </div>
  )
}
