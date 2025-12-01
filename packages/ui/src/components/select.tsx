import * as HeadlessUI from '@headlessui/react'
import { Array } from 'effect'
import { cn } from '#lib/cn.tsx'
import { Button } from './button.tsx'
import { Icon } from './icon.tsx'

export declare namespace Select {
	export type Props = {
		label: React.ReactNode
		children: React.ReactNode[]
		className?: string
	}

	export namespace Item {
		export type Props = {
			children: React.ReactNode
			onClick: () => void
			selected: boolean
			className?: string
		}
	}
}

export function Select(props: Select.Props) {
	const disabled = Array.isEmptyArray(props.children)

	return (
		<HeadlessUI.Menu>
			<HeadlessUI.MenuButton as={Button} disabled={disabled} className={cn('data-open:border-accent', props.className)}>
				<Icon.Suffix name="keyboard_arrow_down">{props.label}</Icon.Suffix>
			</HeadlessUI.MenuButton>

			<HeadlessUI.MenuItems
				anchor="bottom end"
				className="z-50 flex min-w-52 origin-top-right flex-col rounded border-2 border-border bg-foreground p-1 text-sm [--anchor-gap:4px]"
			>
				{props.children}
			</HeadlessUI.MenuItems>
		</HeadlessUI.Menu>
	)
}

Select.Item = (props: Select.Item.Props) => {
	return (
		<HeadlessUI.MenuItem>
			<Button
				className={cn(
					'flex w-full items-center justify-between gap-2 border-0 bg-transparent px-3 py-2 hover:bg-hover',
					props.className
				)}
				onClick={props.onClick}
			>
				{props.children}
				{props.selected && <Icon name="check" />}
			</Button>
		</HeadlessUI.MenuItem>
	)
}
