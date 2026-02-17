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
    <header className="sticky top-0 z-50 bg-[#0c0c0e]/80 backdrop-blur-xl border-b border-[#27272a]">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              <span className="text-xl font-bold tracking-tight">Herbal</span>
            </div>
            <span className="text-xs text-[#71717a] px-2 py-1 rounded-md bg-[#141416] border border-[#27272a]">
              Terminal v2.1
            </span>
          </div>

          <div className="font-mono text-sm text-[#71717a]">
            {time} UTC
          </div>
        </div>

        <nav className="flex gap-1 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative px-6 py-4 text-sm font-medium transition-colors duration-200
                ${activeTab === tab.id 
                  ? 'text-white' 
                  : 'text-[#71717a] hover:text-[#a1a1aa]'
                }
              `}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10b981]" />
              )}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
