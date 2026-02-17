'use client'

import { useState, useEffect } from 'react'

interface HeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }))
    update()
    const i = setInterval(update, 1000)
    return () => clearInterval(i)
  }, [])

  const tabs = ['Overview', 'Data', 'Trading']

  return (
    <header className="border-b bg-card">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold tracking-tight">HERBAL</span>
          </div>
          <span className="text-xs text-muted-foreground">Terminal v2.1</span>
        </div>
        <span className="font-mono text-xs text-muted-foreground">{time} UTC</span>
      </div>

      <nav className="flex border-t">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab.toLowerCase())}
            className={`flex-1 px-4 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors
              ${activeTab === tab.toLowerCase() 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            {tab}
          </button>
        ))}
      </nav>
    </header>
  )
}
