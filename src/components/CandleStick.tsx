import { useEffect, useRef, useState, useCallback } from 'react'
import { AgChartInstance, AgFinancialChartOptions, AgPriceVolumeChartType } from 'ag-charts-enterprise'
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

interface ChartState {
	chartType?: AgPriceVolumeChartType
	dateRange?: {
		start: number // timestamp
		end: number // timestamp
	}
	selectedRangeButton?: string // '1M', '3M', '6M', '1Y', etc.
}

export default function CandleStick({ priceData, symbolId, title }: CandleStickProps) {
	const chartRef = useRef<AgChartInstance>(null)
	const isDarkMode = useIsDarkMode()
	const storageKey = `candlestick-chart-state-${symbolId}`
	const [isLoading, setIsLoading] = useState(true)
	const [chartData] = useState(() => {
		return priceData.map((item) => ({
			date: new Date(item[0]),
			open: item[1],
			high: item[2],
			low: item[3],
			close: item[4],
			volume: Math.random() * 1000 + 100
		}))
	})

	useEffect(() => {
		setIsLoading(true)
		const timer = setTimeout(() => {
			setIsLoading(false)
		}, 500)

		return () => clearTimeout(timer)
	}, [symbolId])

	// Load saved chart state from localStorage
	const loadChartState = useCallback((): ChartState | null => {
		const saved = localStorage.getItem(storageKey)
		if (!saved) return null
		try {
			return JSON.parse(saved)
		} catch (e) {
			console.error('Failed to parse saved chart state:', e)
			return null
		}
	}, [storageKey])

	// Save chart state to localStorage
	const saveChartState = useCallback((state: ChartState) => {
		try {
			localStorage.setItem(storageKey, JSON.stringify(state))
		} catch (e) {
			console.error('Failed to save chart state:', e)
		}
	}, [storageKey])

	const savedState = loadChartState()

	const getInitialDateRange = useCallback(() => {
		if (savedState?.dateRange) {
			return {
				start: new Date(savedState.dateRange.start),
				end: new Date(savedState.dateRange.end)
			}
		}
		return undefined
	}, [savedState])
	const containerRef = useRef<HTMLDivElement>(null)
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

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
		chartType: (savedState?.chartType as AgPriceVolumeChartType) || 'candlestick',
		navigator: true,
		toolbar: true,
		rangeButtons: true,
		volume: true,
		statusBar: true,
		zoom: true,
		theme: isDarkMode ? 'ag-financial-dark' : 'ag-financial',
		...(getInitialDateRange() && { initialDateRange: getInitialDateRange() })
	})

	useEffect(() => {
		if (dimensions.width > 0 && dimensions.height > 0) {
			setOptions((prev) => ({
				...prev,
				width: dimensions.width,
				height: dimensions.height
			}))
		}
	}, [dimensions])

	useEffect(() => {
		setOptions((prev) => ({
			...prev,
			theme: isDarkMode ? 'ag-financial-dark' : 'ag-financial'
		}))
	}, [isDarkMode])

	useEffect(() => {
		const chart = chartRef.current
		if (!chart) return

		let saveTimeout: NodeJS.Timeout

		const handleChartInteraction = () => {
			clearTimeout(saveTimeout)
			saveTimeout = setTimeout(() => {
				if (!chartRef.current) return

				try {
					const currentOptions = chartRef.current.getOptions() as AgFinancialChartOptions
					const xAxis = (currentOptions as any).axes?.find((axis: any) => axis.type === 'time')
					const state: ChartState = {
						chartType: currentOptions.chartType
					}

					if (xAxis?.min && xAxis?.max) {
						state.dateRange = {
							start: new Date(xAxis.min).getTime(),
							end: new Date(xAxis.max).getTime()
						}
					}

					saveChartState(state)
				} catch (error) {
					console.error('Error saving chart state:', error)
				}
			}, 500)
		}

		return () => {
			clearTimeout(saveTimeout)
			handleChartInteraction()
		}
	}, [storageKey, saveChartState])

	return (
		<div ref={containerRef} className="h-full w-full relative">
			{isLoading && <LoadingSpinner message={`Loading ${symbolId}...`} />}
			<div className={cn(
				'h-full w-full transition-opacity duration-300',
				isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'
			)}>
				{dimensions.width > 0 && dimensions.height > 0 && (
					<AgFinancialCharts options={options} ref={chartRef} />
				)}
			</div>
		</div>
	)
}
