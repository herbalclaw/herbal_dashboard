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
  hasTrades: boolean
}

// All 75 strategies - must match the trading bot
const ALL_STRATEGIES = [
  'Momentum', 'Arbitrage', 'VWAP', 'LeadLag', 'Sentiment', 'OrderBookImbalance',
  'SharpMoney', 'VolatilityScorer', 'BreakoutMomentum', 'HighProbConvergence',
  'MarketMaking', 'MicrostructureScalper', 'EMAArbitrage', 'LongshotBias',
  'HighProbabilityBond', 'TimeDecay', 'BollingerBands', 'SpreadCapture', 'VPIN',
  'TimeWeightedMomentum', 'PriceSkew', 'SerialCorrelation', 'LiquidityShock',
  'OrderFlowImbalance', 'VolatilityExpansion', 'InformedTraderFlow', 'ContrarianExtreme',
  'FeeOptimizedScalper', 'TickSizeArbitrage', 'IVMR', 'TimeDecayScalping',
  'MomentumIgnition', 'RangeBoundMR', 'LiquiditySweep', 'VolumeWeightedMicroprice',
  'BidAskBounce', 'GammaScalp', 'AdverseSelectionFilter', 'OrderBookSlope',
  'QuoteStuffingDetector', 'MicroPriceReversion', 'LateEntryMomentum', 'SmartMoneyFlow',
  'KellyCriterion', 'TimeDecayAlpha', 'ToxicFlowDetector', 'DualClassArbitrage',
  'NoFarming', 'HighProbabilityCompounding', 'InventorySkew', 'AdverseSelectionFlow',
  'LatencyArbitrage', 'CombinatorialArbitrage', 'TWAPDetector', 'RetailSentimentFade',
  'ImpliedVolatilitySkew', 'FundingRateArbitrage', 'StaleQuoteArbitrage',
  'VolatilityClustering', 'LayeringDetection', 'LiquidityRewardOptimized',
  'AsymmetricMomentum', 'VolumeProfileReversion', 'FlashCrash', 'FlowToxicity',
  'MomentumReversal', 'ProbabilityConstraintArbitrage', 'InformationDivergence',
  'TimeWeightedMicrostructure', 'BookPressureReversion', 'PriceDiscoveryMomentum',
  'SpreadScalper'
]

