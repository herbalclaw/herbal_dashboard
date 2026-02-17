'use client'

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Download, RefreshCw } from 'lucide-react'

const strategies = [
  'ALL',
  'MOMENTUM',
  'ARBITRAGE', 
  'VWAP',
  'LEAD_LAG',
  'SENTIMENT',
  'ORDER_BOOK',
  'SHARP_MONEY',
  'VOLATILITY',
  'BREAKOUT',
  'HIGH_PROB',
  'MARKET_MAKER',
  'COPY_TRADE'
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
  { id: 323, time: '17:49:04', strategy: 'MOMENTUM', market: 'BTC-UP-5M', side: 'BUY', entry: 0.52, exit: 0.68, pnl: 0.16, status: 'WIN' },
  { id: 322, time: '17:49:03', strategy: 'ARBITRAGE', market: 'BTC-DOWN-5M', side: 'SELL', entry: 0.48, exit: 0.32, pnl: 0.16, status: 'WIN' },
  { id: 321, time: '17:48:53', strategy: 'VWAP', market: 'BTC-UP-5M', side: 'BUY', entry: 0.55, exit: 0.42, pnl: -0.13, status: 'LOSS' },
  { id: 320, time: '17:48:51', strategy: 'LEAD_LAG', market: 'BTC-DOWN-5M', side: 'SELL', entry: 0.45, exit: 0.38, pnl: 0.07, status: 'WIN' },
  { id: 319, time: '17:48:42', strategy: 'SENTIMENT', market: 'BTC-UP-5M', side: 'BUY', entry: 0.51, exit: 0.44, pnl: -0.07, status: 'LOSS' },
  { id: 318, time: '17:48:38', strategy: 'ORDER_BOOK', market: 'BTC-DOWN-5M', side: 'SELL', entry: 0.49, exit: 0.52, pnl: -0.03, status: 'LOSS' },
  { id: 317, time: '17:48:22', strategy: 'SHARP_MONEY', market: 'BTC-UP-5M', side: 'BUY', entry: 0.53, exit: 0.61, pnl: 0.08, status: 'WIN' },
  { id: 316, time: '17:48:15', strategy: 'VOLATILITY', market: 'BTC-DOWN-5M', side: 'SELL', entry: 0.47, exit: 0.41, pnl: 0.06, status: 'WIN' },
  { id: 315, time: '17:48:08', strategy: 'MOMENTUM', market: 'BTC-UP-5M', side: 'BUY', entry: 0.54, exit: 0.62, pnl: 0.08, status: 'WIN' },
  { id: 314, time: '17:47:52', strategy: 'ARBITRAGE', market: 'BTC-DOWN-5M', side: 'SELL', entry: 0.46, exit: 0.39, pnl: 0.07, status: 'WIN' },
  { id: 313, time: '17:47:45', strategy: 'VWAP', market: 'BTC-UP-5M', side: 'BUY', entry: 0.52, exit: 0.48, pnl: -0.04, status: 'LOSS' },
  { id: 312, time: '17:47:38', strategy: 'LEAD_LAG', market: 'BTC-DOWN-5M', side: 'SELL', entry: 0.48, exit: 0.42, pnl: 0.06, status: 'WIN' },
  { id: 311, time: '17:47:22', strategy: 'SENTIMENT', market: 'BTC-UP-5M', side: 'BUY', entry: 0.50, exit: 0.58, pnl: 0.08, status: 'WIN' },
  { id: 310, time: '17:47:15', strategy: 'ORDER_BOOK', market: 'BTC-DOWN-5M', side: 'SELL', entry: 0.50, exit: 0.44, pnl: 0.06, status: 'WIN' },
  { id: 309, time: '17:47:08', strategy: 'SHARP_MONEY', market: 'BTC-UP-5M', side: 'BUY', entry: 0.49, exit: 0.43, pnl: -0.06, status: 'LOSS' },
  { id: 308, time: '17:46:52', strategy: 'VOLATILITY', market: 'BTC-DOWN-5M', side: 'SELL', entry: 0.47, exit: 0.40, pnl: 0.07, status: 'WIN' },
  { id: 307, time: '17:46:45', strategy: 'BREAKOUT', market: 'BTC-UP-5M', side: 'BUY', entry: 0.51, exit: 0.59, pnl: 0.08, status: 'WIN' },
  { id: 306, time: '17:46:38', strategy: 'HIGH_PROB', market: 'BTC-DOWN-5M', side: 'SELL', entry: 0.49, exit: 0.41, pnl: 0.08, status: 'WIN' },
  { id: 305, time: '17:46:22', strategy: 'MARKET_MAKER', market: 'BTC-UP-5M', side: 'BUY', entry: 0.52, exit: 0.47, pnl: -0.05, status: 'LOSS' },
  { id: 304, time: '17:46:15', strategy: 'COPY_TRADE', market: 'BTC-DOWN-5M', side: 'SELL', entry: 0.48, exit: 0.52, pnl: -0.04, status: 'LOSS' },
]

