import { cn } from '#lib/utils.tsx'

export function Table({ className, ...props }: React.ComponentProps<'table'>) {
	return <table data-slot="table" className={cn('w-full caption-bottom text-sm', className)} {...props} />
}

export function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
	return <thead data-slot="table-header" className={cn('[&_tr]:border-b', className)} {...props} />
}

export function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
	return <tbody data-slot="table-body" className={cn('', className)} {...props} />
}

export function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
	return (
		<tfoot
			data-slot="table-footer"
			className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)}
			{...props}
		/>
	)
}

export function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
	return (
		<tr
			data-slot="table-row"
			className={cn(
				'border-border/50 border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
				className
			)}
			{...props}
		/>
	)
}

export function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
	return (
		<th
			data-slot="table-head"
			className={cn(
				'h-10 whitespace-nowrap border-border border-r px-2 text-left align-middle font-medium text-foreground last:border-r-0 [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5',
				className
			)}
			{...props}
		/>
	)
}

export function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
	return (
		<td
			data-slot="table-cell"
			className={cn(
				'whitespace-nowrap border-border/50 border-r p-2 align-middle last:border-r-0 [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5',
				className
			)}
			{...props}
		/>
	)
}

export function TableCaption({ className, ...props }: React.ComponentProps<'caption'>) {
	return (
		<caption data-slot="table-caption" className={cn('mt-4 text-muted-foreground text-sm', className)} {...props} />
	)
}
