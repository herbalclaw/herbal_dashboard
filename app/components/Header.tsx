'use client'

import { useState, useEffect } from 'react'
import { Activity, Database, TrendingUp, Settings } from 'lucide-react'

interface HeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }))
    }
    update()
    const i = setInterval(update, 1000)
    return () => clearInterval(i)
  }, [])

  const tabs = [
    { id: 'overview', label: 'OVERVIEW', icon: Activity },
    { id: 'data', label: 'DATA', icon: Database },
    { id: 'trading', label: 'TRADING', icon: TrendingUp },
  ]

  return (
    <header className="border-b border-[var(--border)]">
      <div className="container">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <span className="status-dot status-online" />
            <span className="text-sm font-semibold">HERBAL</span>
            <span className="text-xs text-[var(--text-muted)]">TERMINAL v2.1</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="mono text-sm text-[var(--text-secondary)]">{time} UTC</span>
            <button className="btn">
              <Settings size={12} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 text-xs font-medium border-r border-[var(--border)]
                  ${isActive 
                    ? 'bg-[var(--bg-cell)] text-[var(--text-primary)] border-b-2 border-b-[var(--accent)]' 
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-cell)]'
                  }
                `}
              >
                <Icon size={12} />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
