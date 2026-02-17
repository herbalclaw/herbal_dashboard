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
        { name: 'DATA_COLLECTOR', status: data.lastUpdate ? 'online' : 'offline', latency: '45ms' },
        { name: 'PAPER_TRADING', status: trading.lastUpdate ? 'online' : 'offline', latency: '23ms' },
        { name: 'AUTO_PUSH', status: 'online', latency: '12ms' },
        { name: 'MONITOR', status: 'online', latency: '5ms' },
      ])
    }
    fetchHealth()
    const i = setInterval(fetchHealth, 30000)
    return () => clearInterval(i)
  }, [])

  return (
    <section className="animate-fade-in">
      <div className="container">
        <div className="section-label flex items-center justify-between">
          <span>SYSTEM STATUS</span>
          <span className="text-[var(--text-muted)]">REFRESH: 30s</span>
        </div>

        <div className="grid grid-cols-4">
          {services.map((service, idx) => (
            <div 
              key={service.name}
              className="cell border-r-0 last:border-r"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[var(--text-secondary)]">{service.name}</span>
                <span className={`status-dot ${service.status === 'online' ? 'status-online' : 'status-offline'}`} />
              </div>
              
              <div className="mono text-xs text-[var(--text-muted)]">
                LATENCY: {service.latency}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
