import { ColDef } from 'ag-grid-community'
import { creditRatingComparator } from '@/utils/creditRatingComparator'

export const TRADES_COLUMN_DEFS: ColDef[] = [
	{ field: 'id', headerName: 'Trade ID' },
	{
		field: 'status',
		headerName: 'Status',
		filter: 'agSetColumnFilter',
		filterParams: {
			values: ['PENDING', 'FILLED', 'CANCELLED'],
			defaultToNothingSelected: true
		}
	},
	{ field: 'accountId', headerName: 'Account ID' },
	{ field: 'positionId', headerName: 'Position ID' },
	{
		field: 'price',
		headerName: 'Price',
		type: 'numericColumn',
		filter: 'agNumberColumnFilter',
		valueFormatter: (params) => `$${params.value?.toFixed(2)}`,
		filterValueGetter: (params) => params.data?.price
	},
	{
		field: 'quantity',
		headerName: 'Qty',
		type: 'numericColumn',
		filter: 'agNumberColumnFilter'
	},
	{
		field: 'side',
		headerName: 'Side',
		filter: 'agSetColumnFilter',
		filterParams: {
			values: ['BUY', 'SELL'],
			defaultToNothingSelected: true
		}
	},
	{ field: 'ticker', headerName: 'Ticker' },
	{
		field: 'orderTime',
		headerName: 'Order Time',
		valueFormatter: (params) => new Date(params.value).toLocaleString(),
		tooltipValueGetter: (params) => {
			if (!params.value) return ''
			return new Date(params.value).toLocaleString('en-US', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
				second: 'numeric',
				timeZoneName: 'short'
			})
		}
	},
	{
		field: 'lastUpdate',
		headerName: 'Last Update',
		valueFormatter: (params) => new Date(params.value).toLocaleString(),
		tooltipValueGetter: (params) => {
			if (!params.value) return ''
			return new Date(params.value).toLocaleString('en-US', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
				second: 'numeric',
				timeZoneName: 'short'
			})
		}
	},
	{ field: 'currency', headerName: 'Currency' }
]

export const CREDIT_COLUMN_DEFS: ColDef[] = [
	{ field: 'id', headerName: 'ID', initialHide: true },
	{ field: 'counterpartyId', headerName: 'CP ID', initialHide: true },
	{ field: 'counterpartyName', headerName: 'Counterparty' },
	{
		field: 'creditRating',
		headerName: 'Rating',
		filter: 'agSetColumnFilter',
		filterParams: {
			values: ['AAA', 'AA+', 'AA', 'AA-', 'A+', 'A', 'A-', 'BBB+', 'BBB', 'BBB-', 'BB+', 'BB', 'BB-', 'B+', 'B', 'B-', 'CCC+', 'CCC', 'CCC-', 'CC', 'C', 'D'],
			defaultToNothingSelected: true
		},
		comparator: creditRatingComparator
	},
	{
		field: 'exposure',
		headerName: 'Exposure',
		type: 'numericColumn',
		filter: 'agNumberColumnFilter',
		valueFormatter: (params) => (params.value != null ? `$${params.value.toLocaleString()}` : '(unknown)'),
		filterValueGetter: (params) => params.data?.exposure
	},
	{
		field: 'collateral',
		headerName: 'Collateral',
		type: 'numericColumn',
		filter: 'agNumberColumnFilter',
		valueFormatter: (params) => (params.value != null ? `$${params.value.toLocaleString()}` : '(unknown)'),
		filterValueGetter: (params) => params.data?.collateral
	},
	{
		field: 'netExposure',
		headerName: 'Net Exp.',
		type: 'numericColumn',
		filter: 'agNumberColumnFilter',
		valueFormatter: (params) => (params.value != null ? `$${params.value.toLocaleString()}` : '(unknown)'),
		filterValueGetter: (params) => params.data?.netExposure
	},
	{
		field: 'riskLimit',
		headerName: 'Limit',
		type: 'numericColumn',
		filter: 'agNumberColumnFilter',
		valueFormatter: (params) => (params.value != null ? `$${params.value.toLocaleString()}` : '(unknown)'),
		filterValueGetter: (params) => params.data?.riskLimit
	},
	{
		field: 'utilizationPercent',
		headerName: 'Util. %',
		type: 'numericColumn',
		filter: 'agNumberColumnFilter',
		valueFormatter: (params) => (params.value != null ? `${params.value.toFixed(1)}%` : '(unknown)'),
		filterValueGetter: (params) => params.data?.utilizationPercent
	}
]

export const HOLDINGS_COLUMN_DEFS: ColDef[] = [
	{ field: 'id', headerName: 'ID', initialHide: true },
	{ field: 'portfolioId', headerName: 'Port. ID', initialHide: true },
	{ field: 'symbol', headerName: 'Symbol' },
	{
		field: 'quantity',
		headerName: 'Qty',
		type: 'numericColumn',
		filter: 'agNumberColumnFilter',
		valueFormatter: (params) => (params.value != null ? params.value.toLocaleString() : '(unknown)'),
		filterValueGetter: (params) => params.data?.quantity
	},
	{
		field: 'marketValue',
		headerName: 'Mkt Value',
		type: 'numericColumn',
		filter: 'agNumberColumnFilter',
		valueFormatter: (params) => (params.value != null ? `$${params.value.toLocaleString()}` : '(unknown)'),
		filterValueGetter: (params) => params.data?.marketValue
	},
	{
		field: 'costBasis',
		headerName: 'Cost',
		type: 'numericColumn',
		filter: 'agNumberColumnFilter',
		valueFormatter: (params) => (params.value != null ? `$${params.value.toLocaleString()}` : '(unknown)'),
		filterValueGetter: (params) => params.data?.costBasis
	},
	{
		field: 'unrealizedGainLoss',
		headerName: 'P&L',
		type: 'numericColumn',
		filter: 'agNumberColumnFilter',
		valueFormatter: (params) => (params.value != null ? `$${params.value.toLocaleString()}` : '(unknown)'),
		filterValueGetter: (params) => params.data?.unrealizedGainLoss
	},
	{
		field: 'weight',
		headerName: 'Wt %',
		type: 'numericColumn',
		filter: 'agNumberColumnFilter',
		valueFormatter: (params) => (params.value != null ? `${(params.value * 100).toFixed(1)}%` : '(unknown)'),
		// Filter on the actual percentage value (0-100) for better UX
		filterValueGetter: (params) => params.data?.weight != null ? params.data.weight * 100 : null
	},
	{
		field: 'sector',
		headerName: 'Sector',
		filter: 'agSetColumnFilter',
		filterParams: {
			defaultToNothingSelected: true
		}
	}
]

