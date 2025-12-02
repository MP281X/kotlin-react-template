import * as tanstackForm from '@tanstack/react-form'
import { Number, Option } from 'effect'
import { useState } from 'react'
import { Button } from '#components/ui/button.tsx'
import { Checkbox } from '#components/ui/checkbox.tsx'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '#components/ui/command.tsx'
import { Field, FieldError, FieldLabel } from '#components/ui/field.tsx'
import { Input } from '#components/ui/input.tsx'
import { Popover, PopoverContent, PopoverTrigger } from '#components/ui/popover.tsx'
import { errorToast } from '#components/ui/sonner.tsx'
import { Spinner } from '#components/ui/spinner.tsx'
import { Textarea } from '#components/ui/textarea.tsx'
import { cn, toSentenceCase } from '#lib/utils.tsx'

const { fieldContext, formContext, useFieldContext, useFormContext } = tanstackForm.createFormHookContexts()

function SubmitButton(props: { children: React.ReactNode }) {
	const form = useFormContext()

	return (
		<form.Subscribe
			selector={state => ({
				isSubmitting: state.isSubmitting,
				canSubmit: state.canSubmit,
				isTouched: state.isTouched
			})}
		>
			{({ isSubmitting, canSubmit, isTouched }) => (
				<Button
					disabled={isSubmitting || !canSubmit || !isTouched}
					onClick={async () => {
						try {
							await form.handleSubmit()
							form.reset()
						} catch (e) {
							return errorToast(e)
						}
					}}
				>
					{isSubmitting && <Spinner />}
					{props.children}
				</Button>
			)}
		</form.Subscribe>
	)
}

function CancelButton(props: { children: React.ReactNode; onClick: () => void }) {
	const form = useFormContext()
	return (
		<form.Subscribe selector={state => state.isSubmitting}>
			{isSubmitting => (
				<Button
					variant="destructive"
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

function TextField() {
	const field = useFieldContext<string>()
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
	return (
		<Field data-invalid={isInvalid}>
			<FieldLabel htmlFor={field.name} children={toSentenceCase(field.name)} />
			<Input
				type="text"
				id={field.name}
				name={field.name}
				value={field.state.value}
				onBlur={field.handleBlur}
				onChange={e => field.handleChange(e.target.value)}
				autoComplete="off"
				aria-invalid={isInvalid}
			/>
			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	)
}

function TextAreaField() {
	const field = useFieldContext<string>()
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
	return (
		<Field data-invalid={isInvalid}>
			<FieldLabel htmlFor={field.name} children={toSentenceCase(field.name)} />
			<Textarea
				id={field.name}
				name={field.name}
				value={field.state.value}
				onBlur={field.handleBlur}
				onChange={e => field.handleChange(e.target.value)}
				autoComplete="off"
				aria-invalid={isInvalid}
			/>
			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	)
}

function EmailField() {
	const field = useFieldContext<string>()
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
	return (
		<Field data-invalid={isInvalid}>
			<FieldLabel htmlFor={field.name} children={toSentenceCase(field.name)} />
			<Input
				type="email"
				id={field.name}
				name={field.name}
				value={field.state.value}
				onBlur={field.handleBlur}
				onChange={e => field.handleChange(e.target.value)}
				autoComplete="off"
				aria-invalid={isInvalid}
			/>
			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	)
}

function PasswordField() {
	const field = useFieldContext<string>()
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
	return (
		<Field data-invalid={isInvalid}>
			<FieldLabel htmlFor={field.name} children={toSentenceCase(field.name)} />
			<Input
				type="password"
				id={field.name}
				name={field.name}
				value={field.state.value}
				onBlur={field.handleBlur}
				onChange={e => field.handleChange(e.target.value)}
				autoComplete="off"
				aria-invalid={isInvalid}
			/>
			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	)
}

function NumberField() {
	const field = useFieldContext<number>()
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
	return (
		<Field data-invalid={isInvalid}>
			<FieldLabel htmlFor={field.name} children={toSentenceCase(field.name)} />
			<Input
				type="number"
				id={field.name}
				name={field.name}
				value={field.state.value}
				onBlur={field.handleBlur}
				onChange={e => {
					const value = Number.parse(e.target.value)
					if (Option.isSome(value)) field.handleChange(value.value)
				}}
				autoComplete="off"
				aria-invalid={isInvalid}
			/>
			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	)
}

function CheckboxField() {
	const field = useFieldContext<boolean>()
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
	return (
		<Field data-invalid={isInvalid}>
			<FieldLabel htmlFor={field.name} children={toSentenceCase(field.name)} />
			<div>
				<Checkbox
					id={field.name}
					checked={field.state.value}
					onBlur={field.handleBlur}
					onCheckedChange={val => field.handleChange(val === true)}
					aria-invalid={isInvalid}
				/>
			</div>
			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	)
}

function FileField() {
	const field = useFieldContext<File>()
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
	return (
		<Field data-invalid={isInvalid}>
			<FieldLabel htmlFor={field.name} children={toSentenceCase(field.name)} />
			<Input
				type="file"
				id={field.name}
				onChange={e => {
					const file = e.target.files?.[0]
					if (file) field.handleChange(file)
				}}
				aria-invalid={isInvalid}
			/>
			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	)
}

/** Provides a searchable dropdown for selecting from a list of options. */
function ComboboxField<T extends { id: string }>(props: { options: T[]; children: (option: T) => React.ReactNode }) {
	const field = useFieldContext<string>()
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

	const [open, setOpen] = useState(false)
	const selectedOption = props.options.find(option => option.id === field.state.value)

	return (
		<Field data-invalid={isInvalid}>
			<FieldLabel htmlFor={field.name} children={toSentenceCase(field.name)} />
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						className={cn('w-full justify-between', !field.state.value && 'text-muted-foreground')}
					>
						{selectedOption ? props.children(selectedOption) : toSentenceCase(field.name)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-(--radix-popover-trigger-width) p-0">
					<Command>
						<CommandInput placeholder={`Search ${toSentenceCase(field.name)}...`} />
						<CommandList>
							<CommandEmpty>No {toSentenceCase(field.name)} found.</CommandEmpty>
							<CommandGroup>
								{props.options.map(option => (
									<CommandItem
										key={option.id}
										value={option.id}
										onSelect={() => {
											field.handleChange(option.id)
											setOpen(false)
										}}
									>
										{props.children(option)}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	)
}

const formHook = tanstackForm.createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		TextField,
		TextAreaField,
		EmailField,
		PasswordField,
		NumberField,
		CheckboxField,
		FileField,
		ComboboxField
	},
	formComponents: { SubmitButton, CancelButton }
})

export const useForm = formHook.useAppForm
export const revalidateLogic = tanstackForm.revalidateLogic

export declare namespace Form {
	export type Props = {
		form: {
			handleSubmit: () => Promise<void>
			AppForm: React.ComponentType<{ children?: React.ReactNode }>
		}
		className?: string
		children: React.ReactNode
	}
}

/** Wraps form content with TanStack Form context and submit handling. */
export function Form(props: Form.Props) {
	return (
		<props.form.AppForm>
			<form
				className={cn('flex flex-1 items-center justify-center', props.className)}
				onSubmit={e => {
					e.preventDefault()
					void props.form.handleSubmit()
				}}
				children={props.children}
			/>
		</props.form.AppForm>
	)
}
