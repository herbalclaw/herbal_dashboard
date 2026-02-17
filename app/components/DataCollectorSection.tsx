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
        <div className="section-header">
          <h2 className="section-title">Data Feed</h2>
        </div>

        <div className="card">
          <div className="grid grid-cols-5 divide-x divide-[#27272a]">
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
