'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Trophy, Zap, Activity, TrendingUp, Flame, Crown, Timer } from 'lucide-react'

interface Strategy {
  name: string
  pnl: number
  trades: number
  winRate: number
  capital: number
  color: string
  emoji: string
  streak: number
}

const STRATEGIES = [
  { name: 'VPIN', color: '#10b981', emoji: '🎯' },
  { name: 'BollingerBands', color: '#3b82f6', emoji: '📊' },
  { name: 'TimeDecay', color: '#f59e0b', emoji: '⏱️' },
  { name: 'Momentum', color: '#ef4444', emoji: '🚀' },
  { name: 'HighProbConvergence', color: '#8b5cf6', emoji: '💎' },
  { name: 'EMAArbitrage', color: '#06b6d4', emoji: '📈' },
  { name: 'VolatilityScorer', color: '#ec4899', emoji: '⚡' },
  { name: 'MarketMaking', color: '#84cc16', emoji: '🏦' },
]

export default function ArenaBattle() {
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [trades, setTrades] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    updateData()
    const interval = setInterval(updateData, 2000)
    return () => clearInterval(interval)
  }, [])

  function updateData() {
    // Generate strategy data
    const data: Strategy[] = STRATEGIES.map((s, i) => {
      const pnl = (Math.random() - 0.3) * 15
      return {
        name: s.name,
        pnl,
        trades: Math.floor(Math.random() * 50) + 10,
        winRate: 40 + Math.random() * 30,
        capital: 100 + pnl,
        color: s.color,
        emoji: s.emoji,
        streak: Math.floor(Math.random() * 5)
      }
    }).sort((a, b) => b.pnl - a.pnl)

    setStrategies(data)

    // Generate chart data
    const now = Date.now()
    const points = Array.from({ length: 30 }, (_, i) => {
      const time = new Date(now - (29 - i) * 60000)
      const point: any = {
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }
      data.forEach(s => {
        const progress = i / 29
        point[s.name] = s.pnl * progress + (Math.random() - 0.5) * 2
      })
      return point
    })
    setChartData(points)

    // Generate trades
    setTrades(Array.from({ length: 6 }, (_, i) => ({
      time: new Date(now - i * 45000).toLocaleTimeString('en-US', { hour12: false }),
      strategy: STRATEGIES[Math.floor(Math.random() * STRATEGIES.length)].name,
      side: Math.random() > 0.5 ? 'BUY' : 'SELL',
      price: (0.35 + Math.random() * 0.3).toFixed(2),
      pnl: (Math.random() - 0.5) * 1.5
    })))
  }

  if (!mounted) return null

  const top3 = strategies.slice(0, 3)

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      {/* Hero Section with Chart */}
      <div className="px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">Strategy Arena</h1>
                <p className="text-gray-500 text-sm mt-1">Live battle between trading strategies</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-400 text-sm font-medium">LIVE</span>
              </div>
            </div>
          </div>

          {/* Main Chart */}
          <div className="bg-[#111111] rounded-3xl p-8 border border-white/5">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total P&L Performance</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-semibold">
                    {strategies[0]?.pnl >= 0 ? '+' : ''}{strategies[0]?.pnl.toFixed(2)}%
                  </span>
                  <span className="text-emerald-400 text-sm font-medium">Top Performer</span>
                </div>
              </div>
              
              <div className="flex gap-6">
                {strategies.slice(0, 4).map(s => (
                  <div key={s.name} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-gray-400 text-sm">{s.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    {strategies.map(s => (
                      <linearGradient key={s.name} id={`grad${s.name}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={s.color} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <XAxis 
                    dataKey="time" 
                    stroke="#333" 
                    tick={{ fill: '#666', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#333"
                    tick={{ fill: '#666', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`}
                  />
                  
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a1a', 
                      border: '1px solid #333',
                      borderRadius: '12px',
                      padding: '12px'
                    }}
                    labelStyle={{ color: '#666', marginBottom: '8px' }}
                  />
                  
                  {strategies.slice(0, 5).map(s => (
                    <Area
                      key={s.name}
                      type="monotone"
                      dataKey={s.name}
                      stroke={s.color}
                      strokeWidth={2}
                      fill={`url(#grad${s.name})`}
                      animationDuration={1000}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-6 mb-8">
            {top3.map((s, i) => (
              <div 
                key={s.name}
                className={`rounded-2xl p-6 border ${
                  i === 0 ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20' :
                  i === 1 ? 'bg-gradient-to-br from-gray-400/10 to-gray-500/10 border-gray-400/20' :
                  'bg-gradient-to-br from-amber-600/10 to-amber-700/10 border-amber-600/20'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{s.emoji}</span>
                    <span className="font-medium">{s.name}</span>
                  </div>
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                    ${i === 0 ? 'bg-yellow-500 text-black' : i === 1 ? 'bg-gray-400 text-black' : 'bg-amber-600 text-white'}
                  `}>
                    {i + 1}
                  </div>
                </div>
                
                <div className="text-3xl font-semibold mb-2">
                  <span className={s.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    {s.pnl >= 0 ? '+' : ''}{s.pnl.toFixed(2)}%
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{s.trades} trades</span>
                  <span>{s.winRate.toFixed(0)}% win</span>
                  {s.streak > 0 && (
                    <span className="text-orange-400 flex items-center gap-1">
                      <Flame className="w-4 h-4" /> {s.streak}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Full Leaderboard */}
          <div className="bg-[#111111] rounded-3xl border border-white/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-medium">All Strategies</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Activity className="w-4 h-4" />
                <span>{strategies.length} Active</span>
              </div>
            </div>
            
            <div className="divide-y divide-white/5">
              {strategies.map((s, i) => (
                <div key={s.name} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500 w-6">{i + 1}</span>
                    <span className="text-xl">{s.emoji}</span>
                    <div>
                      <p className="font-medium">{s.name}</p>
                      <p className="text-sm text-gray-500">{s.trades} trades • {s.winRate.toFixed(0)}% win</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-xl font-semibold ${s.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {s.pnl >= 0 ? '+' : ''}{s.pnl.toFixed(2)}%
                    </p>
                    <p className="text-sm text-gray-500">${s.capital.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Trades */}
      <div className="px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#111111] rounded-3xl border border-white/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5">
              <h2 className="text-lg font-medium">Recent Trades</h2>
            </div>
            
            <div className="divide-y divide-white/5">
              {trades.map((t, i) => (
                <div key={i} className="px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <span className="text-gray-500 font-mono text-sm w-20">{t.time}</span>
                    <span className="font-medium">{t.strategy}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      t.side === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {t.side}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <span className="font-mono">${t.price}</span>
                    <span className={`font-medium w-16 text-right ${t.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {t.pnl >= 0 ? '+' : ''}{t.pnl.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
