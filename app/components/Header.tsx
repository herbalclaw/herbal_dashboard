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
    { id: 'data', label: 'Data' },
    { id: 'trading', label: 'Trading' },
  ]

  return (
    <header className="sticky top-0 z-50 glass border-b border-[#262626]">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="status-dot status-online animate-pulse-slow" />
              <span className="font-semibold text-sm tracking-tight">Herbal</span>
            </div>
            <span className="text-xs text-[#737373] px-2 py-0.5 rounded-full bg-[#1a1a1a] border border-[#262626]">
              v2.1
            </span>
          </div>
          
          <div className="font-mono text-xs text-[#737373]">
            {time} UTC
          </div>
        </div>

        <nav className="flex gap-1 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative px-4 py-3 text-xs font-medium transition-colors
                ${activeTab === tab.id 
                  ? 'text-white' 
                  : 'text-[#737373] hover:text-white'
                }
              `}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00d4aa]" />
              )}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
