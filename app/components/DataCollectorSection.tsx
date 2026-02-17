'use client'

import { useState, useEffect } from 'react'
import { fetchRepoStatus } from '../../lib/github'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-primary">Data Feed</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-5 gap-2">
          <Metric value={stats.totalUpdates.toLocaleString()} label="Updates" />
          <Metric value={stats.updatesPerSecond.toFixed(1)} label="/Sec" />
          <Metric value={stats.activeWindows.toString()} label="Windows" />
          <Metric value={`$${stats.lastPrice.toFixed(3)}`} label="Price" />
          <Metric 
            value={`${stats.priceChange >= 0 ? '+' : ''}${(stats.priceChange * 100).toFixed(1)}%`} 
            label="Change"
            positive={stats.priceChange >= 0}
          />
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
