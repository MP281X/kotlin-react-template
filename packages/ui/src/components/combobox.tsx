import * as HeadlessUI from '@headlessui/react'
import { Array, flow, Predicate, pipe, String } from 'effect'
import { useState } from 'react'
import { cn } from '#lib/cn.tsx'
import { Field } from './field.tsx'
import { Icon } from './icon.tsx'

export declare namespace Combobox {
	export type Props<T extends Record<string, unknown>> = {
		options: T[]

		value?: T
		onChange: (value: T) => void

		className?: string
		children: (item: T) => string | number
	}
}

export function Combobox<T extends Record<string, unknown>>(props: Combobox.Props<T>) {
	const [query, setQuery] = useState<string>('')

	const filteredValues = Array.filter(
		props.options,
		flow(props.children, global.String, String.toLowerCase, String.includes(query))
	)

	return (
		<div className="relative w-full">
			<HeadlessUI.Combobox
				immediate
				invalid
				value={props.value}
				onChange={value => {
					if (Predicate.isNullable(value)) return
					props.onChange(value)
				}}
				onClose={() => setQuery('')}
			>
				<HeadlessUI.ComboboxInput
					type="text"
					as={Field.Input}
					disabled={Array.isEmptyArray(props.options)}
					displayValue={value => {
						if (Predicate.isNullable(value)) return ''
						return global.String(props.children(value as T))
					}}
					onChange={event => setQuery(pipe(event.target.value, String.trim, String.toLowerCase))}
				/>

				<HeadlessUI.ComboboxButton className="absolute inset-y-0 right-2 flex items-center">
					<Icon name="keyboard_arrow_down" />
				</HeadlessUI.ComboboxButton>

				<HeadlessUI.ComboboxOptions
					anchor="bottom start"
					className={cn(
						'z-50 flex max-h-[35vh]! w-(--input-width) origin-top flex-col overflow-y-auto rounded border-2 border-border bg-foreground p-1 text-sm [--anchor-gap:4px] empty:invisible'
					)}
				>
					{filteredValues.slice(0, 50).map((value, index) => (
						<HeadlessUI.ComboboxOption
							key={(value as Record<string, string | undefined>)['id'] ?? index}
							value={value}
							className="flex w-full items-center justify-between gap-2 rounded border-0 bg-transparent px-3 py-2 hover:bg-hover data-focus:bg-hover"
						>
							{({ selected }) => (
								<>
									{props.children(value)}
									{selected && <Icon name="check" />}
								</>
							)}
						</HeadlessUI.ComboboxOption>
					))}
				</HeadlessUI.ComboboxOptions>
			</HeadlessUI.Combobox>
		</div>
	)
}
