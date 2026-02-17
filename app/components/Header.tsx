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
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'data', label: 'Data Feed', icon: Database },
    { id: 'trading', label: 'Paper Trading', icon: TrendingUp },
  ]

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-secondary)]/90 backdrop-blur-xl border-b border-[var(--border)]">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center" style={{ gap: '12px' }}>
            <div className="flex items-center" style={{ gap: '8px' }}>
              <div className="w-2 h-2 rounded-full bg-[var(--profit)] animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <span className="text-lg font-semibold tracking-tight">Herbal</span>
            </div>
            <span className="text-[10px] text-[var(--text-tertiary)] px-2 py-1 rounded bg-[var(--bg-tertiary)] border border-[var(--border)]">
              Terminal v2.1
            </span>
          </div>

          <div className="flex items-center" style={{ gap: '16px' }}>
            <div className="mono text-sm text-[var(--text-tertiary)]">
              {time} UTC
            </div>
            <button className="btn btn-ghost p-2">
              <Settings size={16} />
            </button>
          </div>
        </div>

        <nav className="flex" style={{ gap: '4px' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex items-center px-5 py-4 text-sm font-medium transition-colors relative
                  ${activeTab === tab.id 
                    ? 'text-[var(--text-primary)]' 
                    : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                  }
                `}
                style={{ gap: '8px' }}
              >
                <Icon size={16} strokeWidth={2} />
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]" />
                )}
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
