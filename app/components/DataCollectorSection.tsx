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

  return (
    <section className="animate-fade-in">
      <div className="container-center">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Data Feed</h2>
        </div>

        <div className="card overflow-hidden">
          <div className="grid grid-cols-5 divide-x divide-[var(--border)]">
            <MetricBox label="Total Updates" value={stats.totalUpdates.toLocaleString()} />
            <MetricBox label="Updates/Sec" value={stats.updatesPerSecond.toFixed(1)} />
            <MetricBox label="Active Windows" value={stats.activeWindows.toString()} />
            <MetricBox label="Last Price" value={`$${stats.lastPrice.toFixed(3)}`} />
            <MetricBox 
              label="Change" 
              value={`${stats.priceChange >= 0 ? '+' : ''}${(stats.priceChange * 100).toFixed(1)}%`}
              positive={stats.priceChange >= 0}
            />
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
