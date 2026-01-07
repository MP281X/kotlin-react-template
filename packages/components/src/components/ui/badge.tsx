import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '#lib/utils.tsx'

const badgeVariants = cva('inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-medium', {
	variants: {
		variant: {
			default: 'bg-muted text-muted-foreground',
			primary: 'bg-primary/10 text-primary',
			success: 'bg-green-500/10 text-green-500',
			warning: 'bg-amber-500/10 text-amber-500',
			destructive: 'bg-destructive/10 text-destructive'
		}
	},
	defaultVariants: {
		variant: 'default'
	}
})

export function Badge({
	className,
	variant,
	...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
	return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
