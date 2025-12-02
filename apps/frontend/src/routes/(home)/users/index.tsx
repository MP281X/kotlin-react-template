import { useAtomSet } from '@effect-atom/atom-react'
import { eq, useLiveSuspenseQuery } from '@tanstack/react-db'
import { createFileRoute } from '@tanstack/react-router'
import { PencilIcon, PlusIcon, ShieldIcon, Trash2Icon, UserIcon } from 'lucide-react'
import { useState } from 'react'
import { AtomRuntime } from '#lib/runtime.ts'
import { Table } from '@/components/data-table'
import { Form, useForm } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { errorToast, infoToast } from '@/components/ui/sonner'
import { cn } from '@/components/utils'
import { rpc, sync } from '@/rpc'

export const Route = createFileRoute('/(home)/users/')({ component: Page })

const createUserAtom = AtomRuntime.fn(rpc.createUser)
const updateUserAtom = AtomRuntime.fn(rpc.updateUser)
const deleteUserAtom = AtomRuntime.fn(rpc.deleteUser)

type Role = 'USER' | 'ADMIN'

function Page() {
	const [isCreating, setIsCreating] = useState(false)

	const { data: users } = useLiveSuspenseQuery(q =>
		q
			.from({ users: sync.users })
			.where(({ users }) => eq(users.deleted, false))
			.orderBy(({ users }) => users.createdAt, 'desc')
	)

	return (
		<div className="flex h-full flex-col gap-4">
			<div className="flex items-center justify-between">
				<p className="text-muted-foreground text-sm">{users.length} users</p>
				<Button size="sm" onClick={() => setIsCreating(true)} disabled={isCreating}>
					<PlusIcon />
					Add
				</Button>
			</div>

			{isCreating && <CreateUserForm onClose={() => setIsCreating(false)} />}

			<Table
				columns={[
					{ accessorKey: 'email' },
					{ header: 'Role', render: user => <RoleBadge role={user.role} /> },
					{ accessorKey: 'modifiedAt', header: 'Modified', enableGlobalFilter: false },
					{ render: user => <UserActions user={user} /> }
				]}
				data={users}
			/>
		</div>
	)
}

function CreateUserForm(props: { onClose: () => void }) {
	const createUser = useAtomSet(createUserAtom, { mode: 'promise' })

	const form = useForm({
		defaultValues: { email: '', password: '', role: 'USER' as Role },
		onSubmit: async ({ value }) => {
			await createUser(value)
			infoToast('User created')
			props.onClose()
		}
	})

	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="text-base">New User</CardTitle>
				<CardDescription>Create a new account</CardDescription>
			</CardHeader>
			<CardContent>
				<Form form={form} className="flex-col items-stretch gap-3">
					<form.AppField name="email" children={field => <field.EmailField />} />
					<form.AppField name="password" children={field => <field.PasswordField />} />
					<form.Subscribe selector={state => state.values.role}>
						{role => <RoleSelector value={role} onChange={role => form.setFieldValue('role', role)} />}
					</form.Subscribe>
					<div className="flex justify-end gap-2">
						<Button type="button" variant="outline" onClick={props.onClose}>
							Cancel
						</Button>
						<form.SubmitButton>Create</form.SubmitButton>
					</div>
				</Form>
			</CardContent>
		</Card>
	)
}

function RoleSelector(props: { value: Role; onChange: (role: Role) => void }) {
	return (
		<div className="flex gap-2">
			{(['USER', 'ADMIN'] as const).map(role => (
				<Button
					key={role}
					type="button"
					variant={props.value === role ? 'default' : 'outline'}
					size="sm"
					onClick={() => props.onChange(role)}
					className="flex-1"
				>
					{role === 'ADMIN' ? <ShieldIcon className="size-4" /> : <UserIcon className="size-4" />}
					{role}
				</Button>
			))}
		</div>
	)
}

function RoleBadge(props: { role: Role }) {
	return (
		<span
			className={cn(
				'inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs',
				props.role === 'ADMIN' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
			)}
		>
			{props.role === 'ADMIN' ? <ShieldIcon className="size-3" /> : <UserIcon className="size-3" />}
			{props.role}
		</span>
	)
}

function UserActions(props: { user: sync.Table['users'] }) {
	const [isEditing, setIsEditing] = useState(false)
	const deleteUser = useAtomSet(deleteUserAtom, { mode: 'promise' })

	return (
		<div className="flex gap-1">
			<Button variant="ghost" size="icon-sm" onClick={() => setIsEditing(true)}>
				<PencilIcon className="size-4" />
			</Button>
			<Button
				variant="ghost"
				size="icon-sm"
				onClick={() => deleteUser({ id: props.user.id }).then(() => infoToast('User deleted'), errorToast)}
			>
				<Trash2Icon className="size-4" />
			</Button>

			<EditUserSheet user={props.user} isOpen={isEditing} onClose={() => setIsEditing(false)} />
		</div>
	)
}

function EditUserSheet(props: { user: sync.Table['users']; isOpen: boolean; onClose: () => void }) {
	const updateUser = useAtomSet(updateUserAtom, { mode: 'promise' })

	const form = useForm({
		defaultValues: { password: '', role: props.user.role as Role },
		onSubmit: async ({ value }) => {
			await updateUser({ id: props.user.id, password: value.password || undefined, role: value.role })
			infoToast('User updated')
			props.onClose()
		}
	})

	return (
		<Sheet open={props.isOpen} onOpenChange={open => !open && props.onClose()}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Edit User</SheetTitle>
					<SheetDescription>{props.user.email}</SheetDescription>
				</SheetHeader>

				<Form form={form} className="flex-1 flex-col items-stretch gap-4 overflow-y-auto px-4">
					<form.AppField name="password" children={field => <field.PasswordField />} />
					<form.Subscribe selector={state => state.values.role}>
						{role => <RoleSelector value={role} onChange={role => form.setFieldValue('role', role)} />}
					</form.Subscribe>
					<SheetFooter className="mt-auto p-0">
						<Button type="button" variant="outline" onClick={props.onClose}>
							Cancel
						</Button>
						<form.SubmitButton>Save</form.SubmitButton>
					</SheetFooter>
				</Form>
			</SheetContent>
		</Sheet>
	)
}
