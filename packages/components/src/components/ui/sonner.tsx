import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from 'lucide-react'
import * as Sonner from 'sonner'
import { formatError } from '#lib/utils.tsx'

export function Toaster({ ...props }: Sonner.ToasterProps) {
	return (
		<Sonner.Toaster
			theme="system"
			position="top-right"
			className="toaster group"
			icons={{
				success: <CircleCheckIcon className="size-4" />,
				info: <InfoIcon className="size-4" />,
				warning: <TriangleAlertIcon className="size-4" />,
				error: <OctagonXIcon className="size-4" />,
				loading: <Loader2Icon className="size-4 animate-spin" />
			}}
			style={
				{
					'--normal-bg': 'var(--popover)',
					'--normal-text': 'var(--popover-foreground)',
					'--normal-border': 'var(--border)',
					'--border-radius': 'var(--radius)'
				} as React.CSSProperties
			}
			{...props}
		/>
	)
}

export function infoToast(message: string) {
	Sonner.toast.info(message)
}

export function errorToast(error: unknown) {
	const message = formatError(error)
	Sonner.toast.error(message)
}
