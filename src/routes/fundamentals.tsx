/**
 * Fundamentals Route - Detailed financial analysis view
 *
 * Shows valuation, profitability, and growth metrics
 */

import { createFileRoute } from '@tanstack/react-router'
import StockGrid from '@/components/stock/StockGrid'

export const Route = createFileRoute('/fundamentals')({
	component: FundamentalsPage
})

function FundamentalsPage() {
	return (
		<div className="h-[calc(100vh-12rem)]">
			<StockGrid view="fundamentals" />
		</div>
	)
}
