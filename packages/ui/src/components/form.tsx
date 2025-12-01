import * as tanstackForm from '@tanstack/react-form'
import { Array, Option, Predicate, pipe } from 'effect'
import { cn } from '#lib/cn.tsx'
import { toSentenceCase } from '#lib/utils.tsx'
import { Button } from './button.tsx'
import { Combobox } from './combobox.tsx'
import { Field } from './field.tsx'
import { Select } from './select.tsx'
import { Toast } from './toast.tsx'

export declare namespace Form {
	export type Props = {
		className?: string
		form: {
			handleSubmit: () => Promise<void>
			AppForm: React.ComponentType<{ children?: React.ReactNode }>
		}
		children: React.ReactNode
	}

	export type Field<T = any> = {
		name: string
		state?: { value: T }
		handleBlur?: () => void
		handleChange: (value: T) => void
		className?: string
	}
}

export function Form(props: Form.Props) {
	return (
		<props.form.AppForm>
			<form
				className={props.className}
				onSubmit={e => {
					e.preventDefault()
					e.stopPropagation()
					void props.form.handleSubmit()
				}}
				children={props.children}
			/>
		</props.form.AppForm>
	)
}

export const { fieldContext, formContext, useFieldContext, useFormContext } = tanstackForm.createFormHookContexts()

function SubmitButton(props: { children: React.ReactNode }) {
	const form = useFormContext()

	return (
		<form.Subscribe selector={state => state.isSubmitting}>
			{isSubmitting => (
				<Button.Action
					data-loading={isSubmitting}
					disabled={isSubmitting}
					onClick={async () => {
						try {
							await form.handleSubmit()
							form.reset()
						} catch (e) {
							return Toast.error(e)
						}
					}}
					children={props.children}
				/>
			)}
		</form.Subscribe>
	)
}

function CancelButton(props: { children: React.ReactNode; onClick: () => void }) {
	const form = useFormContext()
	return (
		<form.Subscribe selector={state => state.isSubmitting}>
			{isSubmitting => (
				<Button.Cancel
					disabled={isSubmitting}
					onClick={() => {
						props.onClick()
						form.reset()
					}}
					children={props.children}
				/>
			)}
		</form.Subscribe>
	)
}

Form.useForm = tanstackForm.createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {},
	formComponents: { SubmitButton, CancelButton }
}).useAppForm

Form.useStore = tanstackForm.useStore

Form.Text = (props: Form.Field<string>) => {
	return (
		<Field>
			<Field.Label children={props.name} />
			<Field.Input
				type="text"
				name={props.name}
				value={props.state?.value}
				onBlur={props.handleBlur}
				onChange={e => props.handleChange(e.target.value)}
				className={props.className}
			/>
		</Field>
	)
}

Form.TextArea = (props: Form.Field<string>) => {
	return (
		<Field>
			<Field.Label children={props.name} />
			<Field.TextArea
				name={props.name}
				value={props.state?.value}
				onBlur={props.handleBlur}
				onChange={e => props.handleChange(e.target.value)}
				className={props.className}
			/>
		</Field>
	)
}

Form.Email = (props: Form.Field<string>) => {
	return (
		<Field>
			<Field.Label children={props.name} />
			<Field.Input
				type="email"
				name={props.name}
				value={props.state?.value}
				onBlur={props.handleBlur}
				onChange={e => props.handleChange(e.target.value)}
				className={props.className}
			/>
		</Field>
	)
}

Form.Password = (props: Form.Field<string>) => {
	return (
		<Field>
			<Field.Label children={props.name} />
			<Field.Input
				type="password"
				name={props.name}
				value={props.state?.value}
				onBlur={props.handleBlur}
				onChange={e => props.handleChange(e.target.value)}
				className={props.className}
			/>
		</Field>
	)
}

Form.Number = (props: Form.Field<number>) => {
	return (
		<Field>
			<Field.Label children={props.name} />
			<Field.Input
				type="number"
				name={props.name}
				value={props.state?.value}
				onBlur={props.handleBlur}
				onChange={e => props.handleChange(Number.parseFloat(e.target.value))}
				className={props.className}
			/>
		</Field>
	)
}

Form.Checkbox = (props: Form.Field<boolean>) => {
	return (
		<Field>
			<Field.Label children={props.name} />
			<Field.Checkbox
				checked={props.state?.value ?? false}
				onBlur={props.handleBlur}
				onChange={props.handleChange}
				className={props.className}
			/>
		</Field>
	)
}

Form.File = (props: Form.Field<File>) => {
	return (
		<Field>
			<Field.Label children={props.name} />
			<Field.Input
				type="file"
				onChange={e => {
					const file = e.target.files?.[0]
					if (file) props.handleChange(file)
				}}
				className={props.className}
			/>
		</Field>
	)
}

Form.Select = <const T extends unknown[]>(options: T) => {
	return (field: Form.Field<T[number]>) => (
		<Field>
			<Field.Label children={field.name} />
			<Select
				label={
					Predicate.isNotNullable(field.state?.value) ? (
						global.String(field.state.value)
					) : (
						<label className="text-text-muted">{toSentenceCase(field.name)}</label>
					)
				}
				className={cn('w-full px-4 py-2', field.className)}
			>
				{options.map(option => (
					<Select.Item
						key={global.String(option)}
						selected={field.state?.value === option}
						onClick={() => field.handleChange(option)}
					>
						{global.String(option)}
					</Select.Item>
				))}
			</Select>
		</Field>
	)
}

Form.Combobox = <const T extends { id: string }[]>(options: T, children: (data: T[number]) => string) => {
	return (field: Form.Field<string>) => (
		<Field>
			<Field.Label children={field.name} />

			<Combobox
				options={options}
				value={pipe(
					Array.findFirst(options, option => option.id === field.state?.value),
					Option.getOrUndefined
				)}
				onChange={option => field.handleChange(option.id)}
				children={children}
				className={cn('w-full px-4 py-2', field.className)}
			/>
		</Field>
	)
}
