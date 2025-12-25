import { useEffect, useState, useMemo, useCallback } from 'react'
import type { ColDef, RowStyle, RowClassParams, IHeaderParams } from 'ag-grid-community'
import { useIsDarkMode } from '@/stores/DarkModeStore'
import { ROW_STRIPE_COLORS } from '@/constants/colorSchemes'
import DataGrid from './DataGrid'
import { colorToggleStyles } from '@/styles/commonStyles'

/**
 * Color mode configuration for table rows
 */
export type ColorModeConfig = {
	modes: {
		id: string
		label: string
		field: string
		colors: {
			light: Record<string, string>
			dark: Record<string, string>
		}
		/**
		 * Optional function to map field values to color keys
		 * Useful for numeric fields that need categorization (e.g., P&L: positive/negative/zero)
		 */
		valueMapper?: (value: unknown) => string
	}[]
}

export interface ConfigurableTableProps {
	data: unknown[]
	columnDefs: ColDef[]
	tableId: string
	colorModeConfig?: ColorModeConfig
	title?: string
	onTitleClick?: () => void
	isExpanded?: boolean
}

export default function ConfigurableTable({
	data,
	columnDefs,
	tableId,
	colorModeConfig,
	title,
	onTitleClick,
	isExpanded = false
}: ConfigurableTableProps) {
	const isDarkMode = useIsDarkMode()

	const [colorMode, setColorMode] = useState<string>(() => {
		if (!colorModeConfig) return 'none'
		const saved = localStorage.getItem(`${tableId}-colorMode`)
		return saved || 'none'
	})

	useEffect(() => {
		if (colorModeConfig) {
			localStorage.setItem(`${tableId}-colorMode`, colorMode)
		}
	}, [colorMode, tableId, colorModeConfig])

	const StandardHeaderComponent = useCallback(({ column, displayName, progressSort, showFilter }: IHeaderParams) => {
		const sortState = column.getSort()
		const sortIcon = sortState === 'asc' ? 'ag-icon-asc' : sortState === 'desc' ? 'ag-icon-desc' : ''

		return (
			<div className="flex items-center justify-between w-full">
				<div className="flex-1 flex items-center justify-center gap-1 cursor-pointer" onClick={() => progressSort(false)}>
					<span>{displayName}</span>
					{sortIcon && <span className={`ag-icon ${sortIcon}`}></span>}
				</div>
				<span className="ag-icon ag-icon-filter cursor-pointer" onClick={(e) => showFilter(e.target as HTMLElement)}></span>
			</div>
		)
	}, [])

	const createColorToggleHeader = useCallback(
		(modeConfig: ColorModeConfig['modes'][0]) => {
			return ({ column, displayName, progressSort, showFilter }: IHeaderParams) => {
				const isActive = colorMode === modeConfig.id
				const sortState = column.getSort()
				const sortIcon = sortState === 'asc' ? 'ag-icon-asc' : sortState === 'desc' ? 'ag-icon-desc' : ''

				return (
					<div className="flex items-center justify-between w-full">
						<div className="flex-1 flex items-center justify-center gap-1 cursor-pointer" onClick={() => progressSort(false)}>
							<span>{displayName}</span>
							{sortIcon && <span className={`ag-icon ${sortIcon}`}></span>}
						</div>
						<div className="flex items-center gap-1">
							<span className="ag-icon ag-icon-filter cursor-pointer" onClick={(e) => showFilter(e.target as HTMLElement)}></span>
							<button
								onClick={(e) => {
									e.stopPropagation()
									setColorMode(isActive ? 'none' : modeConfig.id)
								}}
								className={colorToggleStyles.button}
								title={`Toggle color coding by ${modeConfig.label}`}
							>
								<span className={colorToggleStyles.indicator(isActive)}></span>
							</button>
						</div>
					</div>
				)
			}
		},
		[colorMode]
	)

	const processedColumnDefs = useMemo(() => {
		return columnDefs.map((col) => {
			const processed = { ...col }
			if (colorModeConfig) {
				const modeForField = colorModeConfig.modes.find((mode) => mode.field === col.field)
				if (modeForField) {
					processed.headerComponent = createColorToggleHeader(modeForField)
				} else if (col.type === 'numericColumn') {
					processed.headerComponent = StandardHeaderComponent
				}
			} else if (col.type === 'numericColumn') {
				processed.headerComponent = StandardHeaderComponent
			}

			return processed
		})
	}, [columnDefs, colorModeConfig, createColorToggleHeader, StandardHeaderComponent])

	const getRowStyle = useCallback(
		(params: RowClassParams): RowStyle | undefined => {
			if (!params.data || params.node.rowIndex === null || params.node.rowIndex === undefined) {
				return undefined
			}

			const isEvenRow = params.node.rowIndex % 2 === 0
			const themeMode = isDarkMode ? 'dark' : 'light'
			let backgroundColor = ''

			if (colorMode !== 'none' && colorModeConfig) {
				const activeMode = colorModeConfig.modes.find((mode) => mode.id === colorMode)
				if (activeMode && activeMode.field in params.data) {
					const fieldValue = (params.data as Record<string, unknown>)[activeMode.field]
					const colorKey = activeMode.valueMapper 
						? activeMode.valueMapper(fieldValue) 
						: String(fieldValue).toUpperCase()
					
					backgroundColor = activeMode.colors[themeMode][colorKey] || ''
				}
			}

			if (!backgroundColor) {
				backgroundColor = isEvenRow ? ROW_STRIPE_COLORS[themeMode].even : ROW_STRIPE_COLORS[themeMode].odd
			}

			return backgroundColor ? { backgroundColor } : undefined
		},
		[colorMode, colorModeConfig, isDarkMode]
	)

	return (
		<DataGrid
			data={data}
			columnDefs={processedColumnDefs}
			tableId={tableId}
			getRowStyle={getRowStyle}
			pagination={false}
			title={title}
			onTitleClick={onTitleClick}
			isExpanded={isExpanded}
		/>
	)
}

