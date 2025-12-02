import * as Radix from 'radix-ui'
import { cn } from '#lib/utils.tsx'

export function Popover({ ...props }: React.ComponentProps<typeof Radix.Popover.Root>) {
	return <Radix.Popover.Root data-slot="popover" {...props} />
}

export function PopoverTrigger({ ...props }: React.ComponentProps<typeof Radix.Popover.Trigger>) {
	return <Radix.Popover.Trigger data-slot="popover-trigger" {...props} />
}

export function PopoverContent({
	className,
	align = 'center',
	sideOffset = 4,
	...props
}: React.ComponentProps<typeof Radix.Popover.Content>) {
	return (
		<Radix.Popover.Portal>
			<Radix.Popover.Content
				data-slot="popover-content"
				align={align}
				sideOffset={sideOffset}
				className={cn(
					'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden data-[state=closed]:animate-out data-[state=open]:animate-in',
					className
				)}
				{...props}
			/>
		</Radix.Popover.Portal>
	)
}

export function PopoverAnchor({ ...props }: React.ComponentProps<typeof Radix.Popover.Anchor>) {
	return <Radix.Popover.Anchor data-slot="popover-anchor" {...props} />
}
