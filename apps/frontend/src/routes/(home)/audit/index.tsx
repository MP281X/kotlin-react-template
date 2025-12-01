import { eq, useLiveQuery } from '@tanstack/react-db'
import { createFileRoute } from '@tanstack/react-router'
import type { rpc } from '@/rpc'
import { sync } from '@/rpc/sync'
import { Dialog } from '@/ui/components/dialog'
import { Field } from '@/ui/components/field'
import { Table } from '@/ui/components/table'

export const Route = createFileRoute('/(home)/audit/')({
	loader: () => Promise.all([sync.audits.preload(), sync.users.preload()]),
	component: Page
})

function Page() {
	const { data } = useLiveQuery(q =>
		q
			.from({ audits: sync.audits })
			.innerJoin({ users: sync.users }, ({ audits, users }) => eq(audits.userId, users.id))
			.orderBy(({ audits }) => audits.timestamp, 'desc')
			.select(({ users, audits }) => ({ ...audits, user: users.email }))
	)

	return (
		<Table
			data={data}
			columns={[
				{ accessorKey: 'user' },
				{ accessorKey: 'message' },
				{ accessorKey: 'payload', hidden: true },
				{ accessorKey: 'result', hidden: true },
				{ accessorKey: 'timestamp', enableGlobalFilter: false },
				{
					render: row => (
						<Table.Actions
							disabled={false}
							view={({ isOpen, onClose }) => <Details isOpen={isOpen} onClose={onClose} data={row} />}
						/>
					)
				}
			]}
		/>
	)
}

export function Details(props: {
	data: rpc.db.Entities['Audit'] & { user: string }
	isOpen: boolean
	onClose: () => void
}) {
	return (
		<Dialog open={props.isOpen} onClose={props.onClose}>
			<Dialog.Title className="flex items-center justify-between">
				<div>Audit Log Details</div>
				<Dialog.CloseButton />
			</Dialog.Title>

			<Dialog.Content>
				<Field>
					<Field.Label children="User:" />
					<Field.Value children={props.data.user} />
				</Field>
				<Field>
					<Field.Label children="Mesage:" />
					<Field.Value children={props.data.message} />
				</Field>
				<Field>
					<Field.Label children="Payload:" />
					<div className="select-text whitespace-pre-wrap">{JSON.stringify(props.data.payload, null, 2)}</div>
				</Field>
				{props.data.result && (
					<Field>
						<Field.Label children="Result:" />
						<div className="select-text whitespace-pre-wrap">{JSON.stringify(props.data.result, null, 2)}</div>
					</Field>
				)}
				<Field>
					<Field.Label children="Timestamp:" />
					<Field.Value children={props.data.timestamp} />
				</Field>
			</Dialog.Content>
		</Dialog>
	)
}
