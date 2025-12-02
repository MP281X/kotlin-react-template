import { eq, useLiveSuspenseQuery } from '@tanstack/react-db'
import { createFileRoute } from '@tanstack/react-router'
import { Table } from '@/components/data-table'
import { sync } from '@/rpc'

export const Route = createFileRoute('/(home)/audit/')({ component: Page })

function Page() {
	const { data } = useLiveSuspenseQuery(q =>
		q
			.from({ audits: sync.audits })
			.leftJoin({ users: sync.users }, ({ audits, users }) => eq(audits.userId, users.id))
			.orderBy(({ audits }) => audits.timestamp, 'desc')
			.select(({ users, audits }) => ({ ...audits, user: users?.email ?? null }))
	)

	return (
		<Table
			columns={[
				{ accessorKey: 'user' },
				{ accessorKey: 'message' },
				{ accessorKey: 'payload', hidden: true },
				{ accessorKey: 'result', hidden: true },
				{ accessorKey: 'timestamp', enableGlobalFilter: false }
			]}
			data={data}
		/>
	)
}
