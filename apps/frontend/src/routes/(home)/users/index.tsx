import { useLiveQuery } from '@tanstack/react-db'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { rpc } from '@/rpc'
import { sync } from '@/rpc/sync'
import { Button } from '@/ui/components/button'
import { Dialog } from '@/ui/components/dialog'
import { Field } from '@/ui/components/field'
import { Form } from '@/ui/components/form'

import { Table } from '@/ui/components/table/index'

export const Route = createFileRoute('/(home)/users/')({
	component: Page,
	loader: async () => {
		await sync.users.preload()
		const currentUser = await rpc.getCurrentUser()
		return { currentUser }
	}
})

function Page() {
	const { currentUser } = Route.useLoaderData()

	const [createOpen, setCreateOpen] = useState(false)

	const { data } = useLiveQuery(q =>
		q
			.from({ users: sync.users })
			.orderBy(({ users }) => users.email)
			.fn.where(({ users }) => {
				if (users.deleted === true) return false
				if (users.email === 'admin') return false
				if (currentUser.role === 'USER' && users.id !== currentUser.id) return false
				return true
			})
	)

	return (
		<>
			{currentUser.role === 'ADMIN' && <Button.Action onClick={() => setCreateOpen(true)}>Create User</Button.Action>}
			<Create isOpen={createOpen} onClose={() => setCreateOpen(false)} />

			<Table
				data={data}
				columns={[
					{ accessorKey: 'email' },
					{ accessorKey: 'role' },
					{ accessorKey: 'createdAt', hidden: true },
					{
						header: 'dismissed at',
						accessorFn: row => (row.deleted ? row.modifiedAt : undefined)
					},
					{
						render: row => (
							<Table.Actions
								disabled={row.deleted}
								view={({ isOpen, onClose }) => <Details isOpen={isOpen} onClose={onClose} data={row} />}
								edit={({ isOpen, onClose }) => <Edit isOpen={isOpen} onClose={onClose} data={row} />}
								onDelete={async () => await rpc.deleteUser({ id: row.id })}
							/>
						)
					}
				]}
			/>
		</>
	)
}

export function Create(props: { isOpen: boolean; onClose: () => void }) {
	const form = Form.useForm({
		defaultValues: {} as rpc.Payload<'createUser'>,
		onSubmit: async ({ value }) => {
			await rpc.createUser(value)
			props.onClose()
		}
	})

	return (
		<Dialog open={props.isOpen} onClose={props.onClose}>
			<Dialog.Title>Create User</Dialog.Title>

			<Form form={form}>
				<Dialog.Content>
					<form.Field name="email" children={Form.Text} />
					<form.Field name="password" children={Form.Password} />
					<form.Field name="role" children={Form.Select(['USER', 'ADMIN'])} />
				</Dialog.Content>

				<Dialog.Actions>
					<form.CancelButton children="cancel" onClick={props.onClose} />
					<form.SubmitButton children="Create User" />
				</Dialog.Actions>
			</Form>
		</Dialog>
	)
}

export function Details(props: { data: rpc.db.Entities['User']; isOpen: boolean; onClose: () => void }) {
	return (
		<Dialog open={props.isOpen} onClose={props.onClose}>
			<Dialog.Title className="flex items-center justify-between">
				<div>User Details</div>
				<Dialog.CloseButton />
			</Dialog.Title>

			<Dialog.Content>
				<Field>
					<Field.Label children="Email:" />
					<Field.Value children={props.data.email} />
				</Field>
				<Field>
					<Field.Label children="Role:" />
					<Field.Value children={props.data.role} />
				</Field>
				<Field>
					<Field.Label children="Created At:" />
					<Field.Value children={props.data.createdAt} />
				</Field>
				{props.data.deleted && (
					<Field>
						<Field.Label children="Dismissed At:" />
						<Field.Value children={props.data.modifiedAt} />
					</Field>
				)}
			</Dialog.Content>
		</Dialog>
	)
}

export function Edit(props: { data: rpc.db.Entities['User']; isOpen: boolean; onClose: () => void }) {
	const form = Form.useForm({
		defaultValues: {
			id: props.data.id,
			password: undefined as string | undefined,
			role: props.data.role
		} as rpc.Payload<'updateUser'>,
		onSubmit: async ({ value }) => {
			await rpc.updateUser(value)
			props.onClose()
		}
	})

	return (
		<Dialog open={props.isOpen} onClose={props.onClose}>
			<Dialog.Title>Edit {props.data.email}</Dialog.Title>

			<Form form={form}>
				<Dialog.Content>
					<form.Field name="role" children={Form.Select(['USER', 'ADMIN'])} />
					<form.Field name="password" children={Form.Password} />
				</Dialog.Content>

				<Dialog.Actions>
					<form.CancelButton children="cancel" onClick={props.onClose} />
					<form.SubmitButton children="Edit User" />
				</Dialog.Actions>
			</Form>
		</Dialog>
	)
}
