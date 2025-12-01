import * as HeadlessUI from '@headlessui/react'
import { cn } from '#lib/cn.tsx'
import { Icon } from './icon.tsx'

export declare namespace Dialog {
	export type Props = {
		open: boolean
		onClose: (value: boolean) => void
		children: React.ReactNode
		className?: string
	}

	export namespace Title {
		export type Props = {
			children: React.ReactNode
			className?: string
		}
	}

	export namespace Content {
		export type Props = {
			children: React.ReactNode
			className?: string
		}
	}

	export namespace Actions {
		export type Props = {
			children: React.ReactNode
			className?: string
		}
	}
}

export function Dialog(props: Dialog.Props) {
	return (
		<HeadlessUI.Dialog open={props.open} onClose={props.onClose} className="relative z-10">
			<HeadlessUI.DialogBackdrop className="fixed inset-0 bg-background/80" />

			<div className="fixed inset-0 w-screen overflow-y-auto">
				<div className="flex min-h-full items-center justify-center p-4">
					<HeadlessUI.DialogPanel
						className={cn(
							'p-4 text-left',
							'max-h-[75svh] overflow-y-auto',
							'rounded-lg border-2 border-border bg-background',
							props.className
						)}
					>
						{props.children}
					</HeadlessUI.DialogPanel>
				</div>
			</div>
		</HeadlessUI.Dialog>
	)
}

Dialog.Title = (props: Dialog.Title.Props) => {
	return (
		<HeadlessUI.DialogTitle className={cn('mb-4 font-semibold text-2xl text-text', props.className)}>
			{props.children}
		</HeadlessUI.DialogTitle>
	)
}

Dialog.Content = (props: Dialog.Content.Props) => {
	return <div className={cn('flex w-xl flex-col space-y-2 text-xl', props.className)}>{props.children}</div>
}

Dialog.Actions = (props: Dialog.Actions.Props) => {
	return <div className={cn('mt-4 flex justify-end gap-2 text-xl', props.className)}>{props.children}</div>
}

Dialog.CloseButton = () => {
	return (
		<HeadlessUI.CloseButton>
			<Icon name="close" />
		</HeadlessUI.CloseButton>
	)
}
