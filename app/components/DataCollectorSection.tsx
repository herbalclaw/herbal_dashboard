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
      <div className="container">
        <div className="flex items-center justify-between mb-5">
          <span className="section-title">Data Feed</span>
        </div>

        <div className="card">
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
    <div className="p-6 text-center transition-colors hover:bg-[var(--bg-hover)]">
      <div className={`mono text-xl font-semibold mb-2 ${
        positive === true ? 'text-[var(--profit)]' : 
        positive === false ? 'text-[var(--loss)]' : 
        'text-[var(--text-primary)]'
      }`}>
        {value}
      </div>
      <div className="section-title">{label}</div>
    </div>
  )
}