export default function TradingDashboard() {
  const [selectedStrategy, setSelectedStrategy] = useState('ALL')
  const [timeRange, setTimeRange] = useState('24H')

  return (
    <div className="animate-fade-in">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between py-4 border-b border-[var(--border)] mb-4 gap-4">
          <div>
            <div className="text-lg font-semibold">PAPER TRADING</div>
            <div className="text-xs text-[var(--text-muted)]">Strategy Performance & Trade History</div>
          </div>
          
          <div className="flex gap-2">
            <button className="btn">
              <Download size={12} />
              EXPORT
            </button>
            <button className="btn">
              <RefreshCw size={12} />
              REFRESH
            </button>
          </div>
        </div>

        {/* Strategy Filter */}
        <div className="mb-4">
          <div className="section-label">STRATEGY FILTER</div>
          
          <div className="flex flex-wrap gap-1">
            {strategies.map((strategy) => (
              <button
                key={strategy}
                onClick={() => setSelectedStrategy(strategy)}
                className={`pill ${selectedStrategy === strategy ? 'active' : ''}`}
              >
                {strategy}
              </button>
            ))}
          </div>
        </div>

        {/* Time Range */}
        <div className="mb-4">
          <div className="section-label">TIME RANGE</div>
          
          <div className="flex flex-wrap gap-1">
            {['1H', '6H', '24H', '7D', '30D'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`pill ${timeRange === range ? 'active' : ''}`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Equity Chart */}
          <div className="panel">
            <div className="cell-header">EQUITY CURVE</div>
            <div className="h-48 md:h-64 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={equityData}>
                  <defs>
                    <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d084" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00d084" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis dataKey="time" stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#555" fontSize={10} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip 
                    contentStyle={{ background: '#111', border: '1px solid #333', borderRadius: '0' }}
                    itemStyle={{ color: '#e0e0e0', fontFamily: 'JetBrains Mono', fontSize: '12px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="equity" 
                    stroke="#00d084" 
                    strokeWidth={1.5}
                    fillOpacity={1} 
                    fill="url(#equityGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PNL Chart */}
          <div className="panel">
            <div className="cell-header">P&L OVER TIME</div>
            <div className="h-48 md:h-64 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pnlData}>
                  <defs>
                    <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff4757" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ff4757" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis dataKey="time" stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#111', border: '1px solid #333', borderRadius: '0' }}
                    itemStyle={{ color: '#e0e0e0', fontFamily: 'JetBrains Mono', fontSize: '12px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="pnl" 
                    stroke="#ff4757" 
                    strokeWidth={1.5}
                    fillOpacity={1} 
                    fill="url(#pnlGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Trades Table */}
        <div className="panel overflow-hidden">
          <div className="cell-header flex items-center justify-between">
            <span>RECENT TRADES</span>
            <span className="text-[var(--text-muted)]">323 RECORDS (showing last 20)</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>TIME</th>
                  <th>STRATEGY</th>
                  <th>MARKET</th>
                  <th>SIDE</th>
                  <th>ENTRY</th>
                  <th>EXIT</th>
                  <th>P&L</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {tradesData.map((trade) => (
                  <tr key={trade.id}>
                    <td className="mono">{trade.time}</td>
                    <td>{trade.strategy}</td>
                    <td>{trade.market}</td>
                    <td className={trade.side === 'BUY' ? 'text-up font-semibold' : 'text-down font-semibold'}>
                      {trade.side}
                    </td>
                    <td className="mono">{trade.entry.toFixed(2)}</td>
                    <td className="mono">{trade.exit.toFixed(2)}</td>
                    <td className={`mono font-semibold ${trade.pnl >= 0 ? 'text-up' : 'text-down'}`}>
                      {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}
                    </td>
                    <td className={trade.status === 'WIN' ? 'text-up font-semibold' : 'text-down font-semibold'}>
                      {trade.status}
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
