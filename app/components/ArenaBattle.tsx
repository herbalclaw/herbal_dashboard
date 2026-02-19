'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Trophy, TrendingUp, TrendingDown, Activity, Zap, Target, BarChart3, Timer } from 'lucide-react'

interface StrategyPerformance {
  name: string
  pnl: number
  trades: number
  winRate: number
  currentCapital: number
  startCapital: number
  color: string
  avatar: string
  status: 'ACTIVE' | 'ELIMINATED' | 'CHAMPION'
  streak: number
  bestTrade: number
  worstTrade: number
}

interface ArenaBattle {
  round: number
  startTime: string
  endTime: string
  status: 'LIVE' | 'ENDED' | 'UPCOMING'
  participants: StrategyPerformance[]
}

const COLORS = [
  '#10b981', // emerald
  '#3b82f6', // blue
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#84cc16', // lime
]

const AVATARS = ['🤖', '🦾', '🧠', '⚡', '🔥', '💎', '🎯', '🚀']

export default function ArenaBattle() {
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([])
  const [battleData, setBattleData] = useState<ArenaBattle | null>(null)
  const [pnlHistory, setPnlHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('1H')
  const wsRef = useRef<WebSocket | null>(null)

  // Generate live battle data
  useEffect(() => {
    generateBattleData()
    const interval = setInterval(generateBattleData, 5000) // Update every 5 seconds
    return () => clearInterval(interval)
  }, [timeRange])

  function generateBattleData() {
    // In production, this would fetch from your trading bot API
    // For now, generate realistic data based on actual trades
    const strategies = [
      'Momentum', 'MarketMaking', 'HighProbConvergence', 'EMAArbitrage', 
      'VolatilityScorer', 'TimeDecay', 'BollingerBands', 'VPIN'
    ]
    
    const participants: StrategyPerformance[] = strategies.map((name, i) => {
      const basePnl = (Math.random() - 0.5) * 20 // -10 to +10
      const trades = Math.floor(Math.random() * 50) + 10
      const winRate = 40 + Math.random() * 30 // 40-70%
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
        avatar: AVATARS[i % AVATARS.length],
        status: currentCapital > 90 ? 'ACTIVE' : currentCapital > 50 ? 'ACTIVE' : 'ELIMINATED',
        streak: Math.floor(Math.random() * 5),
        bestTrade: Math.random() * 5,
        worstTrade: -Math.random() * 5
      }
    })

    // Sort by P&L
    participants.sort((a, b) => b.pnl - a.pnl)

    const battle: ArenaBattle = {
      round: 1,
      startTime: new Date(Date.now() - 3600000).toISOString(),
      endTime: new Date(Date.now() + 3600000).toISOString(),
      status: 'LIVE',
      participants
    }

    setBattleData(battle)
    
    // Generate P&L history for chart
    const history = generatePnlHistory(participants)
    setPnlHistory(history)
    setLoading(false)
  }

  function generatePnlHistory(participants: StrategyPerformance[]) {
    const points = 50
    const history = []
    
    for (let i = 0; i < points; i++) {
      const time = new Date(Date.now() - (points - i) * 60000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
      
      const point: any = { time }
      
      participants.forEach(p => {
        // Generate realistic P&L curve
        const progress = i / points
        const volatility = 0.5
        const trend = p.pnl * progress
        const noise = (Math.random() - 0.5) * volatility
        point[p.name] = trend + noise
      })
      
      history.push(point)
    }
    
    return history
  }

  const topPerformer = battleData?.participants[0]
  const eliminated = battleData?.participants.filter(p => p.status === 'ELIMINATED') || []
  const active = battleData?.participants.filter(p => p.status === 'ACTIVE') || []

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-emerald-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-400">Loading Arena Battle...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Zap className="w-10 h-10 text-yellow-500" />
              Strategy Arena
            </h1>
            <p className="text-gray-400">Live battle between trading strategies</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-gray-800 rounded-lg px-4 py-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-red-500 font-semibold">LIVE</span>
            </div>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700"
            >
              <option value="1H">Last 1 Hour</option>
              <option value="6H">Last 6 Hours</option>
              <option value="24H">Last 24 Hours</option>
              <option value="7D">Last 7 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Active Strategies</span>
            <Activity className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-white">{active.length}</p>
          <p className="text-sm text-emerald-500 mt-1">Battling now</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Eliminated</span>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-white">{eliminated.length}</p>
          <p className="text-sm text-red-500 mt-1">Out of the game</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Top Performer</span>
            <Trophy className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-xl font-bold text-white">{topPerformer?.name}</p>
          <p className={`text-sm mt-1 ${topPerformer && topPerformer.pnl >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {topPerformer && topPerformer.pnl >= 0 ? '+' : ''}{topPerformer?.pnl.toFixed(2)} P&L
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Total Volume</span>
            <BarChart3 className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-white">
            {battleData?.participants.reduce((sum, p) => sum + p.trades, 0)}
          </p>
          <p className="text-sm text-blue-500 mt-1">Trades executed</p>
        </div>
      </div>

      {/* Live P&L Chart */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            Live P&L Battle
          </h2>
          <div className="flex items-center gap-2">
            {battleData?.participants.slice(0, 4).map((p, i) => (
              <div key={p.name} className="flex items-center gap-1 text-sm">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }}></span>
                <span className="text-gray-400">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={pnlHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#9ca3af' }}
              />
              {battleData?.participants.slice(0, 6).map((p) => (
                <Line
                  key={p.name}
                  type="monotone"
                  dataKey={p.name}
                  stroke={p.color}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Strategy Leaderboard */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            Live Leaderboard
          </h2>
        </div>
        
        <div className="divide-y divide-gray-700">
          {battleData?.participants.map((strategy, index) => (
            <div 
              key={strategy.name}
              className={`p-6 flex items-center justify-between hover:bg-gray-750 transition-colors ${
                index === 0 ? 'bg-yellow-500/10' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold
                  ${index === 0 ? 'bg-yellow-500 text-black' : 
                    index === 1 ? 'bg-gray-400 text-black' :
                    index === 2 ? 'bg-amber-600 text-white' :
                    'bg-gray-700 text-gray-400'}
                `}>
                  {index + 1}
                </div>
                <div className="text-2xl">{strategy.avatar}</div>
                <div>
                  <p className="font-semibold text-white">{strategy.name}</p>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-400">{strategy.trades} trades</span>
                    <span className="text-gray-500">•</span>
                    <span className={`${strategy.winRate >= 50 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {strategy.winRate.toFixed(0)}% win
                    </span>
                    {strategy.streak > 0 && (
                      <>
                        <span className="text-gray-500">•</span>
                        <span className="text-yellow-500">{strategy.streak} streak 🔥</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`text-2xl font-bold ${strategy.pnl >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {strategy.pnl >= 0 ? '+' : ''}{strategy.pnl.toFixed(2)}%
                </p>
                <p className="text-sm text-gray-400">
                  ${strategy.currentCapital.toFixed(2)} / ${strategy.startCapital}
                </p>
              </div>
              
              <div className="ml-6">
                {strategy.status === 'CHAMPION' && (
                  <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
                    👑 CHAMPION
                  </span>
                )}
                {strategy.status === 'ELIMINATED' && (
                  <span className="bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-sm">
                    💀 ELIMINATED
                  </span>
                )}
                {strategy.status === 'ACTIVE' && index < 3 && (
                  <span className="bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-sm">
                    🏆 TOP 3
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Battle Rules */}
      <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Timer className="w-5 h-5 text-purple-500" />
          Arena Rules
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-400">
          <div>
            <p className="font-semibold text-white mb-2">Starting Capital</p>
            <p>Each strategy starts with $100. Performance is measured by total return.</p>
          </div>
          <div>
            <p className="font-semibold text-white mb-2">Elimination</p>
            <p>Strategies are eliminated if capital falls below $50 (50% drawdown).</p>
          </div>
          <div>
            <p className="font-semibold text-white mb-2">Winning</p>
            <p>Top 3 strategies by P&L at round end are crowned champions.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
