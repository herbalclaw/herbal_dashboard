#!/usr/bin/env python3
"""
Export trades from Excel to JSON for dashboard
"""

import pandas as pd
import json
import os
from datetime import datetime

# Paths
EXCEL_PATH = '/root/.openclaw/workspace/polymarket-strategy-tester/live_trading_results.xlsx'
OUTPUT_PATH = '/root/.openclaw/workspace/herbal_dashboard/public/trades.json'

def main():
    # Read Excel
    df = pd.read_excel(EXCEL_PATH, sheet_name='All Trades')
    
    # Convert to trades format
    trades = []
    for _, row in df.iterrows():
        trade = {
            'id': int(row['Trade #']),
            'time': str(row['Time']),
            'strategy': str(row['Strategy']),
            'market': 'BTC-5M',
            'side': 'BUY' if row['Side'] == 'UP' else 'SELL',
            'entry': float(row['Entry Price']),
            'exit': float(row['Exit Price']) if pd.notna(row['Exit Price']) else 0,
            'pnl': float(row['P&L $']),
            'status': str(row['Status'])
        }
        trades.append(trade)
    
    # Ensure output directory exists
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    
    # Write JSON
    output = {
        'trades': trades,
        'total': len(trades),
        'updated': datetime.now().isoformat()
    }
    
    with open(OUTPUT_PATH, 'w') as f:
        json.dump(output, f, indent=2)
    
    print(f"✓ Exported {len(trades)} trades to {OUTPUT_PATH}")
    
    # Strategy breakdown
    strategy_counts = df['Strategy'].value_counts().to_dict()
    print(f"\nStrategy breakdown ({len(strategy_counts)} strategies):")
    for strategy, count in sorted(strategy_counts.items(), key=lambda x: -x[1]):
        print(f"  {strategy}: {count}")

if __name__ == '__main__':
    main()
