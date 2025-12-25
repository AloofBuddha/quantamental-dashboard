import { useEffect, useRef, useState } from 'react'
import type { AgChartInstance, AgFinancialChartOptions } from 'ag-charts-enterprise'
import { AgFinancialCharts } from 'ag-charts-react'
import { useIsDarkMode } from '@/stores/DarkModeStore'
import type { SymbolId } from '@/config/candlestickConfig'
import { cn } from '@/utils/cn'
import LoadingSpinner from './LoadingSpinner'
import 'ag-charts-enterprise'

interface CandleStickProps {
	priceData: number[][]
	symbolId: SymbolId
	title: string
}

export default function CandleStick({ priceData, symbolId, title }: CandleStickProps) {
	const chartRef = useRef<AgChartInstance>(null)
	const isDarkMode = useIsDarkMode()
	const [isLoading, setIsLoading] = useState(true)
	const [chartData] = useState(() =>
		priceData.map((item) => ({
			date: new Date(item[0]),
			open: item[1],
			high: item[2],
			low: item[3],
			close: item[4],
			volume: Math.random() * 1000 + 100
		}))
	)

	// Show loading spinner briefly to smooth out chart initialization
	useEffect(() => {
		setIsLoading(true)
		const timer = setTimeout(() => {
			setIsLoading(false)
		}, 500)

		return () => clearTimeout(timer)
	}, [symbolId])

	const containerRef = useRef<HTMLDivElement>(null)
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

	// Measure container dimensions for responsive chart sizing
	useEffect(() => {
		const measureContainer = () => {
			if (containerRef.current) {
				const { width, height } = containerRef.current.getBoundingClientRect()
				setDimensions({ width, height })
			}
		}

		measureContainer()
		window.addEventListener('resize', measureContainer)
		return () => window.removeEventListener('resize', measureContainer)
	}, [])

	const [options, setOptions] = useState<AgFinancialChartOptions>({
		data: chartData,
		title: { text: title },
		chartType: 'candlestick',
		navigator: true,
		toolbar: true,
		rangeButtons: true,
		volume: true,
		statusBar: true,
		zoom: true,
		theme: isDarkMode ? 'ag-financial-dark' : 'ag-financial'
	})

	// Update chart dimensions on container resize
	useEffect(() => {
		if (dimensions.width > 0 && dimensions.height > 0) {
			setOptions((prev) => ({
				...prev,
				width: dimensions.width,
				height: dimensions.height
			}))
		}
	}, [dimensions])

	// Update theme when dark mode changes
	useEffect(() => {
		setOptions((prev) => ({
			...prev,
			theme: isDarkMode ? 'ag-financial-dark' : 'ag-financial'
		}))
	}, [isDarkMode])

	return (
		<div ref={containerRef} className="h-full w-full relative">
			{isLoading && <LoadingSpinner message={`Loading ${symbolId}...`} />}
			<div className={cn('h-full w-full transition-opacity duration-300', isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100')}>
				{dimensions.width > 0 && dimensions.height > 0 && <AgFinancialCharts options={options} ref={chartRef} />}
			</div>
		</div>
	)
}