export const RISK_COLUMN_DEFS: ColDef[] = [
	{ field: 'id', headerName: 'ID', initialHide: true },
	{ field: 'portfolioId', headerName: 'Port. ID', initialHide: true },
	{
		field: 'riskType',
		headerName: 'Type',
		filter: 'agSetColumnFilter',
		filterParams: {
			defaultToNothingSelected: true
		}
	},
	{
		field: 'VaR',
		headerName: 'VaR',
		type: 'numericColumn',
		filter: 'agNumberColumnFilter',
		valueFormatter: (params) => (params.value != null ? `$${params.value.toLocaleString()}` : '(unknown)'),
		filterValueGetter: (params) => params.data?.VaR
	},
	{
		field: 'expectedShortfall',
		headerName: 'Exp. Shortfall',
		type: 'numericColumn',
		filter: 'agNumberColumnFilter',
		valueFormatter: (params) => (params.value != null ? `$${params.value.toLocaleString()}` : '(unknown)'),
		filterValueGetter: (params) => params.data?.expectedShortfall
	},
	{
		field: 'volatility',
		headerName: 'Vol. %',
		type: 'numericColumn',
		filter: 'agNumberColumnFilter',
		valueFormatter: (params) => (params.value != null ? `${(params.value * 100).toFixed(1)}%` : '(unknown)'),
		// Filter on the actual percentage value (0-100) for better UX
		filterValueGetter: (params) => params.data?.volatility != null ? params.data.volatility * 100 : null
	},
	{
		field: 'beta',
		headerName: 'Beta',
		type: 'numericColumn',
		filter: 'agNumberColumnFilter',
		valueFormatter: (params) => (params.value != null ? params.value.toFixed(2) : '(unknown)'),
		filterValueGetter: (params) => params.data?.beta
	},
	{
		field: 'correlation',
		headerName: 'Corr.',
		type: 'numericColumn',
		filter: 'agNumberColumnFilter',
		valueFormatter: (params) => (params.value != null ? params.value.toFixed(2) : '(unknown)'),
		filterValueGetter: (params) => params.data?.correlation
	},
	{
		field: 'riskDate',
		headerName: 'Date',
		valueFormatter: (params) => (params.value ? new Date(params.value).toLocaleDateString() : '(unknown)'),
		tooltipValueGetter: (params) => {
			if (!params.value) return '(unknown)'
			return new Date(params.value).toLocaleString('en-US', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
				second: 'numeric',
				timeZoneName: 'short'
			})
		}
	}
]

export const TRANSACTIONS_COLUMN_DEFS: ColDef[] = [
	{ field: 'id', headerName: 'ID', initialHide: true },
	{ field: 'accountId', headerName: 'Acct ID', initialHide: true },
	{
		field: 'transactionType',
		headerName: 'Type',
		filter: 'agSetColumnFilter',
		filterParams: {
			defaultToNothingSelected: true
		}
	},
	{
		field: 'amount',
		headerName: 'Amount',
		type: 'numericColumn',
		filter: 'agNumberColumnFilter',
		valueFormatter: (params) => (params.value != null ? `$${params.value.toLocaleString()}` : '(unknown)'),
		filterValueGetter: (params) => params.data?.amount
	},
	{ field: 'currency', headerName: 'Curr', initialHide: true },
	{ field: 'description', headerName: 'Description' },
	{
		field: 'category',
		headerName: 'Category',
		filter: 'agSetColumnFilter',
		filterParams: {
			defaultToNothingSelected: true
		}
	},
	{
		field: 'timestamp',
		headerName: 'Time',
		valueFormatter: (params) => (params.value ? new Date(params.value).toLocaleString() : '(unknown)'),
		tooltipValueGetter: (params) => {
			if (!params.value) return '(unknown)'
			return new Date(params.value).toLocaleString('en-US', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
				second: 'numeric',
				timeZoneName: 'short'
			})
		}
	},
	{
		field: 'status',
		headerName: 'Status',
		filter: 'agSetColumnFilter',
		filterParams: {
			values: ['COMPLETED', 'PENDING', 'CANCELLED', 'FAILED', 'ERROR'],
			defaultToNothingSelected: true
		}
	},
	{ field: 'reference', headerName: 'Ref', initialHide: true },
	{ field: 'counterparty', headerName: 'Counterparty' },
	{
		field: 'fees',
		headerName: 'Fees',
		type: 'numericColumn',
		filter: 'agNumberColumnFilter',
		valueFormatter: (params) => (params.value != null ? `$${params.value.toFixed(2)}` : '(unknown)'),
		filterValueGetter: (params) => params.data?.fees
	}
]
