'use client'

import { useState, useEffect } from 'react'
import { fetchRepoStatus } from '../../lib/github'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-primary">Trading</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2">
          <Metric 
            value={`$${stats.totalPnl.toFixed(2)}`} 
            label="P&L"
            positive={stats.totalPnl >= 0}
          />
          <Metric value={stats.totalTrades.toString()} label="Trades" />
          <Metric value={`${stats.winRate.toFixed(0)}%`} label="Win Rate" />
          <Metric value={stats.openPositions.toString()} label="Open" />
        </div>
      </CardContent>
    </Card>
  )
}

function Metric({ value, label, positive }: { value: string; label: string; positive?: boolean }) {
  return (
    <div className="rounded-lg border bg-secondary/50 p-2 text-center">
      <div className={`font-mono text-sm font-bold truncate ${positive === true ? 'text-emerald-500' : positive === false ? 'text-red-500' : ''}`}>
        {value}
      </div>
      <div className="text-[10px] text-muted-foreground uppercase mt-1">{label}</div>
    </div>
  )
}
