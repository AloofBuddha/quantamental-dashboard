/**
 * Column definitions for stock data views
 *
 * Four views with different column sets:
 * - Screener: Factor scores + key metrics
 * - Ticker: Real-time price data
 * - Fundamentals: Valuation and profitability ratios
 * - Portfolio: For watchlist/portfolio view
 */

import type { ColDef, ValueFormatterParams } from 'ag-grid-community'
import { GICS_SECTORS } from '@/types/Stock'
import { PriceRenderer, PriceChangeRenderer } from '@/components/stock/cellRenderers/PriceChangeRenderer'

// Formatters
const ratioFormatter = (params: ValueFormatterParams) =>
	params.value != null ? params.value.toFixed(2) : '-'

const decimalPercentFormatter = (params: ValueFormatterParams) => {
	if (params.value == null) return '-'
	return `${(params.value * 100).toFixed(1)}%`
}

const volumeFormatter = (params: ValueFormatterParams) => {
	if (params.value == null) return '-'
	if (params.value >= 1e9) return `${(params.value / 1e9).toFixed(1)}B`
	if (params.value >= 1e6) return `${(params.value / 1e6).toFixed(1)}M`
	if (params.value >= 1e3) return `${(params.value / 1e3).toFixed(1)}K`
	return params.value.toLocaleString()
}

const marketCapFormatter = (params: ValueFormatterParams) => {
	if (params.value == null) return '-'
	if (params.value >= 1e12) return `$${(params.value / 1e12).toFixed(2)}T`
	if (params.value >= 1e9) return `$${(params.value / 1e9).toFixed(2)}B`
	if (params.value >= 1e6) return `$${(params.value / 1e6).toFixed(2)}M`
	return `$${params.value.toLocaleString()}`
}

const scoreFormatter = (params: ValueFormatterParams) =>
	params.value != null ? Math.round(params.value).toString() : '-'

// Common column definitions
const symbolCol: ColDef = {
	field: 'symbol',
	headerName: 'Symbol',
	pinned: 'left',
	width: 90,
	filter: 'agTextColumnFilter'
}

const nameCol: ColDef = {
	field: 'name',
	headerName: 'Name',
	minWidth: 150,
	filter: 'agTextColumnFilter'
}

const sectorCol: ColDef = {
	field: 'sector',
	headerName: 'Sector',
	minWidth: 140,
	filter: 'agSetColumnFilter',
	filterParams: {
		values: [...GICS_SECTORS],
		defaultToNothingSelected: true
	}
}

const priceCol: ColDef = {
	field: 'price',
	headerName: 'Price',
	type: 'numericColumn',
	filter: 'agNumberColumnFilter',
	cellRenderer: PriceRenderer,
	width: 100
}

const changePercentCol: ColDef = {
	field: 'changePercent',
	headerName: 'Change %',
	type: 'numericColumn',
	filter: 'agNumberColumnFilter',
	cellRenderer: PriceChangeRenderer,
	width: 100
}

const volumeCol: ColDef = {
	field: 'volume',
	headerName: 'Volume',
	type: 'numericColumn',
	filter: 'agNumberColumnFilter',
	valueFormatter: volumeFormatter,
	width: 100
}

const marketCapCol: ColDef = {
	field: 'marketCap',
	headerName: 'Mkt Cap',
	type: 'numericColumn',
	filter: 'agNumberColumnFilter',
	valueFormatter: marketCapFormatter,
	width: 110
}

// Factor score columns
const growthScoreCol: ColDef = {
	field: 'growthScore',
	headerName: 'Growth',
	type: 'numericColumn',
	filter: 'agNumberColumnFilter',
	valueFormatter: scoreFormatter,
	width: 85
}

const valueScoreCol: ColDef = {
	field: 'valueScore',
	headerName: 'Value',
	type: 'numericColumn',
	filter: 'agNumberColumnFilter',
	valueFormatter: scoreFormatter,
	width: 85
}

const qualityScoreCol: ColDef = {
	field: 'qualityScore',
	headerName: 'Quality',
	type: 'numericColumn',
	filter: 'agNumberColumnFilter',
	valueFormatter: scoreFormatter,
	width: 85
}

const momentumScoreCol: ColDef = {
	field: 'momentumScore',
	headerName: 'Momentum',
	type: 'numericColumn',
	filter: 'agNumberColumnFilter',
	valueFormatter: scoreFormatter,
	width: 100
}

// Valuation columns
const peCol: ColDef = {
	field: 'pe',
	headerName: 'P/E',
	type: 'numericColumn',
	filter: 'agNumberColumnFilter',
	valueFormatter: ratioFormatter,
	width: 80
}

const pbCol: ColDef = {
	field: 'pb',
	headerName: 'P/B',
	type: 'numericColumn',
	filter: 'agNumberColumnFilter',
	valueFormatter: ratioFormatter,
	width: 80
}

