import { createRootRoute } from '@tanstack/react-router'
import { Toaster } from '@/components/ui/sonner'

export const Route = createRootRoute({ shellComponent: Root })

function Root(props: { children: React.ReactNode }) {
	return (
		<>
			<Toaster />
			<div className="flex min-h-dvh items-center justify-center" children={props.children} />
		</>
	)
}
