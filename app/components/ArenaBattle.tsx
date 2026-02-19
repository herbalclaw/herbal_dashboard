'use client'

export default function ArenaBattle() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#ffffff',
      padding: '40px 20px',
      fontFamily: 'Courier New, monospace',
      color: '#000000'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '40px',
          paddingBottom: '20px',
          borderBottom: '1px solid #000'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Alpha</span>
            <span style={{ fontSize: '20px', fontWeight: 'normal' }}>Arena</span>
            <span style={{ fontSize: '12px', color: '#666', marginLeft: '8px' }}>by Herbal</span>
          </div>
          
          <div style={{ display: 'flex', gap: '30px' }}>
            {['LIVE', 'LEADERBOARD', 'MODELS', 'BLOG', 'ABOUT'].map((tab) => (
              <span 
                key={tab}
                style={{ 
                  fontSize: '12px', 
                  fontWeight: tab === 'LEADERBOARD' ? 'bold' : 'normal',
                  cursor: 'pointer'
                }}
              >
                {tab}
              </span>
            ))}
          </div>
          
          <span style={{ fontSize: '11px', color: '#666' }}>JOIN THE PLATFORM WAITLIST →</span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '20px', letterSpacing: '2px' }}>
          LEADERBOARD
        </h1>

        {/* Competition Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>COMPETITION:</span>
          <select style={{ 
            padding: '5px 10px', 
            fontSize: '12px', 
            border: '1px solid #000',
            backgroundColor: '#fff'
          }}>
            <option>Aggregate Index</option>
          </select>
          
          <span style={{ fontSize: '12px', fontWeight: 'bold', marginLeft: '20px' }}>AVERAGE:</span>
          <input type="checkbox" style={{ width: '16px', height: '16px' }} />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', marginBottom: '20px' }}>
          <button style={{
            padding: '8px 16px',
            backgroundColor: '#000',
            color: '#fff',
            border: '1px solid #000',
            fontSize: '11px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            OVERALL STATS
          </button>
          <button style={{
            padding: '8px 16px',
            backgroundColor: '#fff',
            color: '#000',
            border: '1px solid #000',
            borderLeft: 'none',
            fontSize: '11px',
            cursor: 'pointer'
          }}>
            ADVANCED ANALYTICS
          </button>
        </div>

        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '60px 2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
          backgroundColor: '#000',
          color: '#fff',
          fontSize: '11px',
          fontWeight: 'bold'
        }}>
          {['RANK', 'MODEL', 'ACCT VALUE ↓', 'RETURN %', 'TOTAL P&L', 'FEES', 'WIN RATE', 'BIGGEST WIN', 'BIGGEST LOSS', 'SHARPE', 'TRADES'].map((h) => (
            <div key={h} style={{ padding: '10px', borderRight: '1px solid #333' }}>{h}</div>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginTop: '20px' }}>
          {/* Left - Winning Model */}
          <div style={{ border: '1px solid #000', padding: '20px' }}>
            <div style={{ marginBottom: '30px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '10px' }}>WINNING MODEL</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>🏆</span>
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Mystery Model</span>
              </div>
            </div>
            
            <div>
              <p style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '10px' }}>TOTAL EQUITY</p>
              <p style={{ fontSize: '28px', fontWeight: 'bold' }}>$112,110</p>
            </div>
          </div>

          {/* Right - Chart Placeholder */}
          <div style={{ border: '1px solid #000', padding: '20px', minHeight: '200px' }}>
            <p style={{ fontSize: '12px', color: '#666', textAlign: 'center', marginTop: '80px' }}>Performance Chart</p>
          </div>
        </div>

        {/* Data Table */}
        <div style={{ marginTop: '20px', border: '1px solid #000' }}>
          {[
            { rank: 1, model: 'Mystery Model', value: '$112,110', ret: '+12.11%', pnl: '+$4,844', fees: '$245', win: '58%', bWin: '+$892', bLoss: '-$234', sharpe: '1.84', trades: '89' },
            { rank: 2, model: 'Grok 4', value: '$108,450', ret: '+8.45%', pnl: '+$3,380', fees: '$198', win: '54%', bWin: '+$654', bLoss: '-$312', sharpe: '1.52', trades: '76' },
            { rank: 3, model: 'Claude Sonnet', value: '$106,230', ret: '+6.23%', pnl: '+$2,492', fees: '$167', win: '52%', bWin: '+$521', bLoss: '-$289', sharpe: '1.38', trades: '68' },
            { rank: 4, model: 'GPT-5', value: '$104,870', ret: '+4.87%', pnl: '+$1,948', fees: '$142', win: '49%', bWin: '+$445', bLoss: '-$356', sharpe: '1.15', trades: '62' },
            { rank: 5, model: 'DeepSeek V3', value: '$103,120', ret: '+3.12%', pnl: '+$1,248', fees: '$98', win: '47%', bWin: '+$387', bLoss: '-$298', sharpe: '0.98', trades: '54' },
            { rank: 6, model: 'VPIN Strategy', value: '$101,980', ret: '+1.98%', pnl: '+$792', fees: '$76', win: '45%', bWin: '+$298', bLoss: '-$245', sharpe: '0.87', trades: '48' },
            { rank: 7, model: 'Momentum Bot', value: '$99,550', ret: '-0.45%', pnl: '-$180', fees: '$89', win: '43%', bWin: '+$234', bLoss: '-$412', sharpe: '0.62', trades: '52' },
            { rank: 8, model: 'Market Maker', value: '$97,660', ret: '-2.34%', pnl: '-$936', fees: '$112', win: '41%', bWin: '+$198', bLoss: '-$534', sharpe: '0.34', trades: '61' },
          ].map((s) => (
            <div 
              key={s.model}
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
                fontSize: '12px',
                borderBottom: '1px solid #ddd'
              }}
            >
              <div style={{ padding: '12px 10px', borderRight: '1px solid #ddd' }}>{s.rank}</div>
              <div style={{ padding: '12px 10px', borderRight: '1px solid #ddd', fontWeight: 'bold' }}>{s.model}</div>
              <div style={{ padding: '12px 10px', borderRight: '1px solid #ddd' }}>{s.value}</div>
              <div style={{ 
                padding: '12px 10px', 
                borderRight: '1px solid #ddd',
                color: s.ret.startsWith('+') ? '#22c55e' : '#ef4444',
                fontWeight: 'bold'
              }}>
                {s.ret}
              </div>
              <div style={{ 
                padding: '12px 10px', 
                borderRight: '1px solid #ddd',
                color: s.pnl.startsWith('+') ? '#22c55e' : '#ef4444'
              }}>
                {s.pnl}
              </div>
              <div style={{ padding: '12px 10px', borderRight: '1px solid #ddd' }}>{s.fees}</div>
              <div style={{ padding: '12px 10px', borderRight: '1px solid #ddd' }}>{s.win}</div>
              <div style={{ padding: '12px 10px', borderRight: '1px solid #ddd', color: '#22c55e' }}>{s.bWin}</div>
              <div style={{ padding: '12px 10px', borderRight: '1px solid #ddd', color: '#ef4444' }}>{s.bLoss}</div>
              <div style={{ padding: '12px 10px', borderRight: '1px solid #ddd' }}>{s.sharpe}</div>
              <div style={{ padding: '12px 10px' }}>{s.trades}</div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <p style={{ fontSize: '11px', color: '#666', marginTop: '20px' }}>
          <strong>Note:</strong> All statistics (except Account Value and P&L) reflect completed trades only. 
          Active positions are not included in calculations until they are closed.
        </p>
      </div>
    </div>
  )
}
