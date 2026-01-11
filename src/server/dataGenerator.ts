/**
 * Stock Data Generator for Quantamental Dashboard
 *
 * Generates realistic mock stock data with:
 * - Unique symbols (3-5 characters)
 * - Company names
 * - 11 GICS sectors
 * - All fundamental metrics with realistic distributions
 * - Calculated factor scores
 */

import { calculateAllFactorScores } from './factorCalculator'
import { GICS_SECTORS, type GICSSector, type StockData } from '@/types/Stock'

// Extended StockData with internal simulation fields
export interface GeneratedStock extends StockData {
	priceChange1M: number
	priceChange3M: number
	priceChange6M: number
}

// Company name templates by sector
const COMPANY_NAMES: Record<GICSSector, string[]> = {
	Technology: ['Tech', 'Systems', 'Software', 'Computing', 'Digital', 'Cyber', 'Cloud', 'Data'],
	Healthcare: ['Health', 'Medical', 'Pharma', 'Bio', 'Care', 'Therapeutics', 'Genetics'],
	Financials: ['Bank', 'Capital', 'Financial', 'Investment', 'Trust', 'Insurance', 'Asset'],
	'Consumer Discretionary': ['Retail', 'Auto', 'Media', 'Hotel', 'Restaurant', 'Apparel'],
	Industrials: ['Manufacturing', 'Industrial', 'Aerospace', 'Construction', 'Engineering'],
	'Communication Services': ['Telecom', 'Media', 'Entertainment', 'Broadcasting', 'Networks'],
	'Consumer Staples': ['Foods', 'Beverages', 'Household', 'Consumer', 'Products'],
	Energy: ['Energy', 'Oil', 'Gas', 'Petroleum', 'Renewable', 'Power'],
	Utilities: ['Electric', 'Utility', 'Water', 'Gas', 'Power'],
	'Real Estate': ['Properties', 'REIT', 'Real Estate', 'Development', 'Realty'],
	Materials: ['Materials', 'Chemical', 'Mining', 'Metals', 'Paper', 'Packaging']
}

const SYMBOL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

/**
 * Generate a random number within a range (normal distribution-ish)
 */
function randomNormal(min: number, max: number, skew: number = 0): number {
	let u = 0,
		v = 0
	while (u === 0) u = Math.random()
	while (v === 0) v = Math.random()
	let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)

	num = num / 10.0 + 0.5 // Translate to 0 -> 1
	if (num > 1 || num < 0) return randomNormal(min, max, skew) // Resample
	num = Math.pow(num, skew) // Skew
	num *= max - min // Stretch
	num += min // Offset
	return num
}

/**
 * Generate random integer
 */
function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Generate unique stock symbol (3-5 uppercase letters)
 */
function generateSymbol(existingSymbols: Set<string>): string {
	const length = randomInt(3, 5)
	let symbol: string

	do {
		symbol = ''
		for (let i = 0; i < length; i++) {
			symbol += SYMBOL_LETTERS[randomInt(0, SYMBOL_LETTERS.length - 1)]
		}
	} while (existingSymbols.has(symbol))

	return symbol
}

/**
 * Generate company name based on sector
 */
function generateCompanyName(sector: GICSSector): string {
	const adjectives = [
		'Global',
		'United',
		'American',
		'First',
		'Advanced',
		'Premier',
		'International',
		'National'
	]
	const suffixes = ['Corp', 'Inc', 'Group', 'Holdings', 'Co', 'Ltd', 'Partners']

	const sectorWords = COMPANY_NAMES[sector]
	const word1 = adjectives[randomInt(0, adjectives.length - 1)]
	const word2 = sectorWords[randomInt(0, sectorWords.length - 1)]
	const suffix = suffixes[randomInt(0, suffixes.length - 1)]

	return `${word1} ${word2} ${suffix}`
}

/**
 * Round to specified decimal places
 */
function round(value: number, decimals: number): number {
	const factor = Math.pow(10, decimals)
	return Math.round(value * factor) / factor
}

/**
 * Generate a single stock with realistic data
 */
