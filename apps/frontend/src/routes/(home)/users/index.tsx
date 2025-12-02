import { useAtomSet } from '@effect-atom/atom-react'
import { eq, useLiveSuspenseQuery } from '@tanstack/react-db'
import { createFileRoute } from '@tanstack/react-router'
import { Record } from 'effect'
import { EyeIcon, MoreHorizontalIcon, PencilIcon, PlusIcon, ShieldIcon, Trash2Icon, UserIcon } from 'lucide-react'
import { useState } from 'react'
import { AtomRuntime } from '#lib/runtime.ts'
import { Table } from '@/components/data-table'
import { Form, useForm } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { errorToast, infoToast } from '@/components/ui/sonner'
import { cn, formatTimestamp } from '@/components/utils'
import { rpc, sync } from '@/rpc'

export const Route = createFileRoute('/(home)/users/')({ component: Page })

const createUserAtom = AtomRuntime.fn(rpc.createUser)
const updateUserAtom = AtomRuntime.fn(rpc.updateUser)
const deleteUserAtom = AtomRuntime.fn(rpc.deleteUser)

const ROLE_CONFIG = {
	USER: { label: 'User', icon: UserIcon, color: 'bg-muted text-muted-foreground' },
	ADMIN: { label: 'Admin', icon: ShieldIcon, color: 'bg-primary/10 text-primary' }
} satisfies globalThis.Record<string, { label: string; icon: React.ElementType; color: string }>

function Page() {
	const [isCreating, setIsCreating] = useState(false)

	const { data: users } = useLiveSuspenseQuery(q =>
		q
			.from({ users: sync.users })
			.where(({ users }) => eq(users.deleted, false))
			.orderBy(({ users }) => users.createdAt, 'desc')
	)

	return (
		<div className="flex h-full flex-col gap-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-semibold text-xl">Users</h1>
					<p className="text-muted-foreground text-sm">{users.length} users in your organization</p>
				</div>
				<Button onClick={() => setIsCreating(true)} disabled={isCreating}>
					<PlusIcon />
					Add User
				</Button>
			</div>

			{isCreating && <CreateUserForm onClose={() => setIsCreating(false)} />}

			<Table
				columns={[
					{ accessorKey: 'email' },
					{
						header: 'Role',
						render: user => <RoleBadge role={user.role} />
					},
					{ accessorKey: 'createdAt', header: 'Created', enableGlobalFilter: false, hidden: true },
					{ accessorKey: 'modifiedAt', header: 'Modified', enableGlobalFilter: false },
					{
						render: user => <UserActions user={user} />
					}
				]}
				data={users}
			/>
		</div>
	)
}

function RoleBadge(props: { role: keyof typeof ROLE_CONFIG }) {
	const config = ROLE_CONFIG[props.role]
	const Icon = config.icon
	return (
		<span className={cn('inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-xs', config.color)}>
			<Icon className="size-3" />
			{config.label}
		</span>
	)
}

function DetailRow(props: { label: string; children: React.ReactNode }) {
	return (
		<div className="flex flex-col gap-1">
			<span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">{props.label}</span>
			<span className="text-sm">{props.children}</span>
		</div>
	)
}