export default function ArenaBattle() {
  const [strategies, setStrategies] = useState<StrategyData[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')

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
        
        // Build complete list with all strategies
        const allStrategies = ALL_STRATEGIES.map(strategy => {
          const data = stats[strategy] || { pnl: 0, trades: 0, wins: 0 }
          return {
            strategy,
            pnl: data.pnl,
            trades: data.trades,
            winRate: data.trades > 0 ? (data.wins / data.trades) * 100 : 0,
            value: 100 + data.pnl,
            return: data.pnl,
            hasTrades: data.trades > 0
          }
        })
        
        // Sort: Active strategies first (by P&L), then waiting strategies (alphabetically)
        const ranked = allStrategies
          .sort((a, b) => {
            // Both have trades - sort by P&L descending
            if (a.hasTrades && b.hasTrades) {
              return b.pnl - a.pnl
            }
            // Only a has trades - a comes first
            if (a.hasTrades && !b.hasTrades) {
              return -1
            }
            // Only b has trades - b comes first
            if (!a.hasTrades && b.hasTrades) {
              return 1
            }
            // Neither has trades - sort alphabetically
            return a.strategy.localeCompare(b.strategy)
          })
          .map((s, i) => ({ ...s, rank: i + 1 }))
        
        setStrategies(ranked)
        setLoading(false)
      })
      .catch(() => {
        // Even on error, show all strategies with zeros
        const emptyStrategies = ALL_STRATEGIES.map((strategy, i) => ({
          strategy,
          pnl: 0,
          trades: 0,
          winRate: 0,
          value: 100,
          return: 0,
          hasTrades: false,
          rank: i + 1
        }))
        setStrategies(emptyStrategies)
        setLoading(false)
      })
  }, [])

  const filteredStrategies = strategies.filter(s => {
    if (filter === 'active') return s.hasTrades
    if (filter === 'inactive') return !s.hasTrades
    return true
  })

  const activeCount = strategies.filter(s => s.hasTrades).length
  const inactiveCount = strategies.length - activeCount
  const totalTrades = strategies.reduce((sum, s) => sum + s.trades, 0)
  const avgWinRate = activeCount > 0 
    ? strategies.filter(s => s.hasTrades).reduce((sum, s) => sum + s.winRate, 0) / activeCount 
    : 0
  const totalPnl = strategies.reduce((sum, s) => sum + s.pnl, 0)

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <div className="text-[var(--text-muted)]">Loading Arena data...</div>
      </div>
    )
  }

  return (
    <div className="container py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Strategy Arena</h1>
        <p className="text-[var(--text-muted)]">Live battle between {strategies.length} trading strategies</p>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-8">
        <div className="cell p-4 md:p-6">
          <div className="text-xs text-[var(--text-muted)] mb-1 md:mb-2 uppercase tracking-wider">Total</div>
          <div className="text-xl md:text-3xl font-bold">{strategies.length}</div>
        </div>
        
        <div className="cell p-4 md:p-6">
          <div className="text-xs text-[var(--text-muted)] mb-1 md:mb-2 uppercase tracking-wider">Active</div>
          <div className="text-xl md:text-3xl font-bold text-up">{activeCount}</div>
        </div>
        
        <div className="cell p-4 md:p-6">
          <div className="text-xs text-[var(--text-muted)] mb-1 md:mb-2 uppercase tracking-wider">Trades</div>
          <div className="text-xl md:text-3xl font-bold">{totalTrades.toLocaleString()}</div>
        </div>
        
        <div className="cell p-4 md:p-6">
          <div className="text-xs text-[var(--text-muted)] mb-1 md:mb-2 uppercase tracking-wider">Win Rate</div>
          <div className="text-xl md:text-3xl font-bold">{avgWinRate.toFixed(1)}%</div>
        </div>
        
        <div className="cell p-4 md:p-6 col-span-2 md:col-span-1">
          <div className="text-xs text-[var(--text-muted)] mb-1 md:mb-2 uppercase tracking-wider">Total P&L</div>
          <div className={`text-xl md:text-3xl font-bold ${totalPnl >= 0 ? 'text-up' : 'text-down'}`}>
            {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Filter Tabs - Scrollable on mobile */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            filter === 'all' 
              ? 'bg-[var(--accent)] text-white' 
              : 'bg-[var(--bg-cell)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          All ({strategies.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            filter === 'active' 
              ? 'bg-up text-white' 
              : 'bg-[var(--bg-cell)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          Active ({activeCount})
        </button>
        <button
          onClick={() => setFilter('inactive')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            filter === 'inactive' 
              ? 'bg-[var(--text-muted)] text-white' 
              : 'bg-[var(--bg-cell)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          Inactive ({inactiveCount})
        </button>
      </div>

      {/* Leaderboard - Mobile Optimized */}
      <div className="cell overflow-hidden">
        <div className="section-label px-4 md:px-6 py-4 flex justify-between items-center">
          <span>Strategy Leaderboard</span>
          <span className="text-xs text-[var(--text-muted)] font-normal">
            {filteredStrategies.length} strategies
          </span>
        </div>
        
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-cell)]">
                <th className="text-left py-4 px-6 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider w-20">Rank</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Strategy</th>
                <th className="text-center py-4 px-6 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider w-24">Status</th>
                <th className="text-right py-4 px-6 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider w-32">Value</th>
                <th className="text-right py-4 px-6 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider w-28">Return</th>
                <th className="text-right py-4 px-6 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider w-28">P&L</th>
                <th className="text-right py-4 px-6 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider w-24">Trades</th>
                <th className="text-right py-4 px-6 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider w-24">Win Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredStrategies.map((s) => (
                <tr 
                  key={s.strategy} 
                  className={`hover:bg-[var(--bg-cell)] transition-colors ${!s.hasTrades ? 'opacity-60' : ''}`}
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
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      s.hasTrades 
                        ? 'bg-up/20 text-up' 
                        : 'bg-[var(--text-muted)]/20 text-[var(--text-muted)]'
                    }`}>
                      {s.hasTrades ? 'Active' : 'Waiting'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right mono text-[var(--text-secondary)]">${s.value.toFixed(2)}</td>
                  <td className={`py-4 px-6 text-right mono font-medium ${s.return >= 0 ? 'text-up' : 'text-down'}`}>
                    {s.return >= 0 ? '+' : ''}{s.return.toFixed(2)}%
                  </td>
                  <td className={`py-4 px-6 text-right mono font-medium ${s.pnl >= 0 ? 'text-up' : 'text-down'}`}>
                    {s.pnl >= 0 ? '+' : ''}${s.pnl.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-right mono text-[var(--text-secondary)]">{s.trades}</td>
                  <td className="py-4 px-6 text-right text-[var(--text-secondary)]">
                    {s.hasTrades ? `${s.winRate.toFixed(1)}%` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden">
          {filteredStrategies.map((s) => (
            <div 
              key={s.strategy}
              className={`p-4 border-b border-[var(--border)] ${!s.hasTrades ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className={`
                    inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
                    ${s.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' : 
                      s.rank === 2 ? 'bg-gray-400/20 text-gray-400' :
                      s.rank === 3 ? 'bg-amber-600/20 text-amber-600' :
                      'text-[var(--text-muted)]'}
                  `}>
                    {s.rank}
                  </span>
                  <span className="font-medium">{s.strategy}</span>
                </div>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                  s.hasTrades 
                    ? 'bg-up/20 text-up' 
                    : 'bg-[var(--text-muted)]/20 text-[var(--text-muted)]'
                }`}>
                  {s.hasTrades ? 'Active' : 'Waiting'}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <div className="text-xs text-[var(--text-muted)]">P&L</div>
                  <div className={`mono font-medium ${s.pnl >= 0 ? 'text-up' : 'text-down'}`}>
                    {s.pnl >= 0 ? '+' : ''}${s.pnl.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[var(--text-muted)]">Trades</div>
                  <div className="mono">{s.trades}</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--text-muted)]">Win Rate</div>
                  <div className="mono">{s.hasTrades ? `${s.winRate.toFixed(0)}%` : '-'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredStrategies.length === 0 && (
          <div className="py-12 text-center text-[var(--text-muted)]">
            No strategies match the selected filter
          </div>
        )}
      </div>
    </div>
  )
}
