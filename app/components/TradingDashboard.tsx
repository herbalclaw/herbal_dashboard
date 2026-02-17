'use client'

import { useState, useEffect } from 'react'
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

interface Trade {
  id: number
  time: string
  strategy: string
  market: string
  side: 'BUY' | 'SELL'
  entry: number
  exit: number
  pnl: number
  status: 'WIN' | 'LOSS'
}

export default function TradingDashboard() {
  const [selectedStrategy, setSelectedStrategy] = useState('ALL')
  const [timeRange, setTimeRange] = useState('24H')
  const [trades, setTrades] = useState<Trade[]>([])
  const [totalTrades, setTotalTrades] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrades()
  }, [])

  async function fetchTrades() {
    try {
      const response = await fetch('/api/trades')
      const data = await response.json()
      setTrades(data.trades)
      setTotalTrades(data.total)
    } catch (error) {
      console.error('Error fetching trades:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTrades = selectedStrategy === 'ALL' 
    ? trades 
    : trades.filter(t => t.strategy === selectedStrategy)

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
        <div className="panel">
          <div className="cell-header flex items-center justify-between">
            <span>RECENT TRADES</span>
            <span className="text-[var(--text-muted)]">
              {loading ? 'LOADING...' : `${totalTrades} RECORDS (showing ${filteredTrades.length})`}
            </span>
          </div>
          
          <div className="overflow-x-auto bg-[var(--bg-panel)]">
            <table className="table">
              <thead>
                <tr>
                  <th>TIME</th>
                  <th>STRATEGY</th>
                  <th className="hidden sm:table-cell">MARKET</th>
                  <th>SIDE</th>
                  <th>ENTRY</th>
                  <th>EXIT</th>
                  <th>P&L</th>
                  <th className="hidden sm:table-cell">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-[var(--text-muted)]">
                      LOADING TRADES...
                    </td>
                  </tr>
                ) : filteredTrades.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-[var(--text-muted)]">
                      NO TRADES FOUND
                    </td>
                  </tr>
                ) : (
                  filteredTrades.map((trade) => (
                    <tr key={trade.id}>
                      <td className="mono">{trade.time}</td>
                      <td>{trade.strategy}</td>
                      <td className="hidden sm:table-cell">{trade.market}</td>
                      <td className={trade.side === 'BUY' ? 'text-up font-semibold' : 'text-down font-semibold'}>
                        {trade.side}
                      </td>
                      <td className="mono">{trade.entry.toFixed(2)}</td>
                      <td className="mono">{trade.exit.toFixed(2)}</td>
                      <td className={`mono font-semibold ${trade.pnl >= 0 ? 'text-up' : 'text-down'}`}>
                        {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}
                      </td>
                      <td className={`hidden sm:table-cell ${trade.status === 'WIN' ? 'text-up font-semibold' : 'text-down font-semibold'}`}>
                        {trade.status}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
