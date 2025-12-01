import { createRootRoute, useLocation, useNavigate } from '@tanstack/react-router'
import { pipe, String } from 'effect'
import { useLayoutEffect } from 'react'
import { Icon } from '@/ui/components/icon'
import { Toast } from '@/ui/components/toast'
import { formatError } from '@/ui/lib/utils'

export const Route = createRootRoute({ shellComponent: Root })

function Root(props: { children: React.ReactNode }) {
	return (
		<>
			<Toast />
			<div className="text-xl">
				<div className="flex h-svh flex-col items-center justify-center overflow-hidden" children={props.children} />
			</div>
		</>
	)
}

export function NotFound() {
	return (
		<main className="flex h-full w-full items-center justify-center gap-2 text-4xl">
			<pre className="flex items-center justify-center gap-4 font-family-text">
				<Icon name="report_problem" className="text-error" />
				<div>404</div>
				<Icon name="report_problem" className="text-error" />
			</pre>
		</main>
	)
}

export function Loading() {
	return (
		<main className="flex h-full w-full animate-spin items-center justify-center gap-2 text-5xl">
			<Icon name="progress_activity" className="text-border" />
		</main>
	)
}

export function Error(props: { error: Error; reset: () => void }) {
	const navigate = useNavigate()
	const location = useLocation()

	const message = formatError(props.error)

	// biome-ignore lint/correctness/useExhaustiveDependencies: infinite loop when it throws the redirect
	useLayoutEffect(() => {
		if (pipe(message, String.toLowerCase, String.includes('session not found'))) {
			void navigate({ to: '/auth', search: { redirect: location.href } })
		}
	}, [message, navigate])

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: error page
		<main
			onClick={props.reset}
			className="flex h-full w-full cursor-pointer items-center justify-center gap-2 text-4xl"
		>
			<pre className="flex items-center justify-center gap-4 font-family-text">
				<Icon name="report_problem" className="text-error" />
				<div className="select-text">{message}</div>
				<Icon name="report_problem" className="text-error" />
			</pre>
		</main>
	)
}
