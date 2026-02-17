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
      <div className="container-center">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Trading Performance</h2>
        </div>

        <div className="card overflow-hidden">
          <div className="grid grid-cols-4 divide-x divide-[var(--border)]">
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
    <div className="p-5 text-center transition-colors hover:bg-[var(--bg-tertiary)]">
      <div className={`font-mono text-lg font-semibold mb-2 ${
        positive === true ? 'text-[var(--success)]' : 
        positive === false ? 'text-[var(--danger)]' : 
        'text-white'
      }`}>
        {value}
      </div>
      <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
        {label}
      </div>
    </div>
  )
}