function ViewUserDialog(props: { user: sync.Table['users']; isOpen: boolean; onClose: () => void }) {
	return (
		<Dialog open={props.isOpen} onOpenChange={open => !open && props.onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>User Details</DialogTitle>
					<DialogDescription>{props.user.email}</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-2">
					<DetailRow label="ID">
						<code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{props.user.id}</code>
					</DetailRow>
					<DetailRow label="Email">{props.user.email}</DetailRow>
					<DetailRow label="Role">
						<RoleBadge role={props.user.role} />
					</DetailRow>
					<div className="grid grid-cols-2 gap-4">
						<DetailRow label="Created">{formatTimestamp(props.user.createdAt)}</DetailRow>
						<DetailRow label="Modified">{formatTimestamp(props.user.modifiedAt)}</DetailRow>
					</div>
					<DetailRow label="Deleted">
						<span className={props.user.deleted ? 'text-destructive' : 'text-muted-foreground'}>
							{props.user.deleted ? 'Yes' : 'No'}
						</span>
					</DetailRow>
				</div>
			</DialogContent>
		</Dialog>
	)
}

function CreateUserForm(props: { onClose: () => void }) {
	const createUser = useAtomSet(createUserAtom, { mode: 'promise' })

	const form = useForm({
		defaultValues: { email: '', password: '', role: 'USER' as keyof typeof ROLE_CONFIG },
		onSubmit: async ({ value }) => {
			await createUser({
				email: value.email,
				password: value.password,
				role: value.role
			})
			infoToast('User created')
			props.onClose()
		}
	})

	return (
		<Card className="fade-in slide-in-from-top-2 animate-in duration-200">
			<CardHeader className="pb-4">
				<CardTitle className="text-base">New User</CardTitle>
				<CardDescription>Create a new user account</CardDescription>
			</CardHeader>
			<CardContent>
				<Form form={form} className="flex-col items-stretch gap-4">
					<form.AppField name="email" children={field => <field.EmailField />} />
					<form.AppField name="password" children={field => <field.PasswordField />} />
					<div className="flex flex-col gap-2">
						<span className="font-medium text-sm">Role</span>
						<form.Field name="role">
							{field => (
								<div className="flex gap-2">
									{Record.collect(ROLE_CONFIG, (key, { label, icon: RoleIcon }) => (
										<Button
											key={key}
											type="button"
											variant={field.state.value === key ? 'default' : 'outline'}
											size="sm"
											onClick={() => field.handleChange(key)}
											className="flex-1"
										>
											<RoleIcon className="size-4" />
											{label}
										</Button>
									))}
								</div>
							)}
						</form.Field>
					</div>
					<div className="flex justify-end gap-2 pt-2">
						<Button variant="outline" onClick={props.onClose}>
							Cancel
						</Button>
						<form.SubmitButton>Create User</form.SubmitButton>
					</div>
				</Form>
			</CardContent>
		</Card>
	)
}

function UserActions(props: { user: sync.Table['users'] }) {
	const [isViewing, setIsViewing] = useState(false)
	const [isEditing, setIsEditing] = useState(false)
	const deleteUser = useAtomSet(deleteUserAtom, { mode: 'promise' })

	const handleDelete = async () => {
		try {
			await deleteUser({ id: props.user.id })
			infoToast('User deleted')
		} catch (e) {
			errorToast(e)
		}
	}

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon-sm">
						<MoreHorizontalIcon className="size-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={() => setIsViewing(true)}>
						<EyeIcon className="size-4" />
						View Details
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setIsEditing(true)}>
						<PencilIcon className="size-4" />
						Edit
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem variant="destructive" onClick={handleDelete}>
						<Trash2Icon className="size-4" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<ViewUserDialog user={props.user} isOpen={isViewing} onClose={() => setIsViewing(false)} />
			<EditUserSheet user={props.user} isOpen={isEditing} onClose={() => setIsEditing(false)} />
		</>
	)
}

function EditUserSheet(props: { user: sync.Table['users']; isOpen: boolean; onClose: () => void }) {
	const updateUser = useAtomSet(updateUserAtom, { mode: 'promise' })

	const form = useForm({
		defaultValues: { password: '', role: props.user.role as keyof typeof ROLE_CONFIG },
		onSubmit: async ({ value }) => {
			await updateUser({
				id: props.user.id,
				password: value.password || undefined,
				role: value.role
			})
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
					<div className="flex flex-col gap-2">
						<span className="font-medium text-sm">Role</span>
						<form.Field name="role">
							{field => (
								<div className="flex gap-2">
									{Record.collect(ROLE_CONFIG, (key, { label, icon: RoleIcon }) => (
										<Button
											key={key}
											type="button"
											variant={field.state.value === key ? 'default' : 'outline'}
											size="sm"
											onClick={() => field.handleChange(key)}
											className="flex-1"
										>
											<RoleIcon className="size-4" />
											{label}
										</Button>
									))}
								</div>
							)}
						</form.Field>
					</div>
					<SheetFooter className="mt-auto p-0">
						<Button variant="outline" onClick={props.onClose}>
							Cancel
						</Button>
						<form.SubmitButton>Save Changes</form.SubmitButton>
					</SheetFooter>
				</Form>
			</SheetContent>
		</Sheet>
	)
}
