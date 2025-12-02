import * as Radix from 'radix-ui'
import { cn } from '#lib/utils.tsx'

export function Field({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return <div className={cn('flex flex-col gap-2', className)} {...props} />
}

export function FieldLabel({ className, ...props }: React.ComponentPropsWithoutRef<typeof Radix.Label.Root>) {
	return (
		<Radix.Label.Root
			className={cn(
				'font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
				className
			)}
			{...props}
		/>
	)
}

export function FieldError({ errors, className }: { errors: { message: string }[]; className?: string }) {
	return (
		<p className={cn('font-medium text-destructive text-sm', className)}>{errors.map(e => e.message).join(', ')}</p>
	)
}
