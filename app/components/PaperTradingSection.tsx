'use client'

import { useState, useEffect } from 'react'
import { fetchRepoStatus } from '../../lib/github'

interface PaperTradingSectionProps {
  compact?: boolean
}

export default function PaperTradingSection({ compact = false }: PaperTradingSectionProps) {
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
    { label: 'Trades', value: stats.totalTrades.toString() },
    { label: 'Win Rate', value: `${stats.winRate.toFixed(0)}%` },
    { label: 'Open', value: stats.openPositions.toString() },
  ]

  return (
    <section className="animate-fade-in delay-200">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-[#737373] uppercase tracking-wider">Trading</h2>
      </div>

      <div className="bg-card rounded-xl border border-[#262626] overflow-hidden">
        <div className="grid grid-cols-4 divide-x divide-[#262626]">
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
003e
        </div>
      </div>
    </section>
  )
}
