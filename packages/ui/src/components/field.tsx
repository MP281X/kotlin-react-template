import * as HeadlessUI from '@headlessui/react'
import { Predicate, Struct } from 'effect'
import { cn } from '#lib/cn.tsx'
import { renderValue, toSentenceCase } from '#lib/utils.tsx'
import { Icon } from './icon.tsx'

export namespace Field {
	export type Props = HeadlessUI.FieldProps

	export namespace Label {
		export type Props = Omit<HeadlessUI.LabelProps, 'children'> & { floating?: boolean; children: string }
	}

	export namespace Value {
		export type Props = Omit<HeadlessUI.DescriptionProps, 'value'> & { value?: string }
	}

	export namespace Input {
		export type Props = Omit<HeadlessUI.InputProps, 'children' | 'readOnly'>
	}

	export namespace TextArea {
		export type Props = Omit<HeadlessUI.TextareaProps, 'children' | 'readOnly'>
	}

	export namespace Checkbox {
		export type Props = Omit<HeadlessUI.CheckboxProps, 'children' | 'value' | 'readOnly'>
	}
}

export function Field(props: Field.Props) {
	return (
		<HeadlessUI.Field
			{...props}
			className={cn('relative flex flex-col items-start justify-start gap-2', props.className)}
		/>
	)
}

Field.Label = (props: Field.Label.Props) => {
	return (
		<HeadlessUI.Label
			{...Struct.omit(props, 'floating')}
			className={cn(
				'text-text-muted',
				props.floating && '-top-2 absolute left-2 z-20',
				props.floating && 'rounded-sm border-2 border-border bg-foreground px-1 text-sm text-text',
				props.className
			)}
			children={toSentenceCase(props.children)}
		/>
	)
}

Field.Value = (props: Field.Value.Props) => {
	return (
		<div
			{...props}
			className={cn(
				'border-border bg-foreground text-text',
				'w-full min-w-0 overflow-auto whitespace-pre-wrap rounded border-2 px-4 py-2',
				'disabled:bg-disabled disabled:opacity-50',
				props.className
			)}
			children={renderValue(props.children)}
		/>
	)
}

Field.Input = (props: Field.Input.Props) => {
	return (
		<HeadlessUI.Input
			{...props}
			autoComplete="off"
			placeholder={props.name ? toSentenceCase(props.name) : undefined}
			readOnly={Predicate.isNullable(props.onChange)}
			className={cn(
				'rounded border-2 border-border bg-foreground',
				'w-full min-w-0 overflow-auto px-4 py-2 text-text',
				'not-read-only:focus-within:border-selected not-read-only:hover:border-selected not-read-only:focus:border-selected',
				'read-only:cursor-text read-only:caret-transparent disabled:bg-disabled disabled:opacity-50',
				props.className
			)}
			value={Predicate.hasProperty(props, 'value') ? props.value || '' : undefined}
		/>
	)
}

Field.TextArea = (props: Field.TextArea.Props) => {
	return (
		<HeadlessUI.Textarea
			{...props}
			rows={props.rows ?? 3}
			autoComplete="off"
			placeholder={props.name ? toSentenceCase(props.name) : undefined}
			readOnly={Predicate.isNullable(props.onChange)}
			className={cn(
				'rounded border-2 border-border bg-foreground',
				'w-full min-w-0 overflow-auto px-4 py-2 text-text',
				'not-read-only:focus-within:border-selected not-read-only:hover:border-selected not-read-only:focus:border-selected',
				'read-only:cursor-text read-only:caret-transparent disabled:bg-disabled disabled:opacity-50',
				props.className
			)}
			value={Predicate.hasProperty(props, 'value') ? props.value || '' : undefined}
		/>
	)
}

Field.Checkbox = (props: Field.Checkbox.Props) => {
	return (
		<HeadlessUI.Checkbox
			{...props}
			className="group flex size-5 items-center justify-center rounded border-2 border-border text-background data-checked:bg-accent"
		>
			<Icon name="check" className={props.checked ? '' : 'hidden'} />
		</HeadlessUI.Checkbox>
	)
}
