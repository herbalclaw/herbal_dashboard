'use client'

import { useState } from 'react'
import Header from './components/Header'
import SystemHealthSection from './components/SystemHealthSection'
import DataCollectorSection from './components/DataCollectorSection'
import PaperTradingSection from './components/PaperTradingSection'

export default function Home() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="p-4 max-w-5xl mx-auto">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <SystemHealthSection />
            <DataCollectorSection />
            <PaperTradingSection />
          </div>
        )}
        
        {activeTab === 'data' && <DataCollectorSection />}
        {activeTab === 'trading' && <PaperTradingSection />}
      </main>
    </div>
  )
}
