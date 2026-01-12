/**
 * PriceChangeRenderer - Custom AG Grid cell renderer for price changes
 *
 * Features:
 * - Color coding: Green for positive, red for negative
 * - Flash animation on value change
 * - Percentage formatting
 */

import { useEffect, useState, useRef } from 'react'
import type { CustomCellRendererProps } from 'ag-grid-react'

export function PriceChangeRenderer(props: CustomCellRendererProps) {
	const { value } = props
	const [flash, setFlash] = useState<'up' | 'down' | null>(null)
	const previousValue = useRef<number>(value)

	useEffect(() => {
		// Detect value change and trigger flash
		if (previousValue.current !== value && previousValue.current !== undefined) {
			const direction = value > previousValue.current ? 'up' : 'down'
			setFlash(direction)

			// Remove flash after animation
			const timer = setTimeout(() => setFlash(null), 500)

			previousValue.current = value

			return () => clearTimeout(timer)
		}
		previousValue.current = value
	}, [value])

	if (value === null || value === undefined) {
		return <span className="text-slate-400">-</span>
	}

	const isPositive = value > 0
	const isNegative = value < 0

	const baseClasses = 'font-mono transition-all duration-300'
	const colorClasses = isPositive ? 'text-green-600 dark:text-green-400' : isNegative ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'

	const flashClasses = flash === 'up' ? 'bg-green-200 dark:bg-green-900/50' : flash === 'down' ? 'bg-red-200 dark:bg-red-900/50' : ''

	const formattedValue = isPositive ? `+${value.toFixed(2)}%` : `${value.toFixed(2)}%`

	return (
		<span className={`${baseClasses} ${colorClasses} ${flashClasses} px-1 rounded`}>
			{formattedValue}
		</span>
	)
}

/**
 * PriceRenderer - Custom AG Grid cell renderer for prices
 *
 * Features:
 * - Dollar formatting
 * - Flash animation on value change
 * - Color coding based on change direction
 */
export function PriceRenderer(props: CustomCellRendererProps) {
	const { value } = props
	const [flash, setFlash] = useState<'up' | 'down' | null>(null)
	const previousValue = useRef<number>(value)

	useEffect(() => {
		// Detect value change and trigger flash
		if (previousValue.current !== value && previousValue.current !== undefined) {
			const direction = value > previousValue.current ? 'up' : 'down'
			setFlash(direction)

			// Remove flash after animation
			const timer = setTimeout(() => setFlash(null), 500)

			previousValue.current = value

			return () => clearTimeout(timer)
		}
		previousValue.current = value
	}, [value])

	if (value === null || value === undefined) {
		return <span className="text-slate-400">-</span>
	}

	const baseClasses = 'font-mono transition-all duration-300'
	const flashClasses = flash === 'up' ? 'bg-green-200 dark:bg-green-900/50' : flash === 'down' ? 'bg-red-200 dark:bg-red-900/50' : ''

	const formattedValue = `$${value.toFixed(2)}`

	return (
		<span className={`${baseClasses} ${flashClasses} px-1 rounded`}>
			{formattedValue}
		</span>
	)
}
