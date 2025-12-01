import * as HeadlessUI from '@headlessui/react'

import { cn } from '#lib/cn.tsx'
import { Icon } from './icon.tsx'

export declare namespace Sidebar {
	export type Props = {
		className?: string
		children: React.ReactNode
	}

	export namespace Header {
		export type Props = {
			className?: string
			children: React.ReactNode
		}
	}

	export namespace Item {
		export type Props = {
			current?: boolean
			className?: string
			children: React.ReactNode
		}
	}

	export namespace Group {
		export type Props = {
			label: React.ReactNode
			defaultOpen: boolean

			className?: string
			children: React.ReactNode
		}
	}

	export namespace Footer {
		export type Props = {
			className?: string
			children: React.ReactNode
		}
	}
}

export function Sidebar(props: Sidebar.Props) {
	return (
		<aside
			className={cn('flex flex-col gap-2 p-2', 'border-border border-r-2', props.className)}
			children={props.children}
		/>
	)
}

Sidebar.Header = (props: Sidebar.Header.Props) => {
	return (
		<header className={cn('flex items-center justify-center border-border border-b-2 p-2', props.className)}>
			{props.children}
		</header>
	)
}

Sidebar.Item = (props: Sidebar.Item.Props) => {
	return (
		<div
			className={cn(
				'rounded px-2 py-1',
				props.current && 'bg-accent text-text dark:text-muted',
				!props.current && 'hover:bg-hover',
				props.className
			)}
		>
			{props.children}
		</div>
	)
}

Sidebar.Group = (props: Sidebar.Group.Props) => {
	return (
		<HeadlessUI.Disclosure defaultOpen={props.defaultOpen}>
			{({ open }) => (
				<nav>
					<HeadlessUI.DisclosureButton
						className={cn('flex w-full items-center rounded px-2 py-1 hover:bg-hover', props.className)}
					>
						<span className="flex-1">{props.label}</span>
						<Icon name="chevron_right" className={cn(open && 'rotate-90')} />
					</HeadlessUI.DisclosureButton>
					<HeadlessUI.DisclosurePanel className="flex flex-col gap-1 pt-1 pl-4 text-lg">
						{props.children}
					</HeadlessUI.DisclosurePanel>
				</nav>
			)}
		</HeadlessUI.Disclosure>
	)
}

Sidebar.Footer = (props: Sidebar.Footer.Props) => {
	return (
		<footer className={cn('mt-auto flex flex-col gap-2 border-border border-t-2 px-2 py-2', props.className)}>
			{props.children}
		</footer>
	)
}
