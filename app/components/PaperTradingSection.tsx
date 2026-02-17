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

  const metrics = [
    { 
      label: 'P&L', 
      value: `$${stats.totalPnl.toFixed(2)}`,
      positive: stats.totalPnl >= 0
    },
    { label: 'TRADES', value: stats.totalTrades.toString() },
    { label: 'WIN_RATE', value: `${stats.winRate.toFixed(0)}%` },
    { label: 'OPEN', value: stats.openPositions.toString() },
  ]

  return (
    <section className="animate-fade-in">
      <div className="container">
        <div className="section-label">TRADING PERFORMANCE</div>

        <div className="data-grid grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="data-cell">
              <div className={`mono text-xl font-semibold ${
                'positive' in metric 
                  ? metric.positive ? 'text-up' : 'text-down'
                  : 'text-primary'
              }`}>
                {metric.value}
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-1">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
