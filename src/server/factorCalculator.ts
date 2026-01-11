/**
 * Factor Score Calculator for Quantamental Analysis
 *
 * All scores are normalized to 0-100 range (higher is better)
 * - Growth Score: Revenue, earnings, and EPS growth
 * - Value Score: Valuation multiples (inverted: lower P/E = higher score)
 * - Quality Score: Profitability, debt, and liquidity
 * - Momentum Score: Price performance over time
 */

// Input types for each score calculator
export interface GrowthMetrics {
	revenueGrowth: number // YoY revenue growth (decimal, e.g., 0.15 = 15%)
	earningsGrowth: number // YoY earnings growth (decimal)
	epsGrowth: number // YoY EPS growth (decimal)
}

export interface ValueMetrics {
	pe: number // Price/Earnings ratio
	pb: number // Price/Book ratio
	ps: number // Price/Sales ratio
	evEbitda: number // EV/EBITDA ratio
	dividendYield: number // Dividend yield (decimal, e.g., 0.05 = 5%)
}

export interface QualityMetrics {
	roe: number // Return on Equity (decimal, e.g., 0.25 = 25%)
	roa: number // Return on Assets (decimal)
	netMargin: number // Net profit margin (decimal)
	debtToEquity: number // Debt-to-Equity ratio
	currentRatio: number // Current ratio
}

export interface MomentumMetrics {
	priceChange1M: number // 1-month price change (decimal)
	priceChange3M: number // 3-month price change (decimal)
	priceChange6M: number // 6-month price change (decimal)
}

export interface FactorScores {
	growthScore: number
	valueScore: number
	qualityScore: number
	momentumScore: number
}

// Stock data with all fields needed for score calculation
export interface StockMetrics extends GrowthMetrics, ValueMetrics, QualityMetrics {
	priceChange1M?: number
	priceChange3M?: number
	priceChange6M?: number
}

/**
 * Normalize a value to 0-100 range
 */
function normalize(value: number, min: number, max: number): number {
	if (max === min) return 50 // Avoid division by zero
	const normalized = ((value - min) / (max - min)) * 100
	return Math.max(0, Math.min(100, normalized)) // Clamp to 0-100
}

/**
 * Calculate Growth Score (0-100)
 * Weights: 30% revenue growth + 30% earnings growth + 25% EPS growth + 15% consistency
 */
export function calculateGrowthScore({
	revenueGrowth,
	earningsGrowth,
	epsGrowth
}: GrowthMetrics): number {
	// Normalize each component to 0-100
	// Range: -20% to +50% captures most meaningful variations
	const revenueScore = normalize(revenueGrowth, -0.2, 0.5)
	const earningsScore = normalize(earningsGrowth, -0.2, 0.5)
	const epsScore = normalize(epsGrowth, -0.2, 0.5)

	// Consistency bonus: If all three are positive, add bonus points
	const allPositive = revenueGrowth > 0 && earningsGrowth > 0 && epsGrowth > 0
	const consistencyBonus = allPositive ? 18 : 0

	// Weighted average
	const weightedScore = revenueScore * 0.3 + earningsScore * 0.3 + epsScore * 0.25

	// Add consistency bonus and normalize
	const finalScore = weightedScore * 0.82 + consistencyBonus

	return Math.max(0, Math.min(100, finalScore))
}

/**
 * Calculate Value Score (0-100)
 * Lower multiples = higher score (inverted)
 * Weights: 30% P/E + 25% P/B + 20% P/S + 15% EV/EBITDA + 10% dividend yield
 */
export function calculateValueScore({
	pe,
	pb,
	ps,
	evEbitda,
	dividendYield
}: ValueMetrics): number {
	// Handle negative/invalid P/E (unprofitable companies)
	// Give them a low score but not zero (they might have other redeeming qualities)
	const peScore = pe > 0 ? normalize(1 / pe, 1 / 30, 1 / 10) : 10

	// Normalize other multiples (inverted) - calibrated for market-average fair value around 50
	const pbScore = normalize(1 / pb, 1 / 8, 1 / 1.2)
	const psScore = normalize(1 / ps, 1 / 6, 1 / 0.8)
	const evEbitdaScore = normalize(1 / evEbitda, 1 / 20, 1 / 7)

	// Dividend yield (higher is better, no inversion)
	const dividendScore = normalize(dividendYield, 0, 0.06) // 0-6% yield range

	// Weighted average
	const weightedScore =
		peScore * 0.3 + pbScore * 0.25 + psScore * 0.2 + evEbitdaScore * 0.15 + dividendScore * 0.1

	return Math.max(0, Math.min(100, weightedScore))
}

