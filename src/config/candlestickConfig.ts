/**
 * Candlestick chart configuration
 * Defines available symbols and their metadata
 */

export type SymbolId = 'AAPL' | 'MSFT' | 'TSLA'

export interface SymbolInfo {
	id: SymbolId
	name: string
	label: string
}

export const AVAILABLE_SYMBOLS: SymbolInfo[] = [
	{ id: 'AAPL', name: 'Apple Inc.', label: 'AAPL - Apple Inc.' },
	{ id: 'MSFT', name: 'Microsoft Corporation', label: 'MSFT - Microsoft Corporation' },
	{ id: 'TSLA', name: 'Tesla, Inc.', label: 'TSLA - Tesla, Inc.' }
]

export const DEFAULT_SYMBOL: SymbolId = 'AAPL'

