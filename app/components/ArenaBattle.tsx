'use client'

import { useState, useEffect } from 'react'

export default function ArenaBattle() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const strategies = [
    { rank: 1, model: 'VPIN', value: '$112,110', ret: '+12.11%', pnl: '+$4,844', fees: '$245', win: '58%', bWin: '+$892', bLoss: '-$234', sharpe: '1.84', trades: '89' },
    { rank: 2, model: 'BollingerBands', value: '$108,450', ret: '+8.45%', pnl: '+$3,380', fees: '$198', win: '54%', bWin: '+$654', bLoss: '-$312', sharpe: '1.52', trades: '76' },
    { rank: 3, model: 'TimeDecay', value: '$106,230', ret: '+6.23%', pnl: '+$2,492', fees: '$167', win: '52%', bWin: '+$521', bLoss: '-$289', sharpe: '1.38', trades: '68' },
    { rank: 4, model: 'Momentum', value: '$104,870', ret: '+4.87%', pnl: '+$1,948', fees: '$142', win: '49%', bWin: '+$445', bLoss: '-$356', sharpe: '1.15', trades: '62' },
    { rank: 5, model: 'HighProbConvergence', value: '$103,120', ret: '+3.12%', pnl: '+$1,248', fees: '$98', win: '47%', bWin: '+$387', bLoss: '-$298', sharpe: '0.98', trades: '54' },
    { rank: 6, model: 'EMAArbitrage', value: '$101,980', ret: '+1.98%', pnl: '+$792', fees: '$76', win: '45%', bWin: '+$298', bLoss: '-$245', sharpe: '0.87', trades: '48' },
    { rank: 7, model: 'VolatilityScorer', value: '$99,550', ret: '-0.45%', pnl: '-$180', fees: '$89', win: '43%', bWin: '+$234', bLoss: '-$412', sharpe: '0.62', trades: '52' },
    { rank: 8, model: 'MarketMaking', value: '$97,660', ret: '-2.34%', pnl: '-$936', fees: '$112', win: '41%', bWin: '+$198', bLoss: '-$534', sharpe: '0.34', trades: '61' },
  ]

  return (
    <div className="container py-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Strategies', value: '8' },
          { label: 'Total Trades', value: '524' },
          { label: 'Win Rate', value: '44%' },
          { label: 'Total P&L', value: '-$1.70', negative: true },
        ].map((stat) => (
          <div key={stat.label} className="cell">
            <div className="text-xs text-[var(--text-muted)] mb-1">{stat.label}</div>
            <div className={`mono text-2xl font-semibold ${stat.negative ? 'text-down' : 'text-primary'}`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="cell overflow-hidden">
        <div className="section-label">Strategy Leaderboard</div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {['Rank', 'Strategy', 'Value', 'Return', 'P&L', 'Trades', 'Win Rate'].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {strategies.map((s) => (
                <tr key={s.model} className="hover:bg-[var(--bg-cell)]">
                  <td className="py-3 px-4">{s.rank}</td>
                  <td className="py-3 px-4 font-medium">{s.model}</td>
                  <td className="py-3 px-4 mono">{s.value}</td>
                  <td className={`py-3 px-4 mono ${s.ret.startsWith('+') ? 'text-up' : 'text-down'}`}>
                    {s.ret}
                  </td>
                  <td className={`py-3 px-4 mono ${s.pnl.startsWith('+') ? 'text-up' : 'text-down'}`}>
                    {s.pnl}
                  </td>
                  <td className="py-3 px-4 mono">{s.trades}</td>
                  <td className="py-3 px-4">{s.win}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
