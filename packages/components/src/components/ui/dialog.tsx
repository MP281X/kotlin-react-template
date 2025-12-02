import { XIcon } from 'lucide-react'
import * as Radix from 'radix-ui'
import { cn } from '#lib/utils.tsx'

export function Dialog({ ...props }: React.ComponentProps<typeof Radix.Dialog.Root>) {
	return <Radix.Dialog.Root data-slot="dialog" {...props} />
}

export function DialogTrigger({ ...props }: React.ComponentProps<typeof Radix.Dialog.Trigger>) {
	return <Radix.Dialog.Trigger data-slot="dialog-trigger" {...props} />
}

export function DialogClose({ ...props }: React.ComponentProps<typeof Radix.Dialog.Close>) {
	return <Radix.Dialog.Close data-slot="dialog-close" {...props} />
}

export function DialogPortal({ ...props }: React.ComponentProps<typeof Radix.Dialog.Portal>) {
	return <Radix.Dialog.Portal data-slot="dialog-portal" {...props} />
}

export function DialogOverlay({ className, ...props }: React.ComponentProps<typeof Radix.Dialog.Overlay>) {
	return (
		<Radix.Dialog.Overlay
			data-slot="dialog-overlay"
			className={cn(
				'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=open]:animate-in',
				className
			)}
			{...props}
		/>
	)
}

export function DialogContent({ className, children, ...props }: React.ComponentProps<typeof Radix.Dialog.Content>) {
	return (
		<DialogPortal>
			<DialogOverlay />
			<Radix.Dialog.Content
				data-slot="dialog-content"
				className={cn(
					'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in sm:rounded-lg',
					className
				)}
				{...props}
			>
				{children}
				<Radix.Dialog.Close className="absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
					<XIcon className="size-4" />
					<span className="sr-only">Close</span>
				</Radix.Dialog.Close>
			</Radix.Dialog.Content>
		</DialogPortal>
	)
}

export function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="dialog-header"
			className={cn('flex flex-col gap-1.5 text-center sm:text-left', className)}
			{...props}
		/>
	)
}

export function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="dialog-footer"
			className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
			{...props}
		/>
	)
}

export function DialogTitle({ className, ...props }: React.ComponentProps<typeof Radix.Dialog.Title>) {
	return (
		<Radix.Dialog.Title
			data-slot="dialog-title"
			className={cn('font-semibold text-lg leading-none', className)}
			{...props}
		/>
	)
}

export function DialogDescription({ className, ...props }: React.ComponentProps<typeof Radix.Dialog.Description>) {
	return (
		<Radix.Dialog.Description
			data-slot="dialog-description"
			className={cn('text-muted-foreground text-sm', className)}
			{...props}
		/>
	)
}
