import { useEffect, useRef, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ColDef, colorSchemeDarkBlue, GridOptions, themeQuartz } from 'ag-grid-community'
import tradesData from '../data/homePage/trades.json'
import { useIsDarkMode } from '@/stores/DarkModeStore'

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
const COLUMN_DEFS: ColDef[] = [
	{ field: 'id', headerName: 'Trade ID', minWidth: 120 },
	{ field: 'status', headerName: 'Status', minWidth: 100 },
	{ field: 'accountId', headerName: 'Account ID', minWidth: 120 },
	{ field: 'positionId', headerName: 'Position ID', minWidth: 120 },
	{ field: 'price', headerName: 'Price', type: 'numericColumn', valueFormatter: (params) => `$${params.value?.toFixed(2)}` },
	{ field: 'quantity', headerName: 'Quantity', type: 'numericColumn' },
	{ field: 'side', headerName: 'Side', minWidth: 80 },
	{ field: 'ticker', headerName: 'Ticker', minWidth: 80 },
	{ field: 'orderTime', headerName: 'Order Time', minWidth: 160, valueFormatter: (params) => new Date(params.value).toLocaleString() },
	{ field: 'lastUpdate', headerName: 'Last Update', minWidth: 160, valueFormatter: (params) => new Date(params.value).toLocaleString() },
	{ field: 'currency', headerName: 'Currency', minWidth: 80 }
]

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
		columnDefs: COLUMN_DEFS,
		defaultColDef: defaultColDef,
		rowModelType: 'clientSide',
		rowData: trades,
		pagination: true,
		paginationPageSize: 50,
		getRowId: (params: any) => params.data[ROW_ID]
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
