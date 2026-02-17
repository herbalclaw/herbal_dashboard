import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// Read Excel file without external dependencies
async function readExcelFile(filePath: string) {
  try {
    const buffer = await fs.readFile(filePath)
    const content = buffer.toString('utf-8', 0, Math.min(buffer.length, 500000)) // Read first 500KB
    
    // Extract trade data from Excel XML
    const trades: any[] = []
    
    // Look for trade rows in the Excel XML
    // Excel stores data in shared strings and sheet XML
    const rowMatches = content.match(/<row[^>]*>.*?<\/row>/gs) || []
    
    for (const row of rowMatches.slice(1)) { // Skip header row
      const cells = row.match(/<c[^>]*>.*?<\/c>/gs) || []
      if (cells.length >= 8) {
        const tradeId = extractCellValue(cells[0], content)
        const time = extractCellValue(cells[1], content)
        const strategy = extractCellValue(cells[2], content)
        const market = extractCellValue(cells[3], content)
        const side = extractCellValue(cells[4], content)
        const entry = parseFloat(extractCellValue(cells[5], content) || '0')
        const exit = parseFloat(extractCellValue(cells[6], content) || '0')
        const pnl = parseFloat(extractCellValue(cells[7], content) || '0')
        
        if (tradeId && strategy) {
          trades.push({
            id: parseInt(tradeId) || trades.length + 1,
            time: time || '00:00:00',
            strategy: strategy || 'Unknown',
            market: market || 'BTC-5M',
            side: (side?.toUpperCase() || 'BUY') as 'BUY' | 'SELL',
            entry,
            exit,
            pnl,
            status: pnl >= 0 ? 'WIN' : 'LOSS'
          })
        }
      }
    }
    
    return trades.reverse() // Most recent first
  } catch (error) {
    console.error('Error reading Excel:', error)
    return []
  }
}

function extractCellValue(cellXml: string, fullContent: string): string {
  // Check if it's a shared string reference
  const sharedStringMatch = cellXml.match(/<v>(\d+)<\/v>/)
  if (sharedStringMatch) {
    const index = parseInt(sharedStringMatch[1])
    // Extract from shared strings
    const sharedStrings = fullContent.match(/<si>.*?<\/si>/gs) || []
    if (sharedStrings[index]) {
      const textMatch = sharedStrings[index].match(/<t>([^<]*)<\/t>/)
      return textMatch?.[1] || ''
    }
  }
  
  // Direct value
  const directMatch = cellXml.match(/<v>([^<]*)<\/v>/)
  return directMatch?.[1] || ''
}

export async function GET() {
  const excelPath = path.join(process.cwd(), '..', 'polymarket-strategy-tester', 'live_trading_results.xlsx')
  
  try {
    // Check if file exists
    await fs.access(excelPath)
    
    // Read Excel
    const trades = await readExcelFile(excelPath)
    
    if (trades.length === 0) {
      return NextResponse.json({ 
        trades: [],
        total: 0,
        error: 'No trades found in Excel file'
      }, { status: 404 })
    }
    
    return NextResponse.json({ 
      trades,
      total: trades.length,
      source: 'excel'
    })
  } catch (error) {
    return NextResponse.json({ 
      trades: [],
      total: 0,
      error: 'Failed to read trading data'
    }, { status: 500 })
  }
}