/**
 * Calculate Quality Score (0-100)
 * Measures financial health and profitability
 * Weights: 25% ROE + 25% ROA + 20% net margin + 15% debt (inverted) + 15% liquidity
 */
export function calculateQualityScore({
	roe,
	roa,
	netMargin,
	debtToEquity,
	currentRatio
}: QualityMetrics): number {
	// Normalize profitability metrics (allow negative values) - tighter ranges
	const roeScore = normalize(roe, -0.1, 0.35) // -10% to 35% range
	const roaScore = normalize(roa, -0.05, 0.25) // -5% to 25% range
	const marginScore = normalize(netMargin, -0.05, 0.3) // -5% to 30% range

	// Debt-to-equity (lower is better, inverted) - tighter range
	const debtScore = normalize(1 / (debtToEquity + 1), 1 / 6, 1 / 1.1) // 0-5 D/E range

	// Current ratio (optimal range is 1.5-3.0)
	let liquidityScore: number
	if (currentRatio < 1.0) {
		liquidityScore = normalize(currentRatio, 0, 1.0) * 0.5 // Poor liquidity
	} else if (currentRatio > 3.0) {
		liquidityScore = 85 // Good but possibly inefficient use of assets
	} else {
		liquidityScore = normalize(currentRatio, 1.0, 3.0) * 0.5 + 50 // Optimal range
	}

	// Weighted average
	const weightedScore =
		roeScore * 0.25 + roaScore * 0.25 + marginScore * 0.2 + debtScore * 0.15 + liquidityScore * 0.15

	return Math.max(0, Math.min(100, weightedScore))
}

/**
 * Calculate Momentum Score (0-100)
 * Measures price performance trends
 * Weights: 40% 1-month + 30% 3-month + 20% 6-month + 10% consistency
 */
export function calculateMomentumScore({
	priceChange1M,
	priceChange3M,
	priceChange6M
}: MomentumMetrics): number {
	// Normalize each time period - range that rewards exceptional momentum
	// Strong momentum: 15-50% gains; Typical: -30% to +40%
	const score1M = normalize(priceChange1M, -0.3, 0.4)
	const score3M = normalize(priceChange3M, -0.3, 0.4)
	const score6M = normalize(priceChange6M, -0.3, 0.4)

	// Consistency bonus: If all periods are positive, add bonus
	const allPositive = priceChange1M > 0 && priceChange3M > 0 && priceChange6M > 0
	const consistencyBonus = allPositive ? 18 : 0

	// Weighted average (recent performance weighted more heavily)
	const weightedScore = score1M * 0.4 + score3M * 0.3 + score6M * 0.2

	// Add consistency bonus
	const finalScore = weightedScore * 0.82 + consistencyBonus

	return Math.max(0, Math.min(100, finalScore))
}

/**
 * Calculate all four factor scores at once
 */
export function calculateAllFactorScores(stock: StockMetrics): FactorScores {
	return {
		growthScore: calculateGrowthScore({
			revenueGrowth: stock.revenueGrowth,
			earningsGrowth: stock.earningsGrowth,
			epsGrowth: stock.epsGrowth
		}),
		valueScore: calculateValueScore({
			pe: stock.pe,
			pb: stock.pb,
			ps: stock.ps,
			evEbitda: stock.evEbitda,
			dividendYield: stock.dividendYield
		}),
		qualityScore: calculateQualityScore({
			roe: stock.roe,
			roa: stock.roa,
			netMargin: stock.netMargin,
			debtToEquity: stock.debtToEquity,
			currentRatio: stock.currentRatio
		}),
		momentumScore: calculateMomentumScore({
			priceChange1M: stock.priceChange1M || 0,
			priceChange3M: stock.priceChange3M || 0,
			priceChange6M: stock.priceChange6M || 0
		})
	}
}
