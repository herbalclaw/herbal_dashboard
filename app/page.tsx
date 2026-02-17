'use client'

import { useState } from 'react'
import Header from './components/Header'
import SystemHealthSection from './components/SystemHealthSection'
import DataCollectorSection from './components/DataCollectorSection'
import PaperTradingSection from './components/PaperTradingSection'
import TradingDashboard from './components/TradingDashboard'

export default function Home() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-black">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="py-6 space-y-6">
        {activeTab === 'overview' && (
          <>
            <SystemHealthSection />
            <DataCollectorSection />
            <PaperTradingSection />
          </>
        )}
        
        {activeTab === 'data' && <DataCollectorSection />}
        {activeTab === 'trading' && <TradingDashboard />}
      </main>
    </div>
  )
}
