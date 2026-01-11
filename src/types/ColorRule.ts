/**
 * Color rule system for visual pattern recognition
 * Users define conditions that, when met, apply colors to table rows
 */

export type ConditionOperator = '>' | '<' | '=' | '>=' | '<=' | 'between'

export type LogicOperator = 'AND' | 'OR'

export type ViewType = 'screener' | 'ticker' | 'fundamentals' | 'portfolio'

/**
 * Single condition within a color rule
 */
export interface ColorCondition {
	field: string // Field name from StockData (e.g., 'growthScore', 'pe', 'price')
	operator: ConditionOperator
	value: number | [number, number] // Single value or range for 'between'
}

/**
 * Complete color rule definition
 */
export interface ColorRule {
	id: string // UUID
	name: string // User-friendly name (e.g., "High Growth Value Plays")
	conditions: ColorCondition[] // Array of conditions to evaluate
	logicOperator: LogicOperator // How to combine multiple conditions
	color: string // Hex color code (e.g., "#dcfce7")
	priority: number // 1-100, higher priority wins conflicts
	enabled: boolean // Toggle rule on/off without deleting
	appliesTo: ViewType // Which view this rule applies to
}

/**
 * Helper type for creating new rules (ID auto-generated)
 */
export type NewColorRule = Omit<ColorRule, 'id'>

/**
 * Helper type for rule updates (all fields optional except ID)
 */
export type ColorRuleUpdate = Partial<ColorRule> & { id: string }
