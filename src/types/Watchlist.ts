/**
 * Watchlist system for portfolio management
 * Users create watchlists to organize and track groups of stocks
 */

/**
 * Watchlist definition
 */
export interface Watchlist {
	id: string // UUID
	name: string // User-friendly name (e.g., "Tech Growth Stocks")
	symbols: string[] // Array of stock symbols in this watchlist
	createdAt: number // Timestamp when created
	updatedAt: number // Timestamp of last modification
	description?: string // Optional description
}

/**
 * Helper type for creating new watchlists (ID and timestamps auto-generated)
 */
export type NewWatchlist = Omit<Watchlist, 'id' | 'createdAt' | 'updatedAt'>

/**
 * Helper type for watchlist updates (all fields optional except ID)
 */
export type WatchlistUpdate = Partial<Omit<Watchlist, 'id' | 'createdAt'>> & {
	id: string
}
