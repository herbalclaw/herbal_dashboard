'use client'

import { useState } from 'react'
import Header from './components/Header'
import SystemHealthSection from './components/SystemHealthSection'
import DataCollectorSection from './components/DataCollectorSection'
import PaperTradingSection from './components/PaperTradingSection'

export default function Home() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="py-8 space-y-8">
        {activeTab === 'overview' && (
          <>
            <SystemHealthSection />
            <DataCollectorSection />
            <PaperTradingSection />
          </>
        )}
        
        {activeTab === 'data' && <DataCollectorSection />}
        {activeTab === 'trading' && <PaperTradingSection />}
      </main>
    </div>
  )
}
