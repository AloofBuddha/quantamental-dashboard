import { HomeIcon } from '@heroicons/react/24/outline'
import { Link, useMatches } from '@tanstack/react-router'

export default function BreadCrumb() {
	const matches = useMatches()

	// Build breadcrumbs from route matches
	const breadcrumbs = matches
		.map((match) => {
			const pathname = match.pathname || '/'
			const segments = pathname.split('/').filter(Boolean)
			const label = segments.length === 0 ? 'Home' : segments[segments.length - 1]
			return {
				label,
				href: pathname
			}
		})
		.filter(
			(crumb, index, self) =>
				// Remove duplicates (e.g. multiple 'Home' entries)
				index === 0 || crumb.href !== self[index - 1].href
		)

	return (
		<div className="flex items-center text-gray-400 mx-4 cursor-pointer select-none space-x-2">
			{breadcrumbs.length > 1 &&
				breadcrumbs.map(({ label, href }, i) => (
					<div key={href} className="flex items-center space-x-2">
						<Link to={href}>
							{i === 0 ? (
								<HomeIcon className="hover:text-[#00458a] dark:group-hover:text-white -mr-2 size-10 rounded-[10px] p-2 text-gray-400 hover:bg-[#e7f3fd] dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white" />
							) : (
								<p className="flex hover:underline my-auto capitalize">{decodeURIComponent(label)}</p>
							)}
						</Link>
						{i + 1 < breadcrumbs.length && <p>/</p>}
					</div>
				))}
		</div>
	)
}
