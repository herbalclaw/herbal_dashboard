'use client'

import { useState, useEffect } from 'react'

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
    { id: 'overview', label: 'Overview' },
    { id: 'data', label: 'Data Feed' },
    { id: 'trading', label: 'Trading' },
  ]

  return (
    <header className="glass sticky top-0 z-50">
      <div className="container-center">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="status-dot status-online animate-pulse" />
              <span className="text-lg font-bold tracking-tight">Herbal</span>
            </div>
            <span className="text-xs text-[var(--text-muted)] px-2 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)]">
              Terminal v2.1
            </span>
          </div>

          {/* Time */}
          <div className="font-mono text-sm text-[var(--text-secondary)]">
            {time} UTC
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex gap-1 pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative px-6 py-4 text-sm font-medium transition-all duration-200
                ${activeTab === tab.id 
                  ? 'text-white' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }
              `}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]" />
              )}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