const psCol: ColDef = {
	field: 'ps',
	headerName: 'P/S',
	type: 'numericColumn',
	filter: 'agNumberColumnFilter',
	valueFormatter: ratioFormatter,
	width: 80
}

const evEbitdaCol: ColDef = {
	field: 'evEbitda',
	headerName: 'EV/EBITDA',
	type: 'numericColumn',
	filter: 'agNumberColumnFilter',
	valueFormatter: ratioFormatter,
	width: 100
}

// Profitability columns
const roeCol: ColDef = {
	field: 'roe',
	headerName: 'ROE',
	type: 'numericColumn',
	filter: 'agNumberColumnFilter',
	valueFormatter: decimalPercentFormatter,
	width: 85
}

const roaCol: ColDef = {
	field: 'roa',
	headerName: 'ROA',
	type: 'numericColumn',
	filter: 'agNumberColumnFilter',
	valueFormatter: decimalPercentFormatter,
	width: 85
}

const grossMarginCol: ColDef = {
	field: 'grossMargin',
	headerName: 'Gross Mgn',
	type: 'numericColumn',
	filter: 'agNumberColumnFilter',
	valueFormatter: decimalPercentFormatter,
	width: 100
}

const netMarginCol: ColDef = {
	field: 'netMargin',
	headerName: 'Net Mgn',
	type: 'numericColumn',
	filter: 'agNumberColumnFilter',
	valueFormatter: decimalPercentFormatter,
	width: 95
}

// Debt & Liquidity
const debtToEquityCol: ColDef = {
	field: 'debtToEquity',
	headerName: 'D/E',
	type: 'numericColumn',
	filter: 'agNumberColumnFilter',
	valueFormatter: ratioFormatter,
	width: 80
}

const currentRatioCol: ColDef = {
	field: 'currentRatio',
	headerName: 'Current',
	type: 'numericColumn',
	filter: 'agNumberColumnFilter',
	valueFormatter: ratioFormatter,
	width: 90
}

// Growth columns
const revenueGrowthCol: ColDef = {
	field: 'revenueGrowth',
	headerName: 'Rev Grw',
	type: 'numericColumn',
	filter: 'agNumberColumnFilter',
	valueFormatter: decimalPercentFormatter,
	width: 95
}

const earningsGrowthCol: ColDef = {
	field: 'earningsGrowth',
	headerName: 'Earn Grw',
	type: 'numericColumn',
	filter: 'agNumberColumnFilter',
	valueFormatter: decimalPercentFormatter,
	width: 100
}

// Other
const betaCol: ColDef = {
	field: 'beta',
	headerName: 'Beta',
	type: 'numericColumn',
	filter: 'agNumberColumnFilter',
	valueFormatter: ratioFormatter,
	width: 80
}

/**
 * Screener View - Factor scores + key metrics
 * Focus: Find stocks based on factor scores
 */
export const SCREENER_COLUMN_DEFS: ColDef[] = [
	symbolCol,
	nameCol,
	sectorCol,
	priceCol,
	changePercentCol,
	marketCapCol,
	growthScoreCol,
	valueScoreCol,
	qualityScoreCol,
	momentumScoreCol,
	peCol,
	betaCol
]

/**
 * Ticker View - Real-time price focused
 * Focus: Monitor price movements
 */
export const TICKER_COLUMN_DEFS: ColDef[] = [
	symbolCol,
	nameCol,
	priceCol,
	changePercentCol,
	volumeCol,
	marketCapCol,
	betaCol
]

/**
 * Fundamentals View - Deep dive into financials
 * Focus: Detailed financial analysis
 */
export const FUNDAMENTALS_COLUMN_DEFS: ColDef[] = [
	symbolCol,
	nameCol,
	sectorCol,
	// Valuation
	peCol,
	pbCol,
	psCol,
	evEbitdaCol,
	// Profitability
	roeCol,
	roaCol,
	grossMarginCol,
	netMarginCol,
	// Debt & Growth
	debtToEquityCol,
	currentRatioCol,
	revenueGrowthCol,
	earningsGrowthCol
]

/**
 * Portfolio View - For watchlist tracking
 * Focus: Key metrics for portfolio monitoring
 */
export const PORTFOLIO_COLUMN_DEFS: ColDef[] = [
	symbolCol,
	nameCol,
	sectorCol,
	priceCol,
	changePercentCol,
	volumeCol,
	marketCapCol,
	growthScoreCol,
	valueScoreCol,
	qualityScoreCol,
	momentumScoreCol,
	peCol,
	betaCol
]

/**
 * Get column definitions by view name
 */
export function getColumnDefsForView(view: 'screener' | 'ticker' | 'fundamentals' | 'portfolio'): ColDef[] {
	switch (view) {
		case 'screener':
			return SCREENER_COLUMN_DEFS
		case 'ticker':
			return TICKER_COLUMN_DEFS
		case 'fundamentals':
			return FUNDAMENTALS_COLUMN_DEFS
		case 'portfolio':
			return PORTFOLIO_COLUMN_DEFS
	}
}
