import { CREDIT_RATING_COLORS, TRANSACTION_STATUS_COLORS, TRADE_TABLE_COLORS, PNL_COLORS } from '@/constants/colorSchemes'
import type { ColorModeConfig } from '@/components/ConfigurableTable'

/**
 * Color mode configurations for tables that support row coloring
 */

export const CREDIT_TABLE_COLOR_CONFIG: ColorModeConfig = {
	modes: [
		{
			id: 'creditRating',
			label: 'Credit Rating',
			field: 'creditRating',
			colors: CREDIT_RATING_COLORS
		}
	]
}

export const HOLDINGS_TABLE_COLOR_CONFIG: ColorModeConfig = {
	modes: [
		{
			id: 'pnl',
			label: 'P&L',
			field: 'unrealizedGainLoss',
			colors: PNL_COLORS,
			valueMapper: (value: unknown) => {
				const numValue = Number(value)
				if (numValue > 0) return 'POSITIVE'
				if (numValue < 0) return 'NEGATIVE'
				return 'ZERO'
			}
		}
	]
}

export const TRANSACTIONS_TABLE_COLOR_CONFIG: ColorModeConfig = {
	modes: [
		{
			id: 'transactionStatus',
			label: 'Transaction Status',
			field: 'status',
			colors: TRANSACTION_STATUS_COLORS
		}
	]
}

export const TRADES_TABLE_COLOR_CONFIG: ColorModeConfig = {
	modes: [
		{
			id: 'side',
			label: 'Side (Buy/Sell)',
			field: 'side',
			colors: {
				light: {
					BUY: TRADE_TABLE_COLORS.side.light.buy,
					SELL: TRADE_TABLE_COLORS.side.light.sell
				},
				dark: {
					BUY: TRADE_TABLE_COLORS.side.dark.buy,
					SELL: TRADE_TABLE_COLORS.side.dark.sell
				}
			}
		},
		{
			id: 'status',
			label: 'Status',
			field: 'status',
			colors: {
				light: {
					FILLED: TRADE_TABLE_COLORS.status.light.filled,
					PENDING: TRADE_TABLE_COLORS.status.light.pending,
					CANCELLED: TRADE_TABLE_COLORS.status.light.cancelled
				},
				dark: {
					FILLED: TRADE_TABLE_COLORS.status.dark.filled,
					PENDING: TRADE_TABLE_COLORS.status.dark.pending,
					CANCELLED: TRADE_TABLE_COLORS.status.dark.cancelled
				}
			}
		}
	]
}

