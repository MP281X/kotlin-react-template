import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react'
import * as Radix from 'radix-ui'
import { cn } from '#lib/utils.tsx'

export function DropdownMenu({ ...props }: React.ComponentProps<typeof Radix.DropdownMenu.Root>) {
	return <Radix.DropdownMenu.Root data-slot="dropdown-menu" {...props} />
}

export function DropdownMenuPortal({ ...props }: React.ComponentProps<typeof Radix.DropdownMenu.Portal>) {
	return <Radix.DropdownMenu.Portal data-slot="dropdown-menu-portal" {...props} />
}

export function DropdownMenuTrigger({ ...props }: React.ComponentProps<typeof Radix.DropdownMenu.Trigger>) {
	return <Radix.DropdownMenu.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

export function DropdownMenuContent({
	className,
	sideOffset = 4,
	...props
}: React.ComponentProps<typeof Radix.DropdownMenu.Content>) {
	return (
		<Radix.DropdownMenu.Portal>
			<Radix.DropdownMenu.Content
				data-slot="dropdown-menu-content"
				sideOffset={sideOffset}
				className={cn(
					'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=closed]:animate-out data-[state=open]:animate-in',
					className
				)}
				{...props}
			/>
		</Radix.DropdownMenu.Portal>
	)
}

export function DropdownMenuGroup({ ...props }: React.ComponentProps<typeof Radix.DropdownMenu.Group>) {
	return <Radix.DropdownMenu.Group data-slot="dropdown-menu-group" {...props} />
}

export function DropdownMenuItem({
	className,
	inset,
	variant = 'default',
	...props
}: React.ComponentProps<typeof Radix.DropdownMenu.Item> & {
	inset?: boolean
	variant?: 'default' | 'destructive'
}) {
	return (
		<Radix.DropdownMenu.Item
			data-slot="dropdown-menu-item"
			data-inset={inset}
			data-variant={variant}
			className={cn(
				"data-[variant=destructive]:*:[svg]:!text-destructive relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[disabled]:opacity-50 data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
				className
			)}
			{...props}
		/>
	)
}

export function DropdownMenuCheckboxItem({
	className,
	children,
	checked,
	...props
}: React.ComponentProps<typeof Radix.DropdownMenu.CheckboxItem>) {
	return (
		<Radix.DropdownMenu.CheckboxItem
			data-slot="dropdown-menu-checkbox-item"
			className={cn(
				"relative flex cursor-default select-none items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
				className
			)}
			checked={checked}
			{...props}
		>
			<span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
				<Radix.DropdownMenu.ItemIndicator>
					<CheckIcon className="size-4" />
				</Radix.DropdownMenu.ItemIndicator>
			</span>
			{children}
		</Radix.DropdownMenu.CheckboxItem>
	)
}

export function DropdownMenuRadioGroup({ ...props }: React.ComponentProps<typeof Radix.DropdownMenu.RadioGroup>) {
	return <Radix.DropdownMenu.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />
}

export function DropdownMenuRadioItem({
	className,
	children,
	...props
}: React.ComponentProps<typeof Radix.DropdownMenu.RadioItem>) {
	return (
		<Radix.DropdownMenu.RadioItem
			data-slot="dropdown-menu-radio-item"
			className={cn(
				"relative flex cursor-default select-none items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
				className
			)}
			{...props}
		>
			<span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
				<Radix.DropdownMenu.ItemIndicator>
					<CircleIcon className="size-2 fill-current" />
				</Radix.DropdownMenu.ItemIndicator>
			</span>
			{children}
		</Radix.DropdownMenu.RadioItem>
	)
}

export function DropdownMenuLabel({
	className,
	inset,
	...props
}: React.ComponentProps<typeof Radix.DropdownMenu.Label> & {
	inset?: boolean
}) {
	return (
		<Radix.DropdownMenu.Label
			data-slot="dropdown-menu-label"
			data-inset={inset}
			className={cn('px-2 py-1.5 font-medium text-sm data-inset:pl-8', className)}
			{...props}
		/>
	)
}

export function DropdownMenuSeparator({
	className,
	...props
}: React.ComponentProps<typeof Radix.DropdownMenu.Separator>) {
	return (
		<Radix.DropdownMenu.Separator
			data-slot="dropdown-menu-separator"
			className={cn('-mx-1 my-1 h-px bg-border', className)}
			{...props}
		/>
	)
}

export function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<'span'>) {
	return (
		<span
			data-slot="dropdown-menu-shortcut"
			className={cn('ml-auto text-muted-foreground text-xs tracking-widest', className)}
			{...props}
		/>
	)
}

export function DropdownMenuSub({ ...props }: React.ComponentProps<typeof Radix.DropdownMenu.Sub>) {
	return <Radix.DropdownMenu.Sub data-slot="dropdown-menu-sub" {...props} />
}

export function DropdownMenuSubTrigger({
	className,
	inset,
	children,
	...props
}: React.ComponentProps<typeof Radix.DropdownMenu.SubTrigger> & {
	inset?: boolean
}) {
	return (
		<Radix.DropdownMenu.SubTrigger
			data-slot="dropdown-menu-sub-trigger"
			data-inset={inset}
			className={cn(
				"flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-inset:pl-8 data-[state=open]:text-accent-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
				className
			)}
			{...props}
		>
			{children}
			<ChevronRightIcon className="ml-auto size-4" />
		</Radix.DropdownMenu.SubTrigger>
	)
}

export function DropdownMenuSubContent({
	className,
	...props
}: React.ComponentProps<typeof Radix.DropdownMenu.SubContent>) {
	return (
		<Radix.DropdownMenu.SubContent
			data-slot="dropdown-menu-sub-content"
			className={cn(
				'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-32 origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=closed]:animate-out data-[state=open]:animate-in',
				className
			)}
			{...props}
		/>
	)
}
