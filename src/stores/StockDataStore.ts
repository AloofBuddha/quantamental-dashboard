/**
 * StockDataStore - Zustand store for stock data management
 *
 * Stores stocks in a Map for O(1) lookups by symbol.
 * Designed for high-frequency updates with minimal re-renders.
 *
 * Features:
 * - Update batching: Collects multiple updates and applies them in one render cycle
 * - requestAnimationFrame scheduling: Syncs updates with browser paint for smooth 60 FPS
 */

import { create } from 'zustand'
import type { StockData, StockUpdate } from '@/types/Stock'

// Batching state (outside Zustand store to avoid re-renders)
let updateQueue: StockUpdate[] = []
let rafId: number | null = null

interface StockDataState {
	// Core state
	stocks: Map<string, StockData>
	lastUpdated: number | null

	// Actions
	setStocks: (stocks: StockData[]) => void
	updateStocks: (updates: StockUpdate[]) => void // Batched updates
	updateStocksImmediate: (updates: StockUpdate[]) => void // Non-batched (for testing)

	// Selectors (for convenience, also exposed as hooks below)
	getStocksArray: () => StockData[]
	getStockBySymbol: (symbol: string) => StockData | undefined
}

export const useStockDataStore = create<StockDataState>((set, get) => ({
	// Initial state
	stocks: new Map(),
	lastUpdated: null,

	// Bulk set stocks (used for initial snapshot)
	setStocks: (stocks: StockData[]) => {
		const stockMap = new Map<string, StockData>()
		for (const stock of stocks) {
			stockMap.set(stock.symbol, stock)
		}
		set({
			stocks: stockMap,
			lastUpdated: Date.now()
		})
	},

	// Batched update: Queue updates and apply on next animation frame
	// This ensures smooth 60 FPS by syncing with browser paint cycles
	updateStocks: (updates: StockUpdate[]) => {
		// Add to queue
		updateQueue.push(...updates)

		// Schedule flush if not already scheduled
		if (rafId === null) {
			rafId = requestAnimationFrame(() => {
				const { updateStocksImmediate } = get()
				updateStocksImmediate(updateQueue)
				updateQueue = []
				rafId = null
			})
		}
	},

	// Immediate update (non-batched, used internally and for testing)
	updateStocksImmediate: (updates: StockUpdate[]) => {
		const currentStocks = get().stocks
		const newStocks = new Map(currentStocks)

		for (const update of updates) {
			const existing = newStocks.get(update.symbol)
			if (existing) {
				// Merge update into existing stock
				newStocks.set(update.symbol, {
					...existing,
					...update
				})
			}
			// Ignore updates for non-existent symbols
		}

		set({
			stocks: newStocks,
			lastUpdated: Date.now()
		})
	},

	// Get all stocks as array (for AG Grid rowData)
	getStocksArray: () => {
		return Array.from(get().stocks.values())
	},

	// Get single stock by symbol
	getStockBySymbol: (symbol: string) => {
		return get().stocks.get(symbol)
	}
}))

// Reset function for testing
export const resetStockDataStore = () => {
	// Cancel any pending updates
	if (rafId !== null) {
		cancelAnimationFrame(rafId)
		rafId = null
	}
	updateQueue = []

	useStockDataStore.setState({
		stocks: new Map(),
		lastUpdated: null
	})
}

// Convenience hooks for React components
export const useStocks = () => useStockDataStore((state) => state.getStocksArray())
export const useStockBySymbol = (symbol: string) =>
	useStockDataStore((state) => state.getStockBySymbol(symbol))
export const useStockCount = () => useStockDataStore((state) => state.stocks.size)
export const useLastUpdated = () => useStockDataStore((state) => state.lastUpdated)
