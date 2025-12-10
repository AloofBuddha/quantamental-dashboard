import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tableOverview')({
	component: RouteComponent
})

function RouteComponent() {
	return <div>Hello "/tableOverview"!</div>
}
