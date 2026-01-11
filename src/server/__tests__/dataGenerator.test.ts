/**
 * Tests for stock data generation
 *
 * Data generator must create realistic stocks with:
 * - 1,000-5,000 stocks
 * - All fields populated with realistic values
 * - Factor scores calculated
 * - Valid ranges for all financial metrics
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { generateStocks, type GeneratedStock } from '../dataGenerator'
import { GICS_SECTORS } from '@/types/Stock'

describe('Stock Count Generation', () => {
	it('generates exactly specified number of stocks', () => {
		const stocks = generateStocks(100)
		expect(stocks).toHaveLength(100)
	})

	it('defaults to 2000 stocks when no count specified', () => {
		const stocks = generateStocks()
		expect(stocks).toHaveLength(2000)
	})

	it('can generate 5000 stocks', () => {
		const stocks = generateStocks(5000)
		expect(stocks).toHaveLength(5000)
	})
})

describe('Stock Data Structure', () => {
	let testStocks: GeneratedStock[]

	beforeAll(() => {
		testStocks = generateStocks(100)
	})

	it('has all required fields present', () => {
		const requiredFields = [
			'symbol',
			'name',
			'sector',
			'growthScore',
			'valueScore',
			'qualityScore',
			'momentumScore',
			'price',
			'changePercent',
			'volume',
			'marketCap',
			'pe',
			'pb',
			'ps',
			'evEbitda',
			'roe',
			'roa',
			'debtToEquity',
			'currentRatio',
			'quickRatio',
			'grossMargin',
			'operatingMargin',
			'netMargin',
			'ebitdaMargin',
			'revenueGrowth',
			'earningsGrowth',
			'epsGrowth',
			'dividendYield',
			'beta'
		] as const

		const sampleStock = testStocks[0]
		requiredFields.forEach((field) => {
			expect(sampleStock).toHaveProperty(field)
		})
	})

	it('has valid symbol format (3-5 uppercase letters)', () => {
		testStocks.forEach((stock) => {
			expect(stock.symbol).toMatch(/^[A-Z]{3,5}$/)
		})
	})

	it('has unique symbols', () => {
		const symbols = new Set(testStocks.map((s) => s.symbol))
		expect(symbols.size).toBe(testStocks.length)
	})

	it('has valid GICS sectors', () => {
		testStocks.forEach((stock) => {
			expect(GICS_SECTORS).toContain(stock.sector)
		})
	})
})

describe('Value Ranges', () => {
	let testStocks: GeneratedStock[]

	beforeAll(() => {
		testStocks = generateStocks(100)
	})

	it('has factor scores between 0-100', () => {
		testStocks.forEach((stock) => {
			expect(stock.growthScore).toBeGreaterThanOrEqual(0)
			expect(stock.growthScore).toBeLessThanOrEqual(100)
			expect(stock.valueScore).toBeGreaterThanOrEqual(0)
			expect(stock.valueScore).toBeLessThanOrEqual(100)
			expect(stock.qualityScore).toBeGreaterThanOrEqual(0)
			expect(stock.qualityScore).toBeLessThanOrEqual(100)
			expect(stock.momentumScore).toBeGreaterThanOrEqual(0)
			expect(stock.momentumScore).toBeLessThanOrEqual(100)
		})
	})

	it('has prices in realistic range ($1-$1000)', () => {
		testStocks.forEach((stock) => {
			expect(stock.price).toBeGreaterThanOrEqual(1)
			expect(stock.price).toBeLessThanOrEqual(1000)
		})
	})

	it('has positive and reasonable volume', () => {
		testStocks.forEach((stock) => {
			expect(stock.volume).toBeGreaterThan(0)
			expect(stock.volume).toBeLessThan(1e10)
		})
	})

	it('has positive market cap', () => {
		testStocks.forEach((stock) => {
			expect(stock.marketCap).toBeGreaterThan(0)
		})
	})

	it('has P/E ratio in realistic range (-50 to 200)', () => {
		testStocks.forEach((stock) => {
			expect(stock.pe).toBeGreaterThanOrEqual(-50)
			expect(stock.pe).toBeLessThanOrEqual(200)
		})
	})

	it('has margins in realistic range (-100% to 100%)', () => {
		testStocks.forEach((stock) => {
			expect(stock.grossMargin).toBeGreaterThanOrEqual(-1)
			expect(stock.grossMargin).toBeLessThanOrEqual(1)
			expect(stock.netMargin).toBeGreaterThanOrEqual(-1)
			expect(stock.netMargin).toBeLessThanOrEqual(1)
		})
	})

	it('has beta in realistic range (0-3)', () => {
		testStocks.forEach((stock) => {
			expect(stock.beta).toBeGreaterThanOrEqual(0)
			expect(stock.beta).toBeLessThanOrEqual(3)
		})
	})
})

describe('Data Distribution', () => {
	let testStocks: GeneratedStock[]

	beforeAll(() => {
		testStocks = generateStocks(100)
	})

	it('has good sector variety (at least 5 sectors represented)', () => {
		const sectorCounts: Record<string, number> = {}
		testStocks.forEach((stock) => {
			sectorCounts[stock.sector] = (sectorCounts[stock.sector] || 0) + 1
		})

		const uniqueSectors = Object.keys(sectorCounts).length
		expect(uniqueSectors).toBeGreaterThanOrEqual(5)
	})

	it('has variety in factor scores (not all the same)', () => {
		const growthScores = testStocks.map((s) => s.growthScore)
		const uniqueGrowthScores = new Set(growthScores).size

		expect(uniqueGrowthScores).toBeGreaterThan(10)
	})
})
