import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import ConfigurableTable from '@/components/ConfigurableTable'
import creditData from '@/data/tableOverview/credit.json'
import holdingsData from '@/data/tableOverview/holdings.json'
import riskData from '@/data/tableOverview/risk.json'
import transactionsData from '@/data/tableOverview/transactions.json'
import { CREDIT_COLUMN_DEFS, HOLDINGS_COLUMN_DEFS, RISK_COLUMN_DEFS, TRANSACTIONS_COLUMN_DEFS } from '@/data/columnDefs'
import { CREDIT_TABLE_COLOR_CONFIG, HOLDINGS_TABLE_COLOR_CONFIG, TRANSACTIONS_TABLE_COLOR_CONFIG } from '@/config/tableConfigs'

export const Route = createFileRoute('/table-overview')({
	component: RouteComponent
})

type TableId = 'credit' | 'holdings' | 'risk' | 'transactions' | null

function RouteComponent() {
	const [expandedTable, setExpandedTable] = useState<TableId>(null)

	const toggleTable = (tableId: TableId) => {
		setExpandedTable((current) => (current === tableId ? null : tableId))
	}

	// If a table is expanded, show only that table
	if (expandedTable) {
		return (
			<div className="h-[calc(100vh-12rem)]">
				{expandedTable === 'credit' && (
					<ConfigurableTable
						data={creditData}
						columnDefs={CREDIT_COLUMN_DEFS}
						tableId="credit"
						colorModeConfig={CREDIT_TABLE_COLOR_CONFIG}
						title="Credit"
						onTitleClick={() => toggleTable(null)}
						isExpanded={true}
					/>
				)}
				{expandedTable === 'holdings' && (
					<ConfigurableTable
						data={holdingsData}
						columnDefs={HOLDINGS_COLUMN_DEFS}
						tableId="holdings"
						colorModeConfig={HOLDINGS_TABLE_COLOR_CONFIG}
						title="Holdings"
						onTitleClick={() => toggleTable(null)}
						isExpanded={true}
					/>
				)}
				{expandedTable === 'risk' && (
					<ConfigurableTable
						data={riskData}
						columnDefs={RISK_COLUMN_DEFS}
						tableId="risk"
						title="Risk"
						onTitleClick={() => toggleTable(null)}
						isExpanded={true}
					/>
				)}
				{expandedTable === 'transactions' && (
					<ConfigurableTable
						data={transactionsData}
						columnDefs={TRANSACTIONS_COLUMN_DEFS}
						tableId="transactions"
						colorModeConfig={TRANSACTIONS_TABLE_COLOR_CONFIG}
						title="Transactions"
						onTitleClick={() => toggleTable(null)}
						isExpanded={true}
					/>
				)}
			</div>
		)
	}

	return (
		<div className="grid grid-cols-1 xl:grid-cols-2 xl:grid-rows-2 xl:h-[calc(100vh-12rem)] gap-4">
			<div className="h-[245px] xl:h-full">
				<ConfigurableTable
					data={creditData}
					columnDefs={CREDIT_COLUMN_DEFS}
					tableId="credit"
					colorModeConfig={CREDIT_TABLE_COLOR_CONFIG}
					title="Credit"
					onTitleClick={() => toggleTable('credit')}
					isExpanded={false}
				/>
			</div>
			<div className="h-[245px] xl:h-full">
				<ConfigurableTable
					data={holdingsData}
					columnDefs={HOLDINGS_COLUMN_DEFS}
					tableId="holdings"
					colorModeConfig={HOLDINGS_TABLE_COLOR_CONFIG}
					title="Holdings"
					onTitleClick={() => toggleTable('holdings')}
					isExpanded={false}
				/>
			</div>
			<div className="h-[245px] xl:h-full">
				<ConfigurableTable
					data={riskData}
					columnDefs={RISK_COLUMN_DEFS}
					tableId="risk"
					title="Risk"
					onTitleClick={() => toggleTable('risk')}
					isExpanded={false}
				/>
			</div>
			<div className="h-[245px] xl:h-full">
				<ConfigurableTable
					data={transactionsData}
					columnDefs={TRANSACTIONS_COLUMN_DEFS}
					tableId="transactions"
					colorModeConfig={TRANSACTIONS_TABLE_COLOR_CONFIG}
					title="Transactions"
					onTitleClick={() => toggleTable('transactions')}
					isExpanded={false}
				/>
			</div>
		</div>
	)
}
