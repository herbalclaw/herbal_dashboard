# Herbal Dashboard

Real-time dashboard for monitoring Polymarket BTC 5-minute trading bot activity.

## Features

- 📊 **System Health** - Monitor data collector and paper trading bot status
- 💾 **Data Collector** - View collected price data per timeframe
- 📈 **Paper Trading** - Track strategy P&L and performance
- 📱 **Mobile Friendly** - Optimized for mobile viewing
- 🔄 **Auto-refresh** - Updates every 30 seconds from GitHub

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Vercel Deployment

## Development

```bash
npm install
npm run dev
```

## Deployment

Automatically deploys to Vercel on every push to main branch.

## Data Sources

- Data Collector: `polymarket-data-collector` repo
- Paper Trading: `polymarket-strategy-tester` repo

Updates reflect immediately when repos are pushed.
