/**
 * Common Tailwind class combinations for consistent styling across the app
 * Extracted for better readability and maintainability
 */

export const navigationStyles = {
	link: {
		base: 'text-sm font-medium transition-colors border-b-2 pb-1',
		inactive: 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border-transparent',
		active: 'text-slate-900 dark:text-slate-100 border-blue-600 dark:border-blue-400'
	},
	mobileLink: {
		base: 'text-sm font-medium transition-colors py-2 px-3 rounded',
		inactive: 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100',
		active: 'text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800'
	},
	menuButton: 'md:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
}

export const headerStyles = {
	container: 'bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex-shrink-0',
	breadcrumb: 'bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex-shrink-0'
}

export const layoutStyles = {
	page: 'min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950',
	main: 'flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 min-h-0',
	pageTitle: 'text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex-shrink-0',
	contentArea: 'flex-1 min-h-0'
}

export const tableStyles = {
	expandedBorder: 'border-2 border-blue-500 dark:border-blue-400 rounded-lg p-2',
	titleContainer: (clickable: boolean) =>
		clickable
			? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded px-2 py-1 -mx-2 -mt-1'
			: '',
	title: 'text-sm font-semibold text-slate-900 dark:text-slate-100',
	expandIcon: 'text-slate-500 dark:text-slate-400 text-xs'
}

export const colorToggleStyles = {
	button: 'w-4 h-4 rounded-full flex items-center justify-center',
	indicator: (isActive: boolean) =>
		isActive
			? 'w-3 h-3 rounded-full bg-green-500'
			: 'w-3 h-3 rounded-full border-2 border-slate-400 dark:border-slate-500'
}

