import * as sonner from 'sonner'
import { formatError } from '#lib/utils.tsx'

export declare namespace Toast {
	export type Props = {
		className?: string
	}
}

export function Toast(props: Toast.Props) {
	return (
		<sonner.Toaster
			expand
			theme="system"
			visibleToasts={10}
			className={props.className}
			position="top-right"
			toastOptions={{
				classNames: {
					toast:
						'!select-text !bg-foreground !text-text !border-2 !border-border !font-family-text !text-xl !min-w-[500px] !max-w-[1000px] !whitespace-normal !break-words',
					icon: 'text-accent',
					title: '!text-text font-family-text',
					description: '!text-text-muted font-family-text',
					actionButton: '!text-text font-family-text',
					closeButton: 'text-text-muted hover:text-text',
					cancelButton: '!text-text font-family-text'
				},
				style: {
					zIndex: 100,
					color: 'var(--color-text)',
					background: 'var(--color-foreground)',
					borderWidth: 2,
					borderColor: 'var(--color-border)'
				}
			}}
		/>
	)
}

Toast.info = (message: string) => {
	sonner.toast.info(message)
}

Toast.error = (error: unknown) => {
	const message = formatError(error)
	sonner.toast.error(message)
}
