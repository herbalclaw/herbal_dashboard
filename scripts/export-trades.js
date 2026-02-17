const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

// Parse Excel sheet3 XML
function parseSheet3(buffer) {
  // Find sheet3.xml in the ZIP
  const zipContent = buffer.toString('utf-8')
  const sheet3Marker = 'xl/worksheets/sheet3.xml'
  const sheet3Index = zipContent.indexOf(sheet3Marker)
  
  if (sheet3Index === -1) {
    throw new Error('Sheet3 not found')
  }
  
  // Extract the compressed content (Excel uses DEFLATE)
  // For simplicity, read the whole file as string and parse
  const content = buffer.toString('utf-8', 0, buffer.length)
  
  // Find sheet3 content between markers
  const startMarker = 'xl/worksheets/sheet3.xml'
  const endMarker = 'xl/worksheets/sheet4.xml'
  const startIdx = content.indexOf(startMarker)
  const endIdx = content.indexOf(endMarker, startIdx)
  
  let sheetContent
  if (endIdx > startIdx) {
    sheetContent = content.slice(startIdx + startMarker.length, endIdx)
  } else {
    sheetContent = content.slice(startIdx + startMarker.length)
  }
  
  const trades = []
  
  // Parse rows - look for <row> elements
  const rowRegex = /<row[^\u003e]*>([\s\S]*?)<\/row>/g
  let rowMatch
  let rowNum = 0
  
  while ((rowMatch = rowRegex.exec(sheetContent)) !== null) {
    rowNum++
    if (rowNum === 1) continue // Skip header
    
    const rowXml = rowMatch[1]
    
    // Extract all text content from cells
    // Handle both inline strings and shared strings
    const cellTexts = []
    
    // Match inline strings: <t>TEXT</t>
    const inlineRegex = /<t(?:\s+[^\u003e]*)?>([^\u003c]*)<\/t>/g
    let inlineMatch
    while ((inlineMatch = inlineRegex.exec(rowXml)) !== null) {
      cellTexts.push(inlineMatch[1])
    }
    
    // Match shared string references: <v>INDEX</v>
    const sharedRegex = /<v>(\d+)<\/v>/g
    let sharedMatch
    while ((sharedMatch = sharedRegex.exec(rowXml)) !== null) {
      cellTexts.push(sharedMatch[1])
    }
    
    // We need at least: Trade #, Date, Time, Strategy, Side, Entry, Exit, Status, P&L
    if (cellTexts.length >= 10) {
      const tradeId = parseInt(cellTexts[0]) || 0
      const date = cellTexts[1] || ''
      const time = cellTexts[2] || ''
      const strategy = cellTexts[3] || 'Unknown'
      const side = cellTexts[4] === 'UP' ? 'BUY' : 'SELL'
      const entry = parseFloat(cellTexts[5]) || 0
      const exit = parseFloat(cellTexts[6]) || 0
      const pnlStr = cellTexts[9] || '0' // P&L $ column
      const pnl = parseFloat(pnlStr.replace(/[^\d.-]/g, '')) || 0
      
      if (tradeId > 0 && strategy !== 'Strategy') {
        trades.push({
          id: tradeId,
          time: time || date,
          strategy,
          market: 'BTC-5M',
          side,
          entry,
          exit,
          pnl,
          status: pnl >= 0 ? 'WIN' : 'LOSS'
        })
      }
    }
  }
  
  return trades
}

// Main function
function main() {
  const excelPath = '/root/.openclaw/workspace/polymarket-strategy-tester/live_trading_results.xlsx'
  const outputPath = path.join(__dirname, '..', 'public', 'trades.json')
  
  try {
    if (!fs.existsSync(excelPath)) {
      console.error('Excel file not found:', excelPath)
      process.exit(1)
    }
    
    const buffer = fs.readFileSync(excelPath)
    const trades = parseSheet3(buffer)
    
    // Ensure public directory exists
    const publicDir = path.dirname(outputPath)
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }
    
    // Write JSON file
    fs.writeFileSync(outputPath, JSON.stringify({
      trades,
      total: trades.length,
      updated: new Date().toISOString()
    }, null, 2))
    
    console.log(`✓ Exported ${trades.length} trades to ${outputPath}`)
    
    // Log strategy counts
    const strategyCounts = {}
    for (const trade of trades) {
      strategyCounts[trade.strategy] = (strategyCounts[trade.strategy] || 0) + 1
    }
    console.log('\nStrategy breakdown:')
    for (const [strategy, count] of Object.entries(strategyCounts).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${strategy}: ${count}`)
    }
    
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

main()
