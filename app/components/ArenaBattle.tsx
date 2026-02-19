'use client'

import { useState, useEffect, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Trophy, TrendingUp, TrendingDown, Activity, Zap, Target, Timer, Flame, Skull, Crown } from 'lucide-react'

interface StrategyPerformance {
  name: string
  pnl: number
  trades: number
  winRate: number
  currentCapital: number
  startCapital: number
  color: string
  emoji: string
  status: 'ACTIVE' | 'ELIMINATED' | 'CHAMPION'
  streak: number
}

const COLORS = [
  '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', 
  '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1'
]

const EMOJIS = ['🤖', '🦾', '🧠', '⚡', '🔥', '💎', '🎯', '🚀', '👑', '💪']

export default function ArenaBattle() {
  const [strategies, setStrategies] = useState<StrategyPerformance[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [recentTrades, setRecentTrades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const wsRef = useRef<WebSocket | null>(null)

  // Generate live data
  useEffect(() => {
    generateData()
    const interval = setInterval(generateData, 3000) // Update every 3 seconds
    return () => clearInterval(interval)
  }, [])

  function generateData() {
    const strategyNames = [
      'VolatilityScorer', 'EMAArbitrage', 'TimeDecay', 'VPIN', 
      'BollingerBands', 'HighProbConvergence', 'Momentum', 'MarketMaking'
    ]
    
    const newStrategies: StrategyPerformance[] = strategyNames.map((name, i) => {
      const basePnl = (Math.random() - 0.5) * 20
      const trades = Math.floor(Math.random() * 60) + 10
      const winRate = 40 + Math.random() * 35
      const startCapital = 100
      const currentCapital = startCapital + basePnl
      
      return {
        name,
        pnl: basePnl,
        trades,
        winRate,
        currentCapital,
        startCapital,
        color: COLORS[i % COLORS.length],
        emoji: EMOJIS[i % EMOJIS.length],
        status: currentCapital > 50 ? 'ACTIVE' : 'ELIMINATED',
        streak: Math.floor(Math.random() * 6)
      }
    })

    newStrategies.sort((a, b) => b.pnl - a.pnl)
    setStrategies(newStrategies)

    // Generate chart data
    const now = new Date()
    const newChartData = []
    for (let i = 20; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000)
      const point: any = {
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }
      newStrategies.forEach(s => {
        const progress = (20 - i) / 20
        const trend = s.pnl * progress
        const noise = (Math.random() - 0.5) * 2
        point[s.name] = trend + noise
      })
      newChartData.push(point)
    }
    setChartData(newChartData)

    // Generate recent trades
    const tradeTypes = ['BUY', 'SELL']
    const newTrades = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() - i * 1000,
      time: new Date(Date.now() - i * 30000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      strategy: strategyNames[Math.floor(Math.random() * strategyNames.length)],
      side: tradeTypes[Math.floor(Math.random() * tradeTypes.length)],
      price: (0.3 + Math.random() * 0.4).toFixed(2),
      pnl: (Math.random() - 0.5) * 2
    }))
    setRecentTrades(newTrades)
    setLoading(false)
  }

  const topPerformer = strategies[0]
  const eliminated = strategies.filter(s => s.status === 'ELIMINATED')

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-16 h-16 text-emerald-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-400 text-xl">Loading Arena...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-yellow-500" />
            <div>
              <h1 className="text-2xl font-bold">Strategy Arena</h1>
              <p className="text-gray-400 text-sm">Live battle between trading strategies</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-red-500/20 px-4 py-2 rounded-lg border border-red-500/50">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-500 font-bold">LIVE</span>
            </div>
            <select className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white">
              <option>Last 1 Hour</option>
              <option>Last 6 Hours</option>
              <option>Last 24 Hours</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* SECTION 1: LIVE P&L GRAPH */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-500" />
              Live P&L Battle
            </h2>
            <div className="flex items-center gap-4 text-sm">
              {strategies.slice(0, 5).map(s => (
                <div key={s.name} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-gray-400">{s.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="time" stroke="#6b7280" tick={{ fill: '#6b7280' }} />
                <YAxis stroke="#6b7280" tick={{ fill: '#6b7280' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#9ca3af' }}
                />
                {strategies.map((s, i) => (
                  <Line
                    key={s.name}
                    type="monotone"
                    dataKey={s.name}
                    stroke={s.color}
                    strokeWidth={2}
                    dot={false}
                    animationDuration={500}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SECTION 2: LEADERBOARD */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Live Leaderboard
            </h2>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span className="text-gray-400">{strategies.filter(s => s.status === 'ACTIVE').length} Active</span>
              </div>
              <div className="flex items-center gap-2">
                <Skull className="w-4 h-4 text-red-500" />
                <span className="text-gray-400">{eliminated.length} Eliminated</span>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-800">
            {strategies.map((s, index) => (
              <div 
                key={s.name}
                className={`px-6 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors ${
                  index === 0 ? 'bg-yellow-500/5' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold
                    ${index === 0 ? 'bg-yellow-500 text-black' : 
                      index === 1 ? 'bg-gray-400 text-black' :
                      index === 2 ? 'bg-amber-600 text-white' :
                      'bg-gray-800 text-gray-400'}
                  `}>
                    {index + 1}
                  </div>
                  
                  {/* Emoji */}
                  <div className="text-2xl">{s.emoji}</div>
                  
                  {/* Name & Stats */}
                  <div>
                    <p className="font-bold text-lg">{s.name}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span>{s.trades} trades</span>
                      <span>•</span>
                      <span className={s.winRate >= 50 ? 'text-emerald-400' : 'text-red-400'}>
                        {s.winRate.toFixed(0)}% win
                      </span>
                      {s.streak > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-orange-400 flex items-center gap-1">
                            <Flame className="w-4 h-4" /> {s.streak} streak
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* P&L */}
                <div className="text-right">
                  <p className={`text-2xl font-bold ${s.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {s.pnl >= 0 ? '+' : ''}{s.pnl.toFixed(2)}%
                  </p>
                  <p className="text-sm text-gray-500">
                    ${s.currentCapital.toFixed(2)} / ${s.startCapital}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="ml-6">
                  {index < 3 && s.status === 'ACTIVE' && (
                    <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Crown className="w-4 h-4" /> TOP {index + 1}
                    </span>
                  )}
                  {s.status === 'ELIMINATED' && (
                    <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm">
                      <Skull className="w-4 h-4 inline mr-1" /> ELIMINATED
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: LIVE ORDER HISTORY */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-500" />
              Live Order History
            </h2>
          </div>
          
          <div className="divide-y divide-gray-800">
            <div className="px-6 py-3 bg-gray-800/50 text-sm text-gray-400 grid grid-cols-5">
              <span>Time</span>
              <span>Strategy</span>
              <span>Side</span>
              <span>Price</span>
              <span className="text-right">P&L</span>
            </div>
            {recentTrades.map((trade) => (
              <div key={trade.id} className="px-6 py-3 grid grid-cols-5 items-center hover:bg-gray-800/30">
                <span className="text-gray-400 font-mono">{trade.time}</span>
                <span className="font-medium">{trade.strategy}</span>
                <span className={`font-bold ${trade.side === 'BUY' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {trade.side}
                </span>
                <span className="font-mono">${trade.price}</span>
                <span className={`text-right font-bold ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Arena Rules */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Timer className="w-5 h-5 text-purple-500" />
            Arena Rules
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-400">
            <div>
              <p className="font-semibold text-white mb-1">Starting Capital</p>
              <p>Each strategy starts with $100. Performance measured by total return.</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Elimination</p>
              <p>Strategies eliminated if capital falls below $50 (50% drawdown).</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Winning</p>
              <p>Top 3 strategies by P&L at round end are crowned champions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