function generateStock(symbol: string, sector: GICSSector): GeneratedStock {
	const name = generateCompanyName(sector)

	// Price and market data
	const price = randomNormal(10, 500, 1.5)
	const openPrice = price * (1 + randomNormal(-0.02, 0.02, 0))
	const changePercent = ((price - openPrice) / openPrice) * 100

	const volume = Math.round(randomNormal(1e6, 50e6, 2))
	const avgVolume = volume * randomNormal(0.9, 1.1, 0)
	const marketCap = price * randomNormal(100e6, 500e9, 3)

	// Valuation multiples
	const pe = randomNormal(5, 50, 1)
	const pb = randomNormal(0.5, 10, 2)
	const ps = randomNormal(0.3, 15, 2)
	const evEbitda = randomNormal(3, 30, 1.5)

	// Profitability metrics
	const grossMargin = randomNormal(0.1, 0.8, 0)
	const operatingMargin = grossMargin * randomNormal(0.3, 0.8, 0)
	const netMargin = operatingMargin * randomNormal(0.5, 0.9, 0)
	const ebitdaMargin = operatingMargin * randomNormal(1.1, 1.4, 0)

	// Return metrics
	const roe = randomNormal(-0.1, 0.4, 0)
	const roa = roe * randomNormal(0.4, 0.8, 0)

	// Debt and liquidity
	const debtToEquity = randomNormal(0, 3, 2)
	const currentRatio = randomNormal(0.8, 4, 1)
	const quickRatio = currentRatio * randomNormal(0.6, 0.9, 0)

	// Growth metrics
	const revenueGrowth = randomNormal(-0.3, 0.8, 0.5)
	const earningsGrowth = revenueGrowth * randomNormal(0.6, 1.5, 0)
	const epsGrowth = earningsGrowth * randomNormal(0.8, 1.2, 0)

	// Dividend and risk
	const dividendYield = randomNormal(0, 0.06, 2)
	const beta = randomNormal(0.5, 2.0, 0)

	// Price changes for momentum
	const priceChange1M = randomNormal(-0.15, 0.25, 0)
	const priceChange3M = priceChange1M * randomNormal(1.5, 2.5, 0)
	const priceChange6M = priceChange3M * randomNormal(1.2, 1.8, 0)

	// Build stock object
	const stockMetrics = {
		symbol,
		name,
		sector,
		price: round(price, 2),
		changePercent: round(changePercent, 2),
		volume: Math.round(volume),
		marketCap: Math.round(marketCap),
		pe: round(pe, 2),
		pb: round(pb, 2),
		ps: round(ps, 2),
		evEbitda: round(evEbitda, 2),
		roe: round(roe, 4),
		roa: round(roa, 4),
		debtToEquity: round(debtToEquity, 2),
		currentRatio: round(currentRatio, 2),
		quickRatio: round(quickRatio, 2),
		grossMargin: round(grossMargin, 4),
		operatingMargin: round(operatingMargin, 4),
		netMargin: round(netMargin, 4),
		ebitdaMargin: round(ebitdaMargin, 4),
		revenueGrowth: round(revenueGrowth, 4),
		earningsGrowth: round(earningsGrowth, 4),
		epsGrowth: round(epsGrowth, 4),
		dividendYield: round(dividendYield, 4),
		beta: round(beta, 2),
		openPrice: round(openPrice, 2),
		avgVolume: Math.round(avgVolume),
		volatility: beta * 0.15,
		priceChange1M: round(priceChange1M, 4),
		priceChange3M: round(priceChange3M, 4),
		priceChange6M: round(priceChange6M, 4)
	}

	// Calculate factor scores
	const factorScores = calculateAllFactorScores({
		...stockMetrics,
		priceChange1M: stockMetrics.priceChange1M,
		priceChange3M: stockMetrics.priceChange3M,
		priceChange6M: stockMetrics.priceChange6M
	})

	return {
		...stockMetrics,
		growthScore: round(factorScores.growthScore, 2),
		valueScore: round(factorScores.valueScore, 2),
		qualityScore: round(factorScores.qualityScore, 2),
		momentumScore: round(factorScores.momentumScore, 2)
	}
}

// Well-known stock symbols for realistic data
const WELL_KNOWN_SYMBOLS = [
	'AAPL',
	'MSFT',
	'GOOGL',
	'AMZN',
	'META',
	'TSLA',
	'NVDA',
	'JPM',
	'WMT',
	'JNJ',
	'XOM',
	'UNH',
	'BAC',
	'COST',
	'DIS',
	'NFLX',
	'ORCL',
	'CSCO',
	'INTC',
	'AMD'
]

/**
 * Generate an array of stocks
 * @param count - Number of stocks to generate (default: 2000)
 * @returns Array of stock objects
 */
export function generateStocks(count: number = 2000): GeneratedStock[] {
	const stocks: GeneratedStock[] = []
	const existingSymbols = new Set<string>()

	for (let i = 0; i < count; i++) {
		let symbol: string

		if (i < WELL_KNOWN_SYMBOLS.length) {
			symbol = WELL_KNOWN_SYMBOLS[i]
		} else {
			symbol = generateSymbol(existingSymbols)
		}

		existingSymbols.add(symbol)

		const sector = GICS_SECTORS[randomInt(0, GICS_SECTORS.length - 1)]
		const stock = generateStock(symbol, sector)
		stocks.push(stock)
	}

	console.log(`Generated ${stocks.length} stocks with realistic data`)
	return stocks
}
