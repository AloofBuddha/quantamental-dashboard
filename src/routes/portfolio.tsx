/**
 * Portfolio Route - Watchlist and portfolio tracking view
 *
 * Key metrics for monitoring investments
 * (Watchlist filtering will be added in Phase 5)
 */

import { createFileRoute } from '@tanstack/react-router'
import StockGrid from '@/components/stock/StockGrid'

export const Route = createFileRoute('/portfolio')({
	component: PortfolioPage
})

function PortfolioPage() {
	return (
		<div className="h-[calc(100vh-12rem)]">
			<StockGrid view="portfolio" />
		</div>
	)
}
