'use client'

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Filter, Download, RefreshCw } from 'lucide-react'

const strategies = [
  'All Strategies',
  'Momentum',
  'Arbitrage', 
  'VWAP',
  'LeadLag',
  'Sentiment',
  'OrderBookImbalance',
  'SharpMoney',
  'VolatilityScorer',
  'BreakoutMomentum',
  'HighProbConvergence',
  'MarketMaking',
  'CopyTrading'
]

const equityData = [
  { time: '00:00', equity: 100 },
  { time: '04:00', equity: 98.5 },
  { time: '08:00', equity: 102.3 },
  { time: '12:00', equity: 99.8 },
  { time: '16:00', equity: 101.2 },
  { time: '20:00', equity: 98.3 },
  { time: '24:00', equity: 98.3 },
]

const pnlData = [
  { time: '00:00', pnl: 0 },
  { time: '04:00', pnl: -1.5 },
  { time: '08:00', pnl: 2.3 },
  { time: '12:00', pnl: -0.2 },
  { time: '16:00', pnl: 1.2 },
  { time: '20:00', pnl: -1.7 },
  { time: '24:00', pnl: -1.7 },
]

const tradesData = [
  { id: 1, time: '16:45:23', strategy: 'Momentum', market: 'BTC-UP-5M', side: 'BUY', entry: 0.52, exit: 0.68, pnl: 0.16, status: 'WIN' },
  { id: 2, time: '16:40:12', strategy: 'Arbitrage', market: 'BTC-DOWN-5M', side: 'SELL', entry: 0.48, exit: 0.32, pnl: 0.16, status: 'WIN' },
  { id: 3, time: '16:35:45', strategy: 'VWAP', market: 'BTC-UP-5M', side: 'BUY', entry: 0.55, exit: 0.42, pnl: -0.13, status: 'LOSS' },
  { id: 4, time: '16:30:18', strategy: 'LeadLag', market: 'BTC-DOWN-5M', side: 'SELL', entry: 0.45, exit: 0.38, pnl: 0.07, status: 'WIN' },
  { id: 5, time: '16:25:33', strategy: 'Sentiment', market: 'BTC-UP-5M', side: 'BUY', entry: 0.51, exit: 0.44, pnl: -0.07, status: 'LOSS' },
  { id: 6, time: '16:20:09', strategy: 'OrderBookImbalance', market: 'BTC-DOWN-5M', side: 'SELL', entry: 0.49, exit: 0.52, pnl: -0.03, status: 'LOSS' },
  { id: 7, time: '16:15:42', strategy: 'SharpMoney', market: 'BTC-UP-5M', side: 'BUY', entry: 0.53, exit: 0.61, pnl: 0.08, status: 'WIN' },
  { id: 8, time: '16:10:27', strategy: 'VolatilityScorer', market: 'BTC-DOWN-5M', side: 'SELL', entry: 0.47, exit: 0.41, pnl: 0.06, status: 'WIN' },
]

export default function TradingDashboard() {
  const [selectedStrategy, setSelectedStrategy] = useState('All Strategies')
  const [timeRange, setTimeRange] = useState('24H')

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="container">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="page-title mb-2">Paper Trading</h1>
            <p className="text-sm text-[var(--text-tertiary)]">Monitor strategy performance and trade history</p>
          </div>
          
          <div className="flex items-center" style={{ gap: '16px' }}>
            <button className="btn btn-secondary">
              <Download size={14} />
              Export
            </button>
            <button className="btn btn-secondary">
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        </div>

        {/* Strategy Filter */}
        <div className="mb-8">
          <div className="flex items-center" style={{ gap: '8px' }}>
            <Filter size={14} className="text-[var(--text-tertiary)]" />
            <span className="section-title">Filter by Strategy</span>
          </div>
          
          <div className="flex flex-wrap" style={{ gap: '8px' }}>
            {strategies.map((strategy) => (
              <button
                key={strategy}
                onClick={() => setSelectedStrategy(strategy)}
                className={`filter-pill ${selectedStrategy === strategy ? 'active' : ''}`}
              >
                {strategy}
              </button>
            ))}
          </div>
        </div>

        {/* Time Range */}
        <div className="mb-8">
          <div className="flex items-center mb-4" style={{ gap: '8px' }}>
            <span className="section-title">Time Range</span>
          </div>
          
          <div className="flex items-center" style={{ gap: '8px' }}>
            {['1H', '6H', '24H', '7D', '30D'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`filter-pill ${timeRange === range ? 'active' : ''}`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Equity Chart */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="section-title">Equity Curve</span>
              <span className="text-xs text-[var(--text-tertiary)]">{selectedStrategy}</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={equityData}>
                  <defs>
                    <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="time" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip 
                    contentStyle={{ background: '#141416', border: '1px solid #27272a', borderRadius: '6px' }}
                    itemStyle={{ color: '#fafafa', fontFamily: 'JetBrains Mono' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="equity" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#equityGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PNL Chart */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="section-title">P&L Over Time</span>
              <span className="text-xs text-[var(--text-tertiary)]">{selectedStrategy}</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pnlData}>
                  <defs>
                    <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="time" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#141416', border: '1px solid #27272a', borderRadius: '6px' }}
                    itemStyle={{ color: '#fafafa', fontFamily: 'JetBrains Mono' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="pnl" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#pnlGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Trades Table */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
            <span className="section-title">Recent Trades</span>
            <span className="text-xs text-[var(--text-tertiary)]">Showing {tradesData.length} trades</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Strategy</th>
                  <th>Market</th>
                  <th>Side</th>
                  <th>Entry</th>
                  <th>Exit</th>
                  <th>P&L</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tradesData.map((trade) => (
                  <tr key={trade.id}>
                    <td className="mono">{trade.time}</td>
                    <td>{trade.strategy}</td>
                    <td>{trade.market}</td>
                    <td>
                      <span className={`text-xs font-medium ${trade.side === 'BUY' ? 'text-[var(--profit)]' : 'text-[var(--loss)]'}`}>
                        {trade.side}
                      </span>
                    </td>
                    <td className="mono">{trade.entry.toFixed(2)}</td>
                    <td className="mono">{trade.exit.toFixed(2)}</td>
                    <td className={`mono font-medium ${trade.pnl >= 0 ? 'text-[var(--profit)]' : 'text-[var(--loss)]'}`}>
                      {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}
                    </td>
                    <td>
                      <span className={`badge ${trade.status === 'WIN' ? 'badge-success' : 'badge-error'}`}>
                        {trade.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
