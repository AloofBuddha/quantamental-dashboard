// Color schemes for table row styling and categorical data
// Improved color scheme - neutral categorical colors for better UX

// Shared row striping colors for all tables
export const ROW_STRIPE_COLORS = {
	light: {
		even: '#e2e8f0', // slate-200 - more contrast
		odd: '#ffffff' // white
	},
	dark: {
		even: '#1e293b', // slate-800
		odd: '#0f172a' // slate-900
	}
} as const

export const TRADE_TABLE_COLORS = {
	stripe: ROW_STRIPE_COLORS,
	// Buy/Sell - Neutral categorical (no value judgment)
	side: {
		light: {
			buy: '#dbeafe', // blue-100
			sell: '#fed7aa' // orange-200
		},
		dark: {
			buy: '#1e3a8a', // blue-900
			sell: '#9a3412' // orange-900
		}
	},
	// Status - Semantic (green=success, amber=in-progress, gray=inactive)
	status: {
		light: {
			filled: '#dcfce7', // green-100
			pending: '#fef3c7', // amber-100
			cancelled: '#f1f5f9' // slate-100
		},
		dark: {
			filled: '#14532d', // green-900
			pending: '#713f12', // amber-900
			cancelled: '#334155' // slate-700
		}
	}
} as const

// Credit Rating colors - Gradual gradient across all 22 rating levels
// AAA (best green) → BBB- (amber, investment grade cutoff) → D (red, default)
export const CREDIT_RATING_COLORS = {
	light: {
		'AAA': '#d1fae5',  // green-100 - best (lightest green)
		'AA+': '#a7f3d0',  // green-200
		'AA': '#6ee7b7',   // green-300
		'AA-': '#34d399',  // green-400
		'A+': '#10b981',   // green-500
		'A': '#059669',    // green-600
		'A-': '#d9f99d',   // lime-200 - transition to yellow
		'BBB+': '#fef08a', // yellow-200 - investment grade cutoff approaching
		'BBB': '#fde047',  // yellow-300
		'BBB-': '#fbbf24', // amber-400 - last investment grade
		'BB+': '#f59e0b',  // amber-500 - speculative grade begins
		'BB': '#fb923c',   // orange-400
		'BB-': '#f97316',  // orange-500
		'B+': '#fecaca',   // red-200 - higher risk
		'B': '#fca5a5',    // red-300
		'B-': '#f87171',   // red-400
		'CCC+': '#ef4444', // red-500 - substantial risk
		'CCC': '#dc2626',  // red-600
		'CCC-': '#b91c1c', // red-700
		'CC': '#991b1b',   // red-800
		'C': '#7f1d1d',    // red-900
		'D': '#450a0a'     // red-950 - default (darkest red)
	},
	dark: {
		'AAA': '#064e3b',  // green-950 - best (darkest green)
		'AA+': '#065f46',  // green-900
		'AA': '#047857',   // green-800
		'AA-': '#059669',  // green-700
		'A+': '#10b981',   // green-600
		'A': '#34d399',    // green-500
		'A-': '#365314',   // lime-950 - transition to yellow
		'BBB+': '#713f12', // amber-950 - investment grade cutoff approaching
		'BBB': '#78350f',  // amber-900
		'BBB-': '#92400e', // amber-800 - last investment grade
		'BB+': '#9a3412',  // orange-900 - speculative grade begins
		'BB': '#7c2d12',   // orange-950
		'BB-': '#6b2e11',  // orange-950 (darker)
		'B+': '#7f1d1d',   // red-900 - higher risk
		'B': '#991b1b',    // red-800
		'B-': '#b91c1c',   // red-700
		'CCC+': '#dc2626', // red-600 - substantial risk
		'CCC': '#ef4444',  // red-500
		'CCC-': '#f87171', // red-400
		'CC': '#fca5a5',   // red-300
		'C': '#fecaca',    // red-200
		'D': '#fee2e2'     // red-100 - default (lightest red for dark mode contrast)
	}
} as const

// Transaction Status colors
export const TRANSACTION_STATUS_COLORS = {
	light: {
		'COMPLETED': '#dcfce7', // green-100 - success
		'PENDING': '#fef3c7', // amber-100 - needs attention
		'CANCELLED': '#f1f5f9', // slate-100 - neutral
		'FAILED': '#fecaca', // red-200 - error
		'ERROR': '#fecaca'
	},
	dark: {
		'COMPLETED': '#14532d', // green-900 - success
		'PENDING': '#713f12', // amber-900 - needs attention
		'CANCELLED': '#334155', // slate-700 - neutral
		'FAILED': '#7f1d1d', // red-900 - error
		'ERROR': '#7f1d1d'
	}
} as const

// P&L (Profit & Loss) colors for Holdings table
export const PNL_COLORS = {
	light: {
		'POSITIVE': '#dcfce7', // green-100 - profit
		'NEGATIVE': '#fecaca', // red-200 - loss
		'ZERO': '#f1f5f9' // slate-100 - neutral/breakeven
	},
	dark: {
		'POSITIVE': '#14532d', // green-900 - profit
		'NEGATIVE': '#7f1d1d', // red-900 - loss
		'ZERO': '#334155' // slate-700 - neutral/breakeven
	}
} as const
