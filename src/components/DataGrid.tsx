import { useEffect, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { colorSchemeDarkBlue, themeQuartz } from 'ag-grid-community'
import type { ColDef, GridOptions, RowStyle, RowClassParams } from 'ag-grid-community'
import { useIsDarkMode } from '@/stores/DarkModeStore'
import { cn } from '@/utils/cn'
import { tableStyles } from '@/styles/commonStyles'
import 'ag-grid-enterprise'
import '@/styles/TradesTable.css'

interface DataGridProps {
	data: unknown[]
	columnDefs: ColDef[]
	tableId: string
	getRowStyle?: (params: RowClassParams) => RowStyle | undefined
	rowIdField?: string
	pagination?: boolean
	height?: string
	title?: string
	onTitleClick?: () => void
	isExpanded?: boolean
}

const defaultColDef = {
	flex: 1,
	filter: 'agTextColumnFilter',
	resizable: true,
	sortable: true,
	suppressHeaderMenuButton: true,
	cellClass: 'ag-right-aligned-cell',
	headerClass: 'ag-header-cell-center'
}

export default function DataGrid({
	data,
	columnDefs,
	tableId,
	getRowStyle,
	rowIdField = 'id',
	pagination = false,
	height,
	title,
	onTitleClick,
	isExpanded = false
}: DataGridProps) {
	const gridRef = useRef<AgGridReact>(null)
	const isDarkMode = useIsDarkMode()
	const theme = isDarkMode ? themeQuartz.withPart(colorSchemeDarkBlue) : themeQuartz

	// Helper function to check if tool panel is currently open
	const isToolPanelOpen = () => {
		const isOpen = gridRef.current?.api?.getOpenedToolPanel() !== null && gridRef.current?.api?.getOpenedToolPanel() !== undefined
		return isOpen
	}

	const gridOptions: GridOptions = {
		theme: theme,
		columnDefs: columnDefs,
		defaultColDef: defaultColDef,
		rowModelType: 'clientSide',
		rowData: data,
		pagination: pagination,
		paginationPageSize: 50,
		getRowId: (params) => params.data[rowIdField],
		loadThemeGoogleFonts: true,
		getRowStyle: getRowStyle,
		domLayout: 'normal',
		tooltipShowDelay: 500,
		// Performance optimizations for real-time updates
		asyncTransactionWaitMillis: 50, // Batch transactions for better performance
		suppressAnimationFrame: false, // Enable animation frame for smooth updates
		enableCellChangeFlash: true, // Flash cells on value change
		sideBar: {
			toolPanels: [
				{
					id: 'columns',
					labelDefault: 'Columns',
					labelKey: 'columns',
					iconKey: 'columns',
					toolPanel: 'agColumnsToolPanel',
					toolPanelParams: {
						suppressRowGroups: true,
						suppressValues: true,
						suppressPivots: true,
						suppressPivotMode: true,
						suppressColumnFilter: false,
						suppressColumnSelectAll: false,
						suppressColumnExpandAll: false
					}
				}
			],
			defaultToolPanel: ''
		},
		onColumnVisible: () => {
			const panelOpen = isToolPanelOpen()
			console.log(`[${tableId}] onColumnVisible triggered, toolPanelOpen:`, panelOpen)

			// Don't resize when tool panel is open - it can cause the panel to close
			if (panelOpen) {
				console.log(`[${tableId}] Skipping sizeColumnsToFit - tool panel is open`)
				return
			}

			setTimeout(() => {
				if (gridRef.current?.api) {
					console.log(`[${tableId}] sizeColumnsToFit from onColumnVisible`)
					gridRef.current.api.sizeColumnsToFit()
					const columnState = gridRef.current.api.getColumnState()
					localStorage.setItem(`${tableId}-columnState`, JSON.stringify(columnState))
				}
			}, 0)
		},
		onToolPanelVisibleChanged: (params) => {
			const isOpen = params.api.getOpenedToolPanel() !== null
			console.log(`[${tableId}] onToolPanelVisibleChanged - isOpen:`, isOpen, 'panel:', params.api.getOpenedToolPanel())

			// Only resize columns when closing the panel, not when opening
			// Opening can cause re-layout that closes the panel immediately
			if (!isOpen) {
				setTimeout(() => {
					if (gridRef.current?.api) {
						console.log(`[${tableId}] sizeColumnsToFit from onToolPanelVisibleChanged (closing)`)
						gridRef.current.api.sizeColumnsToFit()
					}
				}, 0)
			}
		},
		onGridReady: () => {
			console.log(`[${tableId}] onGridReady called`)
			if (gridRef.current?.api) {
				const savedColumnState = localStorage.getItem(`${tableId}-columnState`)
				const savedFilterModel = localStorage.getItem(`${tableId}-filterModel`)
				const savedSortModel = localStorage.getItem(`${tableId}-sortModel`)

				if (savedColumnState) {
					try {
						gridRef.current.api.applyColumnState({
							state: JSON.parse(savedColumnState),
							applyOrder: true
						})
					} catch (e) {
						console.error('Failed to restore column state:', e)
					}
				}

				if (savedFilterModel) {
					try {
						gridRef.current.api.setFilterModel(JSON.parse(savedFilterModel))
					} catch (e) {
						console.error('Failed to restore filter model:', e)
					}
				}

				if (savedSortModel) {
					try {
						gridRef.current.api.applyColumnState({
							state: JSON.parse(savedSortModel),
							defaultState: { sort: null }
						})
					} catch (e) {
						console.error('Failed to restore sort model:', e)
					}
				}

				gridRef.current.api.sizeColumnsToFit()
			}
		},
		onSortChanged: () => {
			if (gridRef.current?.api) {
				gridRef.current.api.refreshHeader()
				const sortModel = gridRef.current.api.getColumnState()?.filter((col) => col.sort != null)
				localStorage.setItem(`${tableId}-sortModel`, JSON.stringify(sortModel))
			}
		},
		onFilterChanged: () => {
			if (gridRef.current?.api) {
				const filterModel = gridRef.current.api.getFilterModel()
				localStorage.setItem(`${tableId}-filterModel`, JSON.stringify(filterModel))
			}
		},
		onColumnMoved: () => {
			if (gridRef.current?.api) {
				const columnState = gridRef.current.api.getColumnState()
				localStorage.setItem(`${tableId}-columnState`, JSON.stringify(columnState))
			}
		}
	}

	useEffect(() => {
		const panelOpen = isToolPanelOpen()
		console.log(`[${tableId}] Data changed, length:`, data.length, 'toolPanelOpen:', panelOpen)
		if (gridRef.current?.api && !panelOpen) {
			// Use async transactions for better performance with large datasets
			// This batches updates and only re-renders changed rows
			// Skip updates when tool panel is open to prevent interference
			gridRef.current.api.applyTransactionAsync({ update: data as any })
		}
	}, [data, tableId])

	useEffect(() => {
		const panelOpen = isToolPanelOpen()
		console.log(`[${tableId}] Dark mode changed:`, isDarkMode, 'toolPanelOpen:', panelOpen)
		if (gridRef.current?.api && !panelOpen) {
			gridRef.current.api.redrawRows()
		}
	}, [isDarkMode, tableId])

	useEffect(() => {
		const panelOpen = isToolPanelOpen()
		console.log(`[${tableId}] Row style function changed, toolPanelOpen:`, panelOpen)
		if (gridRef.current?.api && !panelOpen) {
			gridRef.current.api.redrawRows()
		}
	}, [getRowStyle, tableId])

	useEffect(() => {
		console.log(`[${tableId}] isExpanded changed:`, isExpanded)
		if (gridRef.current?.api) {
			setTimeout(() => {
				if (gridRef.current?.api) {
					console.log(`[${tableId}] sizeColumnsToFit from isExpanded effect`)
					gridRef.current.api.sizeColumnsToFit()
				}
			}, 0)
		}
	}, [isExpanded, tableId])

	useEffect(() => {
		const handleResize = () => {
			if (gridRef.current?.api) {
				gridRef.current.api.sizeColumnsToFit()
			}
		}

		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	return (
		<div className={cn('w-full h-full flex flex-col relative', isExpanded && tableStyles.expandedBorder)}>
			{title && (
				<div
					className={cn('flex items-center gap-2 mb-1 flex-shrink-0', tableStyles.titleContainer(!!onTitleClick))}
					onClick={onTitleClick}
					title={isExpanded ? 'Click to minimize' : 'Click to expand full screen'}
				>
					<h2 className={tableStyles.title}>{title}</h2>
					{onTitleClick && <span className={tableStyles.expandIcon}>{isExpanded ? '⊟' : '⊞'}</span>}
				</div>
			)}
			<div className={cn(height || 'flex-1 min-h-0')}>
				<AgGridReact ref={gridRef} maintainColumnOrder={true} {...gridOptions} />
			</div>
		</div>
	)
}
