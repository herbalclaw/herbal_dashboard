'use client'

export default function ArenaBattle() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      padding: '20px',
      fontFamily: 'monospace'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
            Strategy Arena
          </h1>
          <p style={{ color: '#666' }}>Live battle between trading strategies</p>
        </div>

        {/* Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '20px',
          marginBottom: '30px'
        }}>
          {[
            { label: 'Active Strategies', value: '8' },
            { label: 'Total Trades', value: '524' },
            { label: 'Win Rate', value: '44%' },
            { label: 'Total P&L', value: '-$1.70' },
          ].map((stat) => (
            <div key={stat.label} style={{
              backgroundColor: 'white',
              padding: '20px',
              border: '1px solid #ddd',
              borderRadius: '8px'
            }}>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>{stat.label}</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Leaderboard */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <div style={{
            backgroundColor: '#333',
            color: 'white',
            padding: '15px 20px',
            fontWeight: 'bold'
          }}>
            Leaderboard
          </div>
          
          <div style={{ display: 'flex', borderBottom: '1px solid #ddd', fontWeight: 'bold', fontSize: '12px' }}>
            <div style={{ flex: 1, padding: '10px' }}>Rank</div>
            <div style={{ flex: 3, padding: '10px' }}>Strategy</div>
            <div style={{ flex: 2, padding: '10px' }}>Return %</div>
            <div style={{ flex: 2, padding: '10px' }}>Trades</div>
          </div>
          
          {[
            { rank: 1, name: 'VPIN', return: '+12.11%', trades: 89 },
            { rank: 2, name: 'BollingerBands', return: '+8.45%', trades: 76 },
            { rank: 3, name: 'TimeDecay', return: '+6.23%', trades: 68 },
            { rank: 4, name: 'Momentum', return: '+4.87%', trades: 62 },
            { rank: 5, name: 'HighProbConvergence', return: '+3.12%', trades: 54 },
            { rank: 6, name: 'EMAArbitrage', return: '+1.98%', trades: 48 },
            { rank: 7, name: 'VolatilityScorer', return: '-0.45%', trades: 52 },
            { rank: 8, name: 'MarketMaking', return: '-2.34%', trades: 61 },
          ].map((s) => (
            <div key={s.name} style={{ 
              display: 'flex', 
              borderBottom: '1px solid #eee',
              fontSize: '14px'
            }}>
              <div style={{ flex: 1, padding: '15px 10px' }}>{s.rank}</div>
              <div style={{ flex: 3, padding: '15px 10px', fontWeight: 500 }}>{s.name}</div>
              <div style={{ 
                flex: 2, 
                padding: '15px 10px',
                color: s.return.startsWith('+') ? 'green' : 'red'
              }}>
                {s.return}
              </div>
              <div style={{ flex: 2, padding: '15px 10px' }}>{s.trades}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
