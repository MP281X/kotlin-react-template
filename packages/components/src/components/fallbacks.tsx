import { OctagonAlert } from 'lucide-react'
import { Spinner } from '#components/ui/spinner.tsx'
import { formatError } from '#lib/utils.tsx'

/** Renders a 404 error page with styling for route-level not found states. */
export function NotFound() {
	return (
		<main className="flex flex-1 items-center justify-center px-4 sm:px-0">
			<div className="flex w-full max-w-lg items-center gap-3 border-l-2 border-l-destructive bg-destructive/5 px-4 py-3">
				<OctagonAlert className="size-4 shrink-0 text-destructive" />
				<div className="flex flex-col">
					<span className="font-medium text-sm">Page not found</span>
					<span className="text-muted-foreground text-xs">Error 404</span>
				</div>
			</div>
		</main>
	)
}

/** Renders a centered spinner for route-level loading states. */
export function Loading() {
	return (
		<main className="flex flex-1 items-center justify-center">
			<Spinner />
		</main>
	)
}

/** Renders an error message with tap-to-retry for route-level error boundaries. */
export function Error(props: { error: Error; reset: () => void }) {
	const message = formatError(props.error)

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: error page
		<main onClick={props.reset} className="flex flex-1 cursor-pointer items-center justify-center px-4 sm:px-0">
			<div className="flex w-full max-w-lg flex-col border-l-2 border-l-destructive bg-destructive/5 px-4 py-3">
				<div className="flex items-center gap-2">
					<OctagonAlert className="size-4 shrink-0 text-destructive" />
					<span className="font-medium text-sm">Something went wrong</span>
				</div>
				<code className="wrap-break-word mt-2 text-wrap text-muted-foreground text-xs">{message}</code>
				<span className="mt-3 text-muted-foreground/60 text-xs">Tap to retry</span>
			</div>
		</main>
	)
}
