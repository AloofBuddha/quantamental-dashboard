/**
 * Ticker Route - Real-time price focused view
 *
 * Simplified view focused on price movements
 */

import { createFileRoute } from '@tanstack/react-router'
import StockGrid from '@/components/stock/StockGrid'

export const Route = createFileRoute('/ticker')({
	component: TickerPage
})

function TickerPage() {
	return (
		<div className="h-[calc(100vh-12rem)]">
			<StockGrid view="ticker" />
		</div>
	)
}
