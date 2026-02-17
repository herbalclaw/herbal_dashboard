'use client'

import { useState, useEffect } from 'react'
import { fetchRepoStatus } from '../../lib/github'

interface DataCollectorSectionProps {
  compact?: boolean
}

export default function DataCollectorSection({ compact = false }: DataCollectorSectionProps) {
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
    <section className="animate-fade-in delay-100">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-[#737373] uppercase tracking-wider">Data Feed</h2>
      </div>

      <div className="bg-card rounded-xl border border-[#262626] overflow-hidden">
        <div className="grid grid-cols-5 divide-x divide-[#262626]">
          {metrics.map((metric, idx) => (
            <div 
              key={metric.label}
              className="p-4 text-center transition-colors hover:bg-[#1a1a1a]"
            >
              <div className={`font-mono text-sm font-semibold mb-1 ${
                'positive' in metric 
                  ? metric.positive ? 'text-[#22c55e]' : 'text-[#ef4444]'
                  : 'text-white'
              }`}>
                {metric.value}
              </div>
              <div className="text-[10px] text-[#737373] uppercase tracking-wider">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
