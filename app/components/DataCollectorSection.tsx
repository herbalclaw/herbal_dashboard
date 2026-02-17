'use client'

import { useState, useEffect } from 'react'
import { fetchRepoStatus } from '../../lib/github'

export default function DataCollectorSection() {
  const [stats, setStats] = useState({
    totalUpdates: 15247,
    updatesPerSecond: 2.4,
    activeWindows: 3,
    lastPrice: 0.6842,
    priceChange: 0.0234
  })

  useEffect(() => {
    fetchRepoStatus('polymarket-data-collector')
  }, [])

  const metrics = [
    { label: 'Total Updates', value: stats.totalUpdates.toLocaleString() },
    { label: 'Updates/Sec', value: stats.updatesPerSecond.toFixed(1) },
    { label: 'Active Windows', value: stats.activeWindows.toString() },
    { label: 'Last Price', value: `$${stats.lastPrice.toFixed(3)}` },
    { 
      label: 'Change', 
      value: `${stats.priceChange >= 0 ? '+' : ''}${(stats.priceChange * 100).toFixed(1)}%`,
      positive: stats.priceChange >= 0
    },
  ]

  return (
    <section className="animate-fade-in">
      <div className="container">
        <div className="section-header">
          <span className="section-title">Data Feed</span>
        </div>

        <div className="card">
          <div className="grid grid-cols-5 divide-x divide-[var(--border)]">
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
