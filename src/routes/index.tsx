/**
 * Home Route - Stock Screener
 *
 * Default view showing all stocks with factor scores
 */

import { createFileRoute } from '@tanstack/react-router'
import StockGrid from '@/components/stock/StockGrid'

export const Route = createFileRoute('/')({
	component: ScreenerPage
})

function ScreenerPage() {
	return (
		<div className="h-[calc(100vh-12rem)]">
			<StockGrid view="screener" />
		</div>
	)
}
