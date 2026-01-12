import EngineersGateLogo from '@/assets/EngineersGateLogo'
import LightDarkModeToggle from '@/components/LightDarkModeToggle'
import { NAVIGATION_CONFIG } from '@/data/NavigationConfig'
import { useDarkMode } from '@/stores/DarkModeStore'
import { createRootRoute, Link, Outlet, useRouterState } from '@tanstack/react-router'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { cn } from '@/utils/cn'
import { navigationStyles, headerStyles, layoutStyles } from '@/styles/commonStyles'

export const Route = createRootRoute({
	component: RouteComponent
})

/**
 * Root Layout Component
 *
 * Provides the main app structure with:
 * - Top navigation bar with logo and nav links
 * - Breadcrumb navigation
 * - Page title and content area
 * - Dark mode toggle (dev only)
 */
function RouteComponent() {
	useDarkMode()
	const routerState = useRouterState()
	const currentPath = routerState.location.pathname
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

	// Find the page title from navigation config
	const currentPage = NAVIGATION_CONFIG.find((item) => item.route === currentPath)
	const pageTitle = currentPage?.title || 'Dashboard'

	return (
		<div className={layoutStyles.page}>
			{/* Top Navigation Bar */}
			<header className={headerStyles.container}>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
					<div className="flex items-center justify-between">
						{/* Logo - Left */}
						<EngineersGateLogo className="fill-[#00458a] dark:fill-slate-100 h-6 sm:h-7 md:h-8 flex-shrink-0" />

						{/* Center - Dark Mode Toggle */}
						<div className="hidden md:flex flex-1 justify-center">
							<LightDarkModeToggle />
						</div>

						{/* Desktop Navigation Links - Right (hidden on mobile) */}
						<nav className="hidden md:flex items-center gap-6">
							{NAVIGATION_CONFIG.map((item) => (
								<Link
									key={item.id}
									to={item.route}
									activeOptions={{ exact: item.route === '/' }}
									className={cn(navigationStyles.link.base, navigationStyles.link.inactive)}
									activeProps={{
										className: cn(navigationStyles.link.base, navigationStyles.link.active)
									}}
								>
									{item.name}
								</Link>
							))}
						</nav>

						{/* Mobile Hamburger Menu Button */}
						<button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={navigationStyles.menuButton} aria-label="Toggle menu">
							{mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
						</button>
					</div>

					{/* Mobile Menu Dropdown */}
					{mobileMenuOpen && (
						<nav className="md:hidden mt-4 pb-4 flex flex-col gap-2 border-t border-slate-200 dark:border-slate-800 pt-4">
							{NAVIGATION_CONFIG.map((item) => (
								<Link
									key={item.id}
									to={item.route}
									onClick={() => setMobileMenuOpen(false)}
									activeOptions={{ exact: item.route === '/' }}
									className={cn(navigationStyles.mobileLink.base, navigationStyles.mobileLink.inactive)}
									activeProps={{
										className: cn(navigationStyles.mobileLink.base, navigationStyles.mobileLink.active)
									}}
								>
									{item.name}
								</Link>
							))}
							{/* Dark mode toggle for mobile */}
							<div className="flex justify-center pt-2 border-t border-slate-200 dark:border-slate-800 mt-2">
								<LightDarkModeToggle />
							</div>
						</nav>
					)}
				</div>
			</header>

			{/* Breadcrumb Bar - Second Layer */}
			{/* <div className={headerStyles.breadcrumb}>
				<div className="max-w-7xl mx-auto px-6 py-2">
					<BreadCrumb />
				</div>
			</div> */}

			{/* Main Content - Grows to fill viewport, can expand beyond */}
			<main className={layoutStyles.main}>
				<h1 className={layoutStyles.pageTitle}>{pageTitle}</h1>
				<div className={layoutStyles.contentArea}>
					<Outlet />
				</div>
			</main>
		</div>
	)
}
