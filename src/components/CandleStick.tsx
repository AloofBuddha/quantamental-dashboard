import { useRef, useState } from 'react'
import { AgChartInstance, AgFinancialChartOptions, AgPriceVolumeChartType } from 'ag-charts-enterprise'
import { AgFinancialCharts } from 'ag-charts-react'
import DemoData from '../data/candleStick/aapl.json'
import 'ag-charts-enterprise'

export default function CandleStick({ height = 500, title = 'AAPL' }: { height: number; title: string }) {
	const chartRef = useRef<AgChartInstance>(null)

	const getData = (data: number[][]) => {
		return data.map((data) => ({ date: new Date(data[0]), open: data[1], high: data[2], low: data[3], close: data[4], volume: Math.random() * 1000 + 100 }))
	}

	const [options] = useState<AgFinancialChartOptions>({
		data: getData(DemoData),
		title: { text: title },
		chartType: 'candlestick' as AgPriceVolumeChartType,
		navigator: true, // disabled by default!
		toolbar: true,
		rangeButtons: true,
		volume: true,
		statusBar: true,
		zoom: true,
		height: height,
		theme: 'ag-financial-dark' // dark mode: 'ag-financial-dark' | light mode: 'ag-financial'
	})

	return (
		<div>
			<AgFinancialCharts options={options} ref={chartRef} />
		</div>
	)
}
