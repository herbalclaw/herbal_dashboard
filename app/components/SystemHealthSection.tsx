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
        { name: 'Monitor', status: 'online', latency: '5ms' },
      ])
    }
    fetchHealth()
    const i = setInterval(fetchHealth, 30000)
    return () => clearInterval(i)
  }, [])

  return (
    <section className="animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-[#737373] uppercase tracking-wider">System Status</h2>
        <span className="text-[10px] text-[#737373]">Auto-refresh: 30s</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {services.map((service, idx) => (
          <div 
            key={service.name}
            className="group bg-card rounded-xl border border-[#262626] p-4 transition-all duration-200 hover:border-[#404040] bg-card-hover animate-fade-in"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`status-dot ${service.status === 'online' ? 'status-online' : 'status-offline'}`} />
                <span className="text-xs font-medium text-white">{service.name}</span>
              </div>
            </div>
            
            <div className="font-mono text-xs text-[#737373]">
              {service.latency}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
