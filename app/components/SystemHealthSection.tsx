'use client'

import { useState, useEffect } from 'react'
import { fetchRepoStatus } from '../../lib/github'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Service {
  name: string
  status: 'online' | 'offline'
  latency: string
}

export default function SystemHealthSection() {
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    async function fetchHealth() {
      const [data, trading] = await Promise.all([
        fetchRepoStatus('polymarket-data-collector'),
        fetchRepoStatus('polymarket-strategy-tester')
      ])

      setServices([
        { name: 'Data Collector', status: data.lastUpdate ? 'online' : 'offline', latency: '45ms' },
        { name: 'Paper Trading', status: trading.lastUpdate ? 'online' : 'offline', latency: '23ms' },
        { name: 'Auto Push', status: 'online', latency: '12ms' },
        { name: 'Monitor', status: 'online', latency: '5ms' },
      ])
    }
    fetchHealth()
    const i = setInterval(fetchHealth, 30000)
    return () => clearInterval(i)
  }, [])

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-primary">System Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {services.map((s) => (
            <div key={s.name} className="rounded-lg border bg-secondary/50 p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className={`h-2 w-2 rounded-full ${s.status === 'online' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <span className="text-xs font-medium truncate">{s.name}</span>
              </div>
              <div className="font-mono text-xs text-muted-foreground">{s.latency}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
