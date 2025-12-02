import { Check } from 'lucide-react'
import * as Radix from 'radix-ui'
import { cn } from '#lib/utils.tsx'

export function Checkbox({ className, ...props }: React.ComponentProps<typeof Radix.Checkbox.Root>) {
	return (
		<Radix.Checkbox.Root
			className={cn(
				'peer grid h-4 w-4 shrink-0 place-content-center rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
				className
			)}
			{...props}
		>
			<Radix.Checkbox.Indicator className={cn('grid place-content-center text-current')}>
				<Check className="h-4 w-4" />
			</Radix.Checkbox.Indicator>
		</Radix.Checkbox.Root>
	)
}
