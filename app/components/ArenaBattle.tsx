'use client'

import { useState, useEffect } from 'react'

interface StrategyData {
  rank: number
  strategy: string
  value: number
  return: number
  pnl: number
  trades: number
  winRate: number
}

export default function ArenaBattle() {
  const [strategies, setStrategies] = useState<StrategyData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/trades.json')
      .then(res => res.json())
      .then(data => {
        const trades = data.trades || []
        
        const stats: Record<string, { pnl: number, trades: number, wins: number }> = {}
        
        trades.forEach((trade: any) => {
          const name = trade.strategy
          if (!stats[name]) {
            stats[name] = { pnl: 0, trades: 0, wins: 0 }
          }
          stats[name].pnl += trade.pnl || 0
          stats[name].trades += 1
          if (trade.status === 'WIN') {
            stats[name].wins += 1
          }
        })
        
        const ranked = Object.entries(stats)
          .map(([strategy, data]) => ({
            strategy,
            pnl: data.pnl,
            trades: data.trades,
            winRate: data.trades > 0 ? (data.wins / data.trades) * 100 : 0,
            value: 100 + data.pnl,
            return: data.pnl
          }))
          .sort((a, b) => b.pnl - a.pnl)
          .map((s, i) => ({ ...s, rank: i + 1 }))
        
        setStrategies(ranked)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <div className="text-[var(--text-muted)]">Loading Arena data...</div>
      </div>
    )
  }

  const totalTrades = strategies.reduce((sum, s) => sum + s.trades, 0)
  const avgWinRate = strategies.length > 0 
    ? strategies.reduce((sum, s) => sum + s.winRate, 0) / strategies.length 
    : 0
  const totalPnl = strategies.reduce((sum, s) => sum + s.pnl, 0)

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Strategy Arena</h1>
        <p className="text-[var(--text-muted)]">Live battle between trading strategies</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="cell p-6">
          <div className="text-xs text-[var(--text-muted)] mb-2 uppercase tracking-wider">Active Strategies</div>
          <div className="text-3xl font-bold">{strategies.length}</div>
        </div>
        
        <div className="cell p-6">
          <div className="text-xs text-[var(--text-muted)] mb-2 uppercase tracking-wider">Total Trades</div>
          <div className="text-3xl font-bold">{totalTrades.toLocaleString()}</div>
        </div>
        
        <div className="cell p-6">
          <div className="text-xs text-[var(--text-muted)] mb-2 uppercase tracking-wider">Avg Win Rate</div>
          <div className="text-3xl font-bold">{avgWinRate.toFixed(1)}%</div>
        </div>
        
        <div className="cell p-6">
          <div className="text-xs text-[var(--text-muted)] mb-2 uppercase tracking-wider">Total P&L</div>
          <div className={`text-3xl font-bold ${totalPnl >= 0 ? 'text-up' : 'text-down'}`}>
            {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="cell">
        <div className="section-label px-6 py-4">Strategy Leaderboard</div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-cell)]">
                <th className="text-left py-4 px-6 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider w-20">Rank</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Strategy</th>
                <th className="text-right py-4 px-6 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider w-32">Value</th>
                <th className="text-right py-4 px-6 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider w-28">Return</th>
                <th className="text-right py-4 px-6 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider w-28">P&L</th>
                <th className="text-right py-4 px-6 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider w-24">Trades</th>
                <th className="text-right py-4 px-6 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider w-24">Win Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {strategies.map((s) => (
                <tr key={s.strategy} className="hover:bg-[var(--bg-cell)] transition-colors"
                >
                  <td className="py-4 px-6">
                    <span className={`
                      inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold
                      ${s.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' : 
                        s.rank === 2 ? 'bg-gray-400/20 text-gray-400' :
                        s.rank === 3 ? 'bg-amber-600/20 text-amber-600' :
                        'text-[var(--text-muted)]'}
                    `}>
                      {s.rank}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-base">{s.strategy}</td>
                  <td className="py-4 px-6 text-right mono text-[var(--text-secondary)]">${s.value.toFixed(2)}</td>
                  <td className={`py-4 px-6 text-right mono font-medium ${s.return >= 0 ? 'text-up' : 'text-down'}`}>
                    {s.return >= 0 ? '+' : ''}{s.return.toFixed(2)}%
                  </td>
                  <td className={`py-4 px-6 text-right mono font-medium ${s.pnl >= 0 ? 'text-up' : 'text-down'}`}>
                    {s.pnl >= 0 ? '+' : ''}${s.pnl.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-right mono text-[var(--text-secondary)]">{s.trades}</td>
                  <td className="py-4 px-6 text-right text-[var(--text-secondary)]">{s.winRate.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
