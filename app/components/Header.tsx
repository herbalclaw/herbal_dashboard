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
    <header className="sticky top-0 z-50 bg-[#0a0a0c]/90 backdrop-blur-xl border-b border-[#27272a]">
      <div className="container">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <span className="text-lg font-bold tracking-tight">Herbal</span>
            </div>
            <span className="text-[10px] text-[#71717a] px-2 py-0.5 rounded bg-[#141416] border border-[#27272a]">
              Terminal v2.1
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="font-mono text-sm text-[#71717a]">
              {time} UTC
            </div>
            <button className="btn btn-ghost p-2">
              <Settings size={16} />
            </button>
          </div>
        </div>

        <nav className="flex gap-1 -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors
                  ${activeTab === tab.id 
                    ? 'text-white' 
                    : 'text-[#71717a] hover:text-[#a1a1aa]'
                  }
                `}
              >
                <Icon size={16} />
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10b981]" />
                )}
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
