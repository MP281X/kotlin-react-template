import * as HeadlessUI from '@headlessui/react'
import { createLink } from '@tanstack/react-router'
import type React from 'react'
import { cn } from '#lib/cn.tsx'
import { Icon } from './icon.tsx'

export declare namespace Button {
	export type Props = Unstyled.Props

	export namespace Unstyled {
		export type Props = Omit<HeadlessUI.ButtonProps, 'children'> & {
			children?: React.ReactNode

			'data-focus'?: boolean
			'data-active'?: boolean
			'data-loading'?: boolean
			'data-disabled'?: boolean
		}
	}

	export namespace Action {
		export interface Props extends Button.Props {}
	}

	export namespace Cancel {
		export interface Props extends Button.Props {}
	}

	export namespace Link {
		export interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
			selected?: boolean
			disabled?: boolean
		}
	}
}

export function Button(props: Button.Props) {
	return (
		<Button.Unstyled
			{...props}
			onClick={props['data-active'] ? undefined : props.onClick}
			className={cn(
				'rounded px-2 py-1',
				'border-2 border-border bg-foreground text-text hover:border-accent hover:bg-hover',
				props['data-focus'] && 'bg-hover!',
				props['data-active'] && 'bg-selected text-foreground hover:bg-selected',
				'disabled:bg-disabled disabled:text-text-disabled disabled:hover:border-border disabled:hover:bg-disabled',
				props.className
			)}
		/>
	)
}

Button.Unstyled = (props: Button.Unstyled.Props) => {
	return (
		<HeadlessUI.Button
			{...props}
			disabled={props.disabled || props['data-loading']}
			className={cn('data-active:cursor-default!', props.className)}
		>
			{!props['data-loading'] && props.children}
			{props['data-loading'] && (
				<div className="inset-0 flex w-10 items-center justify-center">
					<Icon name="progress_activity" className="animate-spin" />
				</div>
			)}
		</HeadlessUI.Button>
	)
}

Button.Action = (props: Button.Action.Props) => {
	return (
		<Button
			{...props}
			type="submit"
			className={cn('bg-accent text-text hover:border-accent hover:bg-accent dark:text-muted', props.className)}
		/>
	)
}

Button.Cancel = (props: Button.Cancel.Props) => {
	return (
		<Button
			{...props}
			type="reset"
			className={cn('bg-muted hover:border-destructive hover:bg-muted', props.className)}
		/>
	)
}

Button.Link = createLink((props: Button.Link.Props) => {
	return (
		<a
			{...props}
			className={cn(
				'rounded border-none bg-transparent px-1 text-3xl hover:bg-accent',
				'disabled:text-text-disabled disabled:hover:border-border disabled:hover:bg-disabled',
				props.className
			)}
		/>
	)
})
