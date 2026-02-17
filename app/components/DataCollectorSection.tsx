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
    { label: 'UPDATES', value: stats.totalUpdates.toLocaleString() },
    { label: 'PER_SEC', value: stats.updatesPerSecond.toFixed(1) },
    { label: 'WINDOWS', value: stats.activeWindows.toString() },
    { label: 'PRICE', value: `$${stats.lastPrice.toFixed(3)}` },
    { 
      label: 'CHANGE', 
      value: `${stats.priceChange >= 0 ? '+' : ''}${(stats.priceChange * 100).toFixed(1)}%`,
      positive: stats.priceChange >= 0
    },
  ]

  return (
    <section className="animate-fade-in">
      <div className="container">
        <div className="section-label">DATA FEED</div>

        <div className="data-grid grid-cols-5">
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
