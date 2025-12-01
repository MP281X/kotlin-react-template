import { Function } from 'effect'
import React from 'react'
import { Icon } from '#components/icon.tsx'
import { cn } from '#lib/cn.tsx'
import { Button } from './button.tsx'

export declare namespace Breadcrumb {
	export type Props = {
		children: React.ReactNode
		className?: string
	}

	export namespace Item {
		export type Props = {
			children: React.ReactNode
			icon?: Icon.Names
			current?: boolean
			className?: string
			onClick?: () => void
		}
	}
}

export function Breadcrumb(props: Breadcrumb.Props) {
	const children = React.Children.toArray(props.children)

	return (
		<nav
			aria-label="Breadcrumb"
			className={cn('w-full border-border border-b-2 p-2 font-medium text-lg', props.className)}
		>
			<ol className="flex items-center">
				{children.map((child, index) => {
					if (React.isValidElement(child) && child.type === Breadcrumb.Item) {
						return (
							<React.Fragment key={child.key}>
								{index > 0 && <Icon name="chevron_right" className="mx-3 shrink-0 text-text-muted" />}
								{React.cloneElement(child as React.ReactElement<Breadcrumb.Item.Props>)}
							</React.Fragment>
						)
					}
					return child
				})}
			</ol>
		</nav>
	)
}

Breadcrumb.Item = (props: Breadcrumb.Item.Props) => {
	return (
		<li>
			<Button.Unstyled
				onClick={props.onClick ?? Function.constUndefined}
				className={cn(
					'flex items-center gap-2 hover:text-text',
					props.current ? 'rounded-none border-b-2 border-b-accent pb-0 text-text' : 'text-text-muted',
					props.className
				)}
			>
				{props.icon && <Icon name={props.icon} />}
				{props.children}
			</Button.Unstyled>
		</li>
	)
}
