import * as Radix from 'radix-ui'
import { cn } from '#lib/utils.tsx'

export function TooltipProvider({ delayDuration = 0, ...props }: React.ComponentProps<typeof Radix.Tooltip.Provider>) {
	return <Radix.Tooltip.Provider data-slot="tooltip-provider" delayDuration={delayDuration} {...props} />
}

export function Tooltip({ ...props }: React.ComponentProps<typeof Radix.Tooltip.Root>) {
	return (
		<TooltipProvider>
			<Radix.Tooltip.Root data-slot="tooltip" {...props} />
		</TooltipProvider>
	)
}

export function TooltipTrigger({ ...props }: React.ComponentProps<typeof Radix.Tooltip.Trigger>) {
	return <Radix.Tooltip.Trigger data-slot="tooltip-trigger" {...props} />
}

export function TooltipContent({
	className,
	sideOffset = 0,
	children,
	...props
}: React.ComponentProps<typeof Radix.Tooltip.Content>) {
	return (
		<Radix.Tooltip.Portal>
			<Radix.Tooltip.Content
				data-slot="tooltip-content"
				sideOffset={sideOffset}
				className={cn(
					'fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) animate-in text-balance rounded-md bg-foreground px-3 py-1.5 text-background text-xs data-[state=closed]:animate-out',
					className
				)}
				{...props}
			>
				{children}
				<Radix.Tooltip.Arrow className="z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground" />
			</Radix.Tooltip.Content>
		</Radix.Tooltip.Portal>
	)
}
