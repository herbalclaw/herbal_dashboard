'use client'

import { useState, useEffect } from 'react'
import { fetchRepoStatus } from '../../lib/github'

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
        { name: 'Process Monitor', status: 'online', latency: '5ms' },
      ])
    }
    fetchHealth()
    const i = setInterval(fetchHealth, 30000)
    return () => clearInterval(i)
  }, [])

  return (
    <section className="animate-fade-in">
      <div className="container-center">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">System Status</h2>
          <span className="text-xs text-[var(--text-muted)]">Auto-refresh: 30s</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {services.map((service, idx) => (
            <div 
              key={service.name}
              className="card p-5 animate-fade-in"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`status-dot ${service.status === 'online' ? 'status-online' : 'status-offline'}`} />
                <span className="text-sm font-medium">{service.name}</span>
              </div>
              
              <div className="font-mono text-xs text-[var(--text-muted)]">
                Latency: {service.latency}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
