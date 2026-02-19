'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface Strategy {
  name: string
  pnl: number
  trades: number
  winRate: number
  capital: number
}

export default function ArenaBattle() {
  const [activeTab, setActiveTab] = useState('live')
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Generate mock data
    const data: Strategy[] = [
      { name: 'VPIN', pnl: 12.11, trades: 45, winRate: 62, capital: 112.11 },
      { name: 'BollingerBands', pnl: 8.45, trades: 38, winRate: 58, capital: 108.45 },
      { name: 'TimeDecay', pnl: 6.23, trades: 52, winRate: 55, capital: 106.23 },
      { name: 'Momentum', pnl: 4.87, trades: 41, winRate: 51, capital: 104.87 },
      { name: 'HighProbConvergence', pnl: 3.12, trades: 35, winRate: 49, capital: 103.12 },
      { name: 'EMAArbitrage', pnl: 1.98, trades: 28, winRate: 47, capital: 101.98 },
      { name: 'VolatilityScorer', pnl: -0.45, trades: 33, winRate: 45, capital: 99.55 },
      { name: 'MarketMaking', pnl: -2.34, trades: 29, winRate: 43, capital: 97.66 },
    ]
    setStrategies(data)

    // Generate chart data
    const points = Array.from({ length: 20 }, (_, i) => ({
      time: `${10 + Math.floor(i / 2)}:${(i % 2) * 30 || '00'}`,
      VPIN: 100 + Math.sin(i * 0.3) * 10 + i * 0.5,
      BollingerBands: 100 + Math.sin(i * 0.25) * 8 + i * 0.4,
      TimeDecay: 100 + Math.sin(i * 0.2) * 6 + i * 0.3,
      Momentum: 100 + Math.sin(i * 0.15) * 5 + i * 0.2,
    }))
    setChartData(points)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Top Navigation */}
      <nav className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">Alpha</span>
            <span className="text-xl font-light text-gray-500">Arena</span>
            <span className="text-xs text-gray-400 ml-1">by Herbal</span>
          </div>
          
          <div className="flex items-center gap-8">
            {['LIVE', 'LEADERBOARD', 'MODELS', 'BLOG', 'ABOUT'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`text-sm font-medium transition-colors ${
                  activeTab === tab.toLowerCase() 
                    ? 'text-black' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <button className="text-sm text-gray-500 hover:text-black transition-colors">
            JOIN THE PLATFORM WAITLIST →
          </button>
        </div>
      </nav>

      {/* Ticker Bar */}
      <div className="bg-black text-white px-6 py-2 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-8 text-sm">
          {[
            { symbol: 'BTC', price: '$96,420', change: '+2.3%' },
            { symbol: 'ETH', price: '$2,840', change: '+1.8%' },
            { symbol: 'SOL', price: '$198', change: '-0.5%' },
            { symbol: 'VPIN', price: '$112.11', change: '+12.11%' },
            { symbol: 'MOMENTUM', price: '$104.87', change: '+4.87%' },
            { symbol: 'MARKET_MAKER', price: '$97.66', change: '-2.34%' },
          ].map((item) => (
            <div key={item.symbol} className="flex items-center gap-2 whitespace-nowrap">
              <span className="font-medium">{item.symbol}</span>
              <span className="text-gray-400">{item.price}</span>
              <span className={item.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}>
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Chart */}
          <div className="col-span-2">
            <div className="mb-6">
              <span className="text-xs text-gray-400 uppercase tracking-wider">Aggregate Index</span>
              <p className="text-sm text-gray-500 mt-1">
                This chart displays the aggregate performance across all strategies in the Arena.
              </p>
            </div>

            {/* Chart */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis 
                      dataKey="time" 
                      stroke="#ccc" 
                      tick={{ fill: '#999', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#ccc"
                      tick={{ fill: '#999', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      domain={['dataMin - 5', 'dataMax + 5']}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e5e5',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line type="monotone" dataKey="VPIN" stroke="#22c55e" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="BollingerBands" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="TimeDecay" stroke="#f59e0b" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Momentum" stroke="#ef4444" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Update Box */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
              <p className="text-sm leading-relaxed">
                <span className="font-semibold">Update:</span> The competition is currently live. 
                <span className="font-semibold">VPIN</span> is the current leader with a 
                <span className="font-semibold text-green-600">12.11% aggregate return</span>. 
                In total across all strategies, the portfolio is up 
                <span className="font-semibold text-green-600">$4,844</span>.
              </p>
            </div>

            {/* Description */}
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed mb-4">
                A decade ago, DeepMind revolutionized AI research. Their key insight was that 
                choosing the right environment – games – would lead to rapid progress in frontier AI.
              </p>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                At Herbal, we believe financial markets are the best training environment for the 
                next era of AI. They are the ultimate world-modeling engine and the only benchmark 
                that gets harder as AI gets smarter.
              </p>
              
              <p className="text-gray-600 leading-relaxed">
                Instead of games, we're using markets to train trading strategies that create their 
                own training data indefinitely. We're using techniques like open-ended learning and 
                large-scale RL to handle the complexity of markets, the final boss.
              </p>
            </div>
          </div>

          {/* Right Column - Leaderboard */}
          <div className="col-span-1">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <span className="text-xs text-gray-400 uppercase tracking-wider">Leaderboard</span>
              </div>
              
              <div className="divide-y divide-gray-100">
                {strategies.map((s, i) => (
                  <div key={s.name} className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 text-sm w-4">{i + 1}</span>
                      <span className="font-medium text-sm">{s.name}</span>
                    </div>
                    
                    <div className="text-right">
                      <p className={`font-semibold text-sm ${s.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {s.pnl >= 0 ? '+' : ''}{s.pnl.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Box */}
            <div className="mt-6 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Strategy Chat</span>
              </div>
              
              <div className="text-sm text-gray-500">
                STATUS: CONNECTING TO TRADING API
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
