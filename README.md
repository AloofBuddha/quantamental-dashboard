# Quantamental Dashboard

A high-performance stock screening and analysis dashboard built with React, AG Grid, and WebSockets. Features real-time data updates, quantamental factor scoring, and customizable color rules for visual pattern recognition.

## Features

- **Real-time Data**: WebSocket server broadcasts 2,000+ stocks with live price updates
- **Factor Scoring**: Four quantamental factors (Growth, Value, Quality, Momentum) scored 0-100
- **Multiple Views**: Screener, Ticker, Fundamentals, and Portfolio views
- **Color Rules**: User-defined conditional formatting with AND/OR logic
- **Watchlists**: Create and manage custom stock watchlists
- **High Performance**: 60 FPS with 5,000 stocks and real-time updates

## Tech Stack

- **Frontend**: React 18, TypeScript, TanStack Router
- **Data Grid**: AG Grid Enterprise
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Real-time**: WebSocket (ws)
- **Testing**: Vitest, Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/quantamental-dashboard.git
cd quantamental-dashboard

# Install dependencies
pnpm install
```

### Running the Application

```bash
# Terminal 1: Start the WebSocket server
npx tsx src/server/index.ts

# Terminal 2: Start the dev server
pnpm dev
```

The app will be available at `http://localhost:5173`

### Running Tests

```bash
# Run all tests
pnpm vitest run

# Run server tests only
pnpm vitest run src/server

# Interactive test UI
pnpm vitest --ui

# E2E tests
pnpm playwright test
```

## Project Structure

```
src/
├── server/                 # WebSocket server (TypeScript)
│   ├── index.ts           # Server entry point
│   ├── factorCalculator.ts # Factor score calculations
│   ├── dataGenerator.ts   # Mock stock data generation
│   └── __tests__/         # Server unit tests
├── types/                  # TypeScript type definitions
│   ├── Stock.ts           # Stock data interfaces
│   ├── ColorRule.ts       # Color rule types
│   └── Watchlist.ts       # Watchlist types
├── stores/                 # Zustand state management
├── components/             # React components
├── routes/                 # TanStack Router pages
└── utils/                  # Utility functions
```

## Factor Scores

All factor scores are normalized to 0-100 (higher is better):

| Factor | Description | Key Metrics |
|--------|-------------|-------------|
| **Growth** | Revenue and earnings momentum | Revenue growth, EPS growth, Earnings growth |
| **Value** | Valuation attractiveness | P/E, P/B, P/S, EV/EBITDA (inverted) |
| **Quality** | Financial health | ROE, ROA, Net margin, Debt/Equity |
| **Momentum** | Price trends | 1M, 3M, 6M price changes |

## Development Phases

See [PROGRESS.md](./PROGRESS.md) for detailed implementation status.

- ✅ **Phase 1**: Foundation (Server, Types, Tests)
- ⏳ **Phase 2**: Basic Views (Stores, Grid, Routes)
- ⏳ **Phase 3**: Real-Time Updates
- ⏳ **Phase 4**: Color Rules
- ⏳ **Phase 5**: Polish

## License

MIT
