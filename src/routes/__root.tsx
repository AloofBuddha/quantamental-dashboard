import EngineersGateLogo from '@/assets/EngineersGateLogo'
import BreadCrumb from '@/components/Breadcrumb'
import LightDarkModeToggle from '@/components/LightDarkModeToggle'
import { NAVIGATION_CONFIG } from '@/data/NavigationConfig'
import { useDarkMode } from '@/stores/DarkModeStore'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
	component: RouteComponent
})

function RouteComponent() {
	useDarkMode()
	return (
		<div className="flex  bg-slate-100 dark:bg-slate-900 dark:text-white">
			<div className="flex flex-col space-y-2">
				<div className="flex">
					<LightDarkModeToggle />
				</div>
				<EngineersGateLogo className="fill-[#00458a] h-10 dark:fill-slate-100" />
				<BreadCrumb />

				<div className="flex flex-col">
					{NAVIGATION_CONFIG.map((item) => (
						<Link key={item.id} to={item.route} activeOptions={{ exact: false }} className="hover:text-blue-500 p-1">
							{item.name}
						</Link>
					))}
				</div>
				<Outlet />
			</div>
		</div>
	)
}
