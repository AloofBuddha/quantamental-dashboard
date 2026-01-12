/**
 * Market Simulator - Generates realistic real-time price updates
 *
 * Simulates market dynamics:
 * - Price changes based on volatility
 * - Volume fluctuations
 * - Momentum score updates
 * - Batched delta updates (only changed fields)
 */

import type { StockData, StockUpdate } from '@/types/Stock'

/**
 * Configuration for market simulation
 */
export interface MarketSimulatorConfig {
	updateIntervalMs: number // How often to generate updates (e.g., 200ms)
	updatePercentage: number // % of stocks to update each interval (0-1, e.g., 0.1 = 10%)
	volatilityMultiplier: number // Scale factor for price changes (1.0 = normal)
}

const DEFAULT_CONFIG: MarketSimulatorConfig = {
	updateIntervalMs: 200, // 5 updates per second
	updatePercentage: 0.1, // Update 10% of stocks each time
	volatilityMultiplier: 1.0
}

/**
 * Market Simulator class
 * Maintains state and generates realistic price updates
 */
export class MarketSimulator {
	private stocks: StockData[]
	private config: MarketSimulatorConfig
	private intervalId: NodeJS.Timeout | null = null
	private onUpdate: (deltas: StockUpdate[]) => void

	constructor(
		stocks: StockData[],
		onUpdate: (deltas: StockUpdate[]) => void,
		config: Partial<MarketSimulatorConfig> = {}
	) {
		this.stocks = stocks
		this.onUpdate = onUpdate
		this.config = { ...DEFAULT_CONFIG, ...config }
	}

	/**
	 * Start generating updates at the configured interval
	 */
	start(): void {
		if (this.intervalId) {
			console.warn('Market simulator already running')
			return
		}

		console.log(`Starting market simulator (updating ${this.config.updatePercentage * 100}% of stocks every ${this.config.updateIntervalMs}ms)`)

		this.intervalId = setInterval(() => {
			const deltas = this.generateUpdate()
			if (deltas.length > 0) {
				this.onUpdate(deltas)
			}
		}, this.config.updateIntervalMs)
	}

	/**
	 * Stop generating updates
	 */
	stop(): void {
		if (this.intervalId) {
			clearInterval(this.intervalId)
			this.intervalId = null
			console.log('Market simulator stopped')
		}
	}

	/**
	 * Generate a batch of stock updates
	 * Returns array of deltas (only changed fields)
	 */
	private generateUpdate(): StockUpdate[] {
		const deltas: StockUpdate[] = []
		const numToUpdate = Math.floor(this.stocks.length * this.config.updatePercentage)

		// Randomly select stocks to update
		const indicesToUpdate = this.getRandomIndices(this.stocks.length, numToUpdate)

		for (const index of indicesToUpdate) {
			const stock = this.stocks[index]
			const delta = this.simulateStockUpdate(stock)
			if (delta) {
				deltas.push(delta)
			}
		}

		return deltas
	}

	/**
	 * Simulate a single stock update
	 * Uses stock's volatility to generate realistic price changes
	 */
	private simulateStockUpdate(stock: StockData): StockUpdate | null {
		// Use stock's volatility (or default to 0.02 = 2% daily vol)
		const volatility = (stock.volatility || 0.02) * this.config.volatilityMultiplier

		// Generate random price change using normal distribution approximation
		// Box-Muller transform for better distribution
		const u1 = Math.random()
		const u2 = Math.random()
		const normalRandom = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2)

		// Scale by volatility and time (assuming updates represent ~1 second of trading)
		const priceChangePercent = normalRandom * volatility * Math.sqrt(1 / 252 / 6.5 / 3600) // Annualized to 1 second

		// Apply price change
		const newPrice = stock.price * (1 + priceChangePercent)

		// Calculate change from open price
		const openPrice = stock.openPrice || stock.price
		const changePercent = ((newPrice - openPrice) / openPrice) * 100

		// Simulate volume change (random walk around average)
		const volumeChange = (Math.random() - 0.5) * 0.1 // +/- 5% change
		const newVolume = Math.max(0, stock.volume * (1 + volumeChange))

		// Update the stock's internal state
		stock.price = newPrice
		stock.changePercent = changePercent
		stock.volume = newVolume

		// Recalculate momentum score (price-based)
		// For real-time simulation, we'll just slightly adjust it based on price change
		const momentumAdjustment = priceChangePercent * 100 // Convert to score impact
		stock.momentumScore = Math.max(0, Math.min(100, stock.momentumScore + momentumAdjustment))

		// Return delta with only changed fields
		return {
			symbol: stock.symbol,
			price: newPrice,
			changePercent: changePercent,
			volume: newVolume,
			momentumScore: stock.momentumScore
		}
	}

	/**
	 * Get N random unique indices from range [0, max)
	 */
	private getRandomIndices(max: number, count: number): number[] {
		const indices = new Set<number>()

		// If we need more than half, it's faster to select all then remove
		if (count > max / 2) {
			const all = Array.from({ length: max }, (_, i) => i)
			// Shuffle using Fisher-Yates
			for (let i = all.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1))
				;[all[i], all[j]] = [all[j], all[i]]
			}
			return all.slice(0, count)
		}

		// Otherwise, randomly select unique indices
		while (indices.size < count) {
			indices.add(Math.floor(Math.random() * max))
		}

		return Array.from(indices)
	}
}

/**
 * Helper: Calculate realistic volatility for a stock based on its characteristics
 */
export function estimateVolatility(stock: StockData): number {
	// Base volatility on sector and market cap
	let baseVol = 0.02 // 2% daily volatility baseline

	// Smaller stocks tend to be more volatile
	const marketCapBillions = stock.marketCap / 1e9
	if (marketCapBillions < 2) {
		baseVol *= 2.0 // Small cap: 2x volatility
	} else if (marketCapBillions < 10) {
		baseVol *= 1.5 // Mid cap: 1.5x volatility
	}

	// Tech and healthcare tend to be more volatile
	if (stock.sector === 'Technology' || stock.sector === 'Healthcare') {
		baseVol *= 1.3
	}

	// Use beta if available
	if (stock.beta) {
		baseVol *= stock.beta
	}

	return baseVol
}
