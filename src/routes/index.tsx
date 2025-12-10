import CandleStick from '@/components/CandleStick'
import Table from '@/components/Table'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
	component: RouteComponent
})

function RouteComponent() {
	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-6">Financial Data Dashboard</h1>
			<div className="space-y-4">
				<Table />
			</div>
			Candle Stick Charts
			<CandleStick height={500} title={'AAPL'} />
		</div>
	)
}
