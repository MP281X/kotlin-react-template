import * as Radix from 'radix-ui'
import { cn } from '#lib/utils.tsx'

export function Separator({
	className,
	orientation = 'horizontal',
	decorative = true,
	...props
}: React.ComponentProps<typeof Radix.Separator.Root>) {
	return (
		<Radix.Separator.Root
			data-slot="separator"
			decorative={decorative}
			orientation={orientation}
			className={cn(
				'shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px',
				className
			)}
			{...props}
		/>
	)
}
