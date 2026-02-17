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
      label: 'Total P&L', 
      value: `$${stats.totalPnl.toFixed(2)}`,
      positive: stats.totalPnl >= 0
    },
    { label: 'Total Trades', value: stats.totalTrades.toString() },
    { label: 'Win Rate', value: `${stats.winRate.toFixed(0)}%` },
    { label: 'Open Positions', value: stats.openPositions.toString() },
  ]

  return (
    <section className="animate-fade-in">
      <div className="container">
        <div className="section-header">
          <span className="section-title">Trading Performance</span>
        </div>

        <div className="card">
          <div className="grid grid-cols-4 divide-x divide-[var(--border)]">
            {metrics.map((metric, idx) => (
              <div 
                key={metric.label}
                className="p-6 text-center transition-colors hover:bg-[var(--bg-hover)]"
              >
                <div className={`metric-value-sm ${
                  'positive' in metric 
                    ? metric.positive ? 'text-[var(--profit)]' : 'text-[var(--loss)]'
                    : 'text-[var(--text-primary)]'
                }`}>
                  {metric.value}
                </div>
                <div className="metric-label">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
