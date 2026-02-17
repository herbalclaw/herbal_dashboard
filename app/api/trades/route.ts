import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// Cache for trade data
let tradeCache: {
  data: any[]
  timestamp: number
  total: number
} | null = null

const CACHE_TTL = 30000 // 30 seconds cache

// Parse Excel binary format efficiently
async function parseExcelEfficiently(filePath: string): Promise<{ trades: any[], total: number }> {
  const buffer = await fs.readFile(filePath)
  
  // Check if it's a valid Excel file (ZIP format)
  if (buffer[0] !== 0x50 || buffer[1] !== 0x4B) {
    throw new Error('Invalid Excel file format')
  }
  
  // Find sheet1.xml in the ZIP
  const sheet1Marker = Buffer.from('xl/worksheets/sheet1.xml')
  const sheet1Index = buffer.indexOf(sheet1Marker)
  
  if (sheet1Index === -1) {
    throw new Error('Sheet1 not found in Excel file')
  }
  
  // Extract rows using string parsing (faster than XML parsing for large files)
  const content = buffer.toString('utf-8', 0, buffer.length)
  const trades: any[] = []
  
  // Find all row elements
  const rowRegex = /<row[^\u003e]*>([\s\S]*?)<\/row>/g
  let rowMatch
  let rowIndex = 0
  
  while ((rowMatch = rowRegex.exec(content)) !== null) {
    rowIndex++
    if (rowIndex === 1) continue // Skip header row
    
    const rowXml = rowMatch[1]
    
    // Extract cell values
    const cellRegex = /<c[^\u003e]*>(?:<is>)?<t>([^<]*)<\/t>(?:<\/is>)?<\/c>|<c[^\u003e]*><v>([^<]*)<\/v><\/c>/g
    const cells: string[] = []
    let cellMatch
    
    while ((cellMatch = cellRegex.exec(rowXml)) !== null) {
      cells.push(cellMatch[1] || cellMatch[2] || '')
    }
    
    if (cells.length >= 8 && cells[0]) {
      const tradeId = parseInt(cells[0]) || 0
      const date = cells[1] || ''
      const time = cells[2] || ''
      const strategy = cells[3] || 'Unknown'
      const side = cells[4]?.toUpperCase() || 'BUY'
      const entry = parseFloat(cells[5]) || 0
      const exit = parseFloat(cells[6]) || 0
      const pnl = parseFloat(cells[8]) || 0 // P&L $ column
      
      if (tradeId > 0) {
        trades.push({
          id: tradeId,
          time: time || date,
          strategy,
          market: 'BTC-5M',
          side: side as 'BUY' | 'SELL',
          entry,
          exit,
          pnl,
          status: pnl >= 0 ? 'WIN' : 'LOSS'
        })
      }
    }
  }
  
  // Sort by ID descending (most recent first)
  trades.sort((a, b) => b.id - a.id)
  
  return { trades, total: trades.length }
}

export async function GET() {
  const excelPath = path.join(process.cwd(), '..', 'polymarket-strategy-tester', 'live_trading_results.xlsx')
  
  try {
    // Check cache first
    if (tradeCache && Date.now() - tradeCache.timestamp < CACHE_TTL) {
      return NextResponse.json({
        trades: tradeCache.data,
        total: tradeCache.total,
        source: 'cache'
      })
    }
    
    // Check if file exists
    await fs.access(excelPath)
    
    // Parse Excel efficiently
    const { trades, total } = await parseExcelEfficiently(excelPath)
    
    if (trades.length === 0) {
      return NextResponse.json({
        trades: [],
        total: 0,
        error: 'No trades found in Excel file'
      }, { status: 404 })
    }
    
    // Update cache
    tradeCache = {
      data: trades,
      timestamp: Date.now(),
      total
    }
    
    return NextResponse.json({
      trades,
      total,
      source: 'excel'
    })
  } catch (error) {
    console.error('Error reading Excel:', error)
    
    // Return cached data if available, even if stale
    if (tradeCache) {
      return NextResponse.json({
        trades: tradeCache.data,
        total: tradeCache.total,
        source: 'cache-stale',
        error: 'Using cached data due to read error'
      })
    }
    
    return NextResponse.json({
      trades: [],
      total: 0,
      error: 'Failed to read trading data'
    }, { status: 500 })
  }
}
