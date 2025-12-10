import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/candleSticks')({
	component: RouteComponent
})

function RouteComponent() {
	return <div>Hello "/candleSticks"!</div>
}
