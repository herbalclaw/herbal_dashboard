'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface Strategy {
  rank: number
  model: string
  accountValue: number
  returnPct: number
  totalPnL: number
  fees: number
  winRate: number
  biggestWin: number
  biggestLoss: number
  sharpe: number
  trades: number
}

export default function ArenaBattle() {
  const [activeTab, setActiveTab] = useState('leaderboard')
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Generate mock data matching Alpha Arena format
    const data: Strategy[] = [
      { rank: 1, model: 'Mystery Model', accountValue: 112110, returnPct: 12.11, totalPnL: 4844, fees: 245, winRate: 58, biggestWin: 892, biggestLoss: -234, sharpe: 1.84, trades: 89 },
      { rank: 2, model: 'Grok 4', accountValue: 108450, returnPct: 8.45, totalPnL: 3380, fees: 198, winRate: 54, biggestWin: 654, biggestLoss: -312, sharpe: 1.52, trades: 76 },
      { rank: 3, model: 'Claude Sonnet', accountValue: 106230, returnPct: 6.23, totalPnL: 2492, fees: 167, winRate: 52, biggestWin: 521, biggestLoss: -289, sharpe: 1.38, trades: 68 },
      { rank: 4, model: 'GPT-5', accountValue: 104870, returnPct: 4.87, totalPnL: 1948, fees: 142, winRate: 49, biggestWin: 445, biggestLoss: -356, sharpe: 1.15, trades: 62 },
      { rank: 5, model: 'DeepSeek V3', accountValue: 103120, returnPct: 3.12, totalPnL: 1248, fees: 98, winRate: 47, biggestWin: 387, biggestLoss: -298, sharpe: 0.98, trades: 54 },
      { rank: 6, model: 'VPIN Strategy', accountValue: 101980, returnPct: 1.98, totalPnL: 792, fees: 76, winRate: 45, biggestWin: 298, biggestLoss: -245, sharpe: 0.87, trades: 48 },
      { rank: 7, model: 'Momentum Bot', accountValue: 99550, returnPct: -0.45, totalPnL: -180, fees: 89, winRate: 43, biggestWin: 234, biggestLoss: -412, sharpe: 0.62, trades: 52 },
      { rank: 8, model: 'Market Maker', accountValue: 97660, returnPct: -2.34, totalPnL: -936, fees: 112, winRate: 41, biggestWin: 198, biggestLoss: -534, sharpe: 0.34, trades: 61 },
    ]
    setStrategies(data)

    // Generate chart data
    const points = Array.from({ length: 20 }, (_, i) => ({
      day: i + 1,
      'Mystery Model': 100 + Math.sin(i * 0.3) * 5 + i * 0.6,
      'Grok 4': 100 + Math.sin(i * 0.25) * 4 + i * 0.45,
      'Claude Sonnet': 100 + Math.sin(i * 0.2) * 3 + i * 0.35,
      'GPT-5': 100 + Math.sin(i * 0.15) * 2.5 + i * 0.25,
    }))
    setChartData(points)
  }, [])

  if (!mounted) return null

  const topPerformer = strategies[0]

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-black font-mono text-sm">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-black px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold tracking-tight">Alpha</span>
            <span className="text-lg font-light">Arena</span>
            <span className="text-xs text-gray-500 ml-1">by Herbal</span>
          </div>
          
          <div className="flex items-center gap-6">
            {['LIVE', 'LEADERBOARD', 'MODELS', 'BLOG', 'ABOUT'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`text-xs tracking-wider transition-colors ${
                  activeTab === tab.toLowerCase() 
                    ? 'text-black font-semibold' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <button className="text-xs text-gray-500 hover:text-black transition-colors">
            JOIN THE PLATFORM WAITLIST →
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight mb-4">LEADERBOARD</h1>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">COMPETITION:</span>
              <select className="bg-white border border-black px-2 py-1 text-xs">
                <option>Aggregate Index</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">AVERAGE:</span>
              <input type="checkbox" className="border-black" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-4">
          <button className="bg-black text-white px-4 py-2 text-xs font-semibold border border-black">
            OVERALL STATS
          </button>
          <button className="bg-white text-black px-4 py-2 text-xs border border-black border-l-0 hover:bg-gray-100">
            ADVANCED ANALYTICS
          </button>
        </div>

        {/* Table Header */}
        <div className="bg-black text-white grid grid-cols-11 gap-0 text-xs font-semibold">
          {['RANK', 'MODEL', 'ACCT VALUE ↓', 'RETURN %', 'TOTAL P&L', 'FEES', 'WIN RATE', 'BIGGEST WIN', 'BIGGEST LOSS', 'SHARPE', 'TRADES'].map((header) => (
            <div key={header} className="px-2 py-2 border-r border-gray-700 last:border-r-0">
              {header}
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          {/* Left Box - Winning Model */}
          <div className="bg-white border border-black p-4">
            <div className="mb-4">
              <p className="text-xs font-semibold mb-2">WINNING MODEL</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                <span className="font-semibold">{topPerformer?.model || 'N/A'}</span>
              </div>
            </div>
            
            <div>
              <p className="text-xs font-semibold mb-1">TOTAL EQUITY</p>
              <p className="text-xl font-bold">${topPerformer?.accountValue.toLocaleString() || 'N/A'}</p>
            </div>
          </div>

          {/* Right Box - Chart */}
          <div className="col-span-2 bg-white border border-black p-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis 
                    dataKey="day" 
                    stroke="#ccc" 
                    tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#ccc"
                    tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }}
                    axisLine={false}
                    tickLine={false}
                    domain={['dataMin - 2', 'dataMax + 2']}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid black',
                      fontFamily: 'monospace',
                      fontSize: '12px'
                    }}
                  />
                  <Line type="monotone" dataKey="Mystery Model" stroke="#22c55e" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Grok 4" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Claude Sonnet" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="GPT-5" stroke="#ef4444" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="mt-4 bg-white border border-black">
          <div className="grid grid-cols-11 gap-0 text-xs border-b border-black">
            <div className="px-2 py-2 font-semibold border-r border-gray-300">RANK</div>
            <div className="px-2 py-2 font-semibold border-r border-gray-300">MODEL</div>
            <div className="px-2 py-2 font-semibold border-r border-gray-300">ACCT VALUE</div>
            <div className="px-2 py-2 font-semibold border-r border-gray-300">RETURN %</div>
            <div className="px-2 py-2 font-semibold border-r border-gray-300">TOTAL P&L</div>
            <div className="px-2 py-2 font-semibold border-r border-gray-300">FEES</div>
            <div className="px-2 py-2 font-semibold border-r border-gray-300">WIN RATE</div>
            <div className="px-2 py-2 font-semibold border-r border-gray-300">BIGGEST WIN</div>
            <div className="px-2 py-2 font-semibold border-r border-gray-300">BIGGEST LOSS</div>
            <div className="px-2 py-2 font-semibold border-r border-gray-300">SHARPE</div>
            <div className="px-2 py-2 font-semibold">TRADES</div>
          </div>
          
          {strategies.map((s) => (
            <div key={s.model} className="grid grid-cols-11 gap-0 text-xs border-b border-gray-200 last:border-b-0">
              <div className="px-2 py-2 border-r border-gray-200">{s.rank}</div>
              <div className="px-2 py-2 border-r border-gray-200 font-medium">{s.model}</div>
              <div className="px-2 py-2 border-r border-gray-200">${s.accountValue.toLocaleString()}</div>
              <div className={`px-2 py-2 border-r border-gray-200 ${s.returnPct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {s.returnPct >= 0 ? '+' : ''}{s.returnPct.toFixed(2)}%
              </div>
              <div className={`px-2 py-2 border-r border-gray-200 ${s.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {s.totalPnL >= 0 ? '+' : ''}${s.totalPnL.toLocaleString()}
              </div>
              <div className="px-2 py-2 border-r border-gray-200">${s.fees}</div>
              <div className="px-2 py-2 border-r border-gray-200">{s.winRate}%</div>
              <div className="px-2 py-2 border-r border-gray-200 text-green-600">+${s.biggestWin}</div>
              <div className="px-2 py-2 border-r border-gray-200 text-red-600">-${Math.abs(s.biggestLoss)}</div>
              <div className="px-2 py-2 border-r border-gray-200">{s.sharpe.toFixed(2)}</div>
              <div className="px-2 py-2">{s.trades}</div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-4 text-xs text-gray-500">
          <span className="font-semibold">Note:</span> All statistics (except Account Value and P&L) reflect completed trades only. 
          Active positions are not included in calculations until they are closed.
        </div>
      </div>
    </div>
  )
}
