/**
 * StockGrid - Displays stock data in AG Grid
 *
 * Wraps the generic DataGrid component with stock-specific:
 * - Column definitions by view type
 * - Connection to StockDataStore
 * - WebSocket connection management
 */

import { useEffect } from 'react'
import DataGrid from '@/components/DataGrid'
import { useStockDataStore } from '@/stores/StockDataStore'
import { useWebSocketStore, useConnectionStatus } from '@/stores/WebSocketStore'
import { getColumnDefsForView } from '@/data/stockColumnDefs'

export type StockViewType = 'screener' | 'ticker' | 'fundamentals' | 'portfolio'

interface StockGridProps {
	view: StockViewType
	title?: string
}

export default function StockGrid({ view, title }: StockGridProps) {
	const stocksMap = useStockDataStore((state) => state.stocks)
	const stocks = Array.from(stocksMap.values())
	const connectionStatus = useConnectionStatus()

	// Connect to WebSocket on mount
	useEffect(() => {
		useWebSocketStore.getState().connect()
	}, [])

	// Get column definitions for this view
	const columnDefs = getColumnDefsForView(view)

	// Show loading state while connecting
	if (connectionStatus === 'connecting' && stocks.length === 0) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4" />
					<p className="text-slate-500 dark:text-slate-400">Connecting to server...</p>
				</div>
			</div>
		)
	}

	// Show error state
	if (connectionStatus === 'error' && stocks.length === 0) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-center">
					<p className="text-red-500 mb-2">Failed to connect to server</p>
					<p className="text-slate-500 dark:text-slate-400 text-sm">Make sure the WebSocket server is running on localhost:8080</p>
					<button
						onClick={() => useWebSocketStore.getState().connect()}
						className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
					>
						Retry Connection
					</button>
				</div>
			</div>
		)
	}

	return <DataGrid data={stocks} columnDefs={columnDefs} tableId={`stock-${view}`} rowIdField="symbol" title={title} />
}
