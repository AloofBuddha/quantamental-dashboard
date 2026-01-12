/**
 * Tests for StockDataStore
 *
 * The store manages stock data received from WebSocket:
 * - Stores stocks in a Map for O(1) lookups by symbol
 * - Provides bulk set for initial snapshot
 * - Provides partial update for real-time deltas
 * - Exposes selectors for consuming components
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { useStockDataStore, resetStockDataStore } from '../StockDataStore'
import type { StockData } from '@/types/Stock'

// Sample stock data for testing
const createMockStock = (symbol: string, overrides?: Partial<StockData>): StockData => ({
	symbol,
	name: `${symbol} Corp`,
	sector: 'Technology',
	growthScore: 75,
	valueScore: 60,
	qualityScore: 80,
	momentumScore: 65,
	price: 150.0,
	changePercent: 1.5,
	volume: 1000000,
	marketCap: 1000000000,
	pe: 25,
	pb: 5,
	ps: 3,
	evEbitda: 15,
	roe: 0.2,
	roa: 0.1,
	debtToEquity: 0.5,
	currentRatio: 2.0,
	quickRatio: 1.5,
	grossMargin: 0.4,
	operatingMargin: 0.25,
	netMargin: 0.15,
	ebitdaMargin: 0.3,
	revenueGrowth: 0.1,
	earningsGrowth: 0.12,
	epsGrowth: 0.11,
	dividendYield: 0.02,
	beta: 1.1,
	...overrides
})

describe('StockDataStore', () => {
	beforeEach(() => {
		// Reset store state before each test
		resetStockDataStore()
	})

	describe('Initial State', () => {
		it('starts with empty stocks map', () => {
			const state = useStockDataStore.getState()
			expect(state.stocks.size).toBe(0)
		})

		it('starts with lastUpdated as null', () => {
			const state = useStockDataStore.getState()
			expect(state.lastUpdated).toBeNull()
		})
	})

	describe('setStocks', () => {
		it('sets multiple stocks from array', () => {
			const mockStocks = [createMockStock('AAPL'), createMockStock('MSFT'), createMockStock('GOOGL')]

			useStockDataStore.getState().setStocks(mockStocks)

			const state = useStockDataStore.getState()
			expect(state.stocks.size).toBe(3)
		})

		it('indexes stocks by symbol for O(1) lookup', () => {
			const mockStocks = [createMockStock('AAPL', { price: 175 }), createMockStock('MSFT', { price: 350 })]

			useStockDataStore.getState().setStocks(mockStocks)

			const state = useStockDataStore.getState()
			expect(state.stocks.get('AAPL')?.price).toBe(175)
			expect(state.stocks.get('MSFT')?.price).toBe(350)
		})

		it('updates lastUpdated timestamp', () => {
			const before = Date.now()
			useStockDataStore.getState().setStocks([createMockStock('AAPL')])
			const after = Date.now()

			const state = useStockDataStore.getState()
			expect(state.lastUpdated).toBeGreaterThanOrEqual(before)
			expect(state.lastUpdated).toBeLessThanOrEqual(after)
		})

		it('replaces all existing stocks', () => {
			// Set initial stocks
			useStockDataStore.getState().setStocks([createMockStock('AAPL'), createMockStock('MSFT')])

			// Replace with new set
			useStockDataStore.getState().setStocks([createMockStock('GOOGL'), createMockStock('AMZN')])

			const state = useStockDataStore.getState()
			expect(state.stocks.size).toBe(2)
			expect(state.stocks.has('AAPL')).toBe(false)
			expect(state.stocks.has('GOOGL')).toBe(true)
		})
	})

	describe('updateStocksImmediate', () => {
		beforeEach(() => {
			// Set up initial stocks
			useStockDataStore
				.getState()
				.setStocks([
					createMockStock('AAPL', { price: 150, changePercent: 1.0 }),
					createMockStock('MSFT', { price: 300, changePercent: 0.5 })
				])
		})

		it('updates specific fields of existing stocks', () => {
			useStockDataStore.getState().updateStocksImmediate([{ symbol: 'AAPL', price: 155, changePercent: 2.0 }])

			const state = useStockDataStore.getState()
			const aapl = state.stocks.get('AAPL')
			expect(aapl?.price).toBe(155)
			expect(aapl?.changePercent).toBe(2.0)
			// Other fields unchanged
			expect(aapl?.name).toBe('AAPL Corp')
		})

		it('updates multiple stocks at once', () => {
			useStockDataStore.getState().updateStocksImmediate([
				{ symbol: 'AAPL', price: 155 },
				{ symbol: 'MSFT', price: 310 }
			])

			const state = useStockDataStore.getState()
			expect(state.stocks.get('AAPL')?.price).toBe(155)
			expect(state.stocks.get('MSFT')?.price).toBe(310)
		})

		it('ignores updates for non-existent symbols', () => {
			useStockDataStore.getState().updateStocksImmediate([{ symbol: 'UNKNOWN', price: 100 }])

			const state = useStockDataStore.getState()
			expect(state.stocks.size).toBe(2) // No new stock added
			expect(state.stocks.has('UNKNOWN')).toBe(false)
		})

		it('updates lastUpdated timestamp', () => {
			const before = Date.now()
			useStockDataStore.getState().updateStocksImmediate([{ symbol: 'AAPL', price: 160 }])
			const after = Date.now()

			const state = useStockDataStore.getState()
			expect(state.lastUpdated).toBeGreaterThanOrEqual(before)
			expect(state.lastUpdated).toBeLessThanOrEqual(after)
		})
	})

	describe('Selectors', () => {
		beforeEach(() => {
			useStockDataStore.getState().setStocks([createMockStock('AAPL'), createMockStock('MSFT'), createMockStock('GOOGL')])
		})

		it('getStocksArray returns array of all stocks', () => {
			const state = useStockDataStore.getState()
			const stocksArray = state.getStocksArray()

			expect(Array.isArray(stocksArray)).toBe(true)
			expect(stocksArray.length).toBe(3)
			expect(stocksArray.map((s) => s.symbol).sort()).toEqual(['AAPL', 'GOOGL', 'MSFT'])
		})

		it('getStockBySymbol returns stock for valid symbol', () => {
			const state = useStockDataStore.getState()
			const aapl = state.getStockBySymbol('AAPL')

			expect(aapl).toBeDefined()
			expect(aapl?.symbol).toBe('AAPL')
		})

		it('getStockBySymbol returns undefined for invalid symbol', () => {
			const state = useStockDataStore.getState()
			const unknown = state.getStockBySymbol('UNKNOWN')

			expect(unknown).toBeUndefined()
		})
	})

	describe('Performance', () => {
		it('handles large datasets (5000 stocks)', () => {
			const largeDataset = Array.from({ length: 5000 }, (_, i) => createMockStock(`SYM${i.toString().padStart(4, '0')}`))

			const startSet = performance.now()
			useStockDataStore.getState().setStocks(largeDataset)
			const setDuration = performance.now() - startSet

			expect(useStockDataStore.getState().stocks.size).toBe(5000)
			expect(setDuration).toBeLessThan(100) // Should complete in < 100ms

			// Test lookup speed
			const startLookup = performance.now()
			for (let i = 0; i < 1000; i++) {
				useStockDataStore.getState().stocks.get(`SYM${(i * 5).toString().padStart(4, '0')}`)
			}
			const lookupDuration = performance.now() - startLookup

			expect(lookupDuration).toBeLessThan(10) // 1000 lookups in < 10ms
		})
	})
})
