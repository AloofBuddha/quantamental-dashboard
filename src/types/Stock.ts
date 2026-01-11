/**
 * Complete stock data interface for quantamental analysis
 * Combines real-time market data with fundamental metrics
 */
export interface StockData {
	// Basic Info
	symbol: string // AAPL, MSFT, etc.
	name: string // Apple Inc., Microsoft Corporation
	sector: string // One of 11 GICS sectors

	// Factor Scores (0-100)
	growthScore: number // Weighted: revenue/earnings/EPS growth
	valueScore: number // Weighted: P/E, P/B, P/S ratios (inverted)
	qualityScore: number // Weighted: ROE, ROA, margins, debt
	momentumScore: number // Weighted: 1m/3m/6m price performance

	// Real-time Market Data (updates every 1-5s)
	price: number // Current stock price
	changePercent: number // Daily % change
	volume: number // Current volume

	// Static/Slow-Changing Fundamentals
	marketCap: number // Market capitalization
	pe: number // Price/Earnings ratio
	pb: number // Price/Book ratio
	ps: number // Price/Sales ratio
	evEbitda: number // EV/EBITDA ratio
	roe: number // Return on Equity (as decimal, e.g., 0.25 = 25%)
	roa: number // Return on Assets (as decimal)
	debtToEquity: number // Debt-to-Equity ratio
	currentRatio: number // Current assets / Current liabilities
	quickRatio: number // (Current assets - Inventory) / Current liabilities

	// Profitability Margins (as decimals, e.g., 0.35 = 35%)
	grossMargin: number // Gross profit margin
	operatingMargin: number // Operating profit margin
	netMargin: number // Net profit margin
	ebitdaMargin: number // EBITDA margin

	// Growth Metrics (YoY % as decimals, e.g., 0.15 = 15% growth)
	revenueGrowth: number // Year-over-year revenue growth
	earningsGrowth: number // Year-over-year earnings growth
	epsGrowth: number // Year-over-year EPS growth

	// Other
	dividendYield: number // Dividend yield (as decimal, e.g., 0.02 = 2%)
	beta: number // Stock volatility relative to market

	// Internal fields for simulation (not displayed in UI)
	openPrice?: number // Opening price for calculating changePercent
	avgVolume?: number // Average volume for realistic simulation
	volatility?: number // Historical volatility for price simulation
}

/**
 * Partial stock update for real-time delta updates
 * Only includes fields that change frequently
 */
export interface StockUpdate {
	symbol: string
	price?: number
	changePercent?: number
	volume?: number
	momentumScore?: number // Recalculated when price changes
}

/**
 * WebSocket message types
 */
export interface SnapshotMessage {
	type: 'snapshot'
	timestamp: number
	stocks: StockData[]
}

export interface UpdateMessage {
	type: 'update'
	timestamp: number
	deltas: StockUpdate[]
}

export type WebSocketMessage = SnapshotMessage | UpdateMessage

/**
 * GICS Sectors (11 standard sectors)
 */
export const GICS_SECTORS = [
	'Technology',
	'Healthcare',
	'Financials',
	'Consumer Discretionary',
	'Industrials',
	'Communication Services',
	'Consumer Staples',
	'Energy',
	'Utilities',
	'Real Estate',
	'Materials'
] as const

export type GICSSector = (typeof GICS_SECTORS)[number]
