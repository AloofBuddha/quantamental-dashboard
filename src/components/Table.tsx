import { useEffect, useRef, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { colorSchemeDarkBlue, GridOptions, themeQuartz } from 'ag-grid-community'
import tradesData from '../data/homePage/trades.json'
import { useIsDarkMode } from '@/stores/DarkModeStore'
import { TRADES_COLUMN_DEFS } from '@/data/columnDefs'

interface Trade {
	id: string
	status: string
	accountId: string
	positionId: string
	price: number
	quantity: number
	side: string
	ticker: string
	orderTime: string
	lastUpdate: string
	currency: string
}

const ROW_ID = 'id'

const defaultColDef = {
	minWidth: 150,
	flex: 1,
	filter: 'agTextColumnFilter',
	resizable: true,
	sortable: true
}

export default function Table() {
	const gridRef = useRef<AgGridReact>(null)
	const [trades] = useState<Trade[]>(tradesData as Trade[])
	const isDarkMode = useIsDarkMode()
	const theme = isDarkMode ? themeQuartz.withPart(colorSchemeDarkBlue) : themeQuartz

	const gridOptions: GridOptions = {
		theme: theme,
		columnDefs: TRADES_COLUMN_DEFS,
		defaultColDef: defaultColDef,
		rowModelType: 'clientSide',
		rowData: trades,
		pagination: true,
		paginationPageSize: 50,
		getRowId: (params: { data: Trade }) => params.data[ROW_ID],
		loadThemeGoogleFonts: true
	}

	useEffect(() => {
		if (gridRef.current?.api) {
			gridRef.current.api.setGridOption('rowData', trades)
		}
	}, [trades])

	return (
		<div className="w-[700px] h-[450px]">
			<h1 className="">Trades Table 📅</h1>
			<AgGridReact ref={gridRef} {...gridOptions} />
		</div>
	)
}
