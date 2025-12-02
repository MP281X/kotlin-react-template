import { eq, useLiveSuspenseQuery } from '@tanstack/react-db'
import { createFileRoute } from '@tanstack/react-router'
import { EyeIcon } from 'lucide-react'
import { useState } from 'react'
import { Table } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatTimestamp } from '@/components/utils'
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
				{ accessorKey: 'timestamp', enableGlobalFilter: false, hidden: true },
				{ render: audit => <AuditActions audit={audit} /> }
			]}
			data={data}
		/>
	)
}

function AuditActions(props: { audit: sync.Table['audits'] & { user: string | null } }) {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<>
			<Button variant="ghost" size="icon-sm" onClick={() => setIsOpen(true)}>
				<EyeIcon className="size-4" />
			</Button>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="max-w-xl">
					<DialogHeader>
						<DialogTitle>Audit Details</DialogTitle>
						<DialogDescription>{props.audit.message}</DialogDescription>
					</DialogHeader>

					<div className="grid gap-3 text-sm">
						<Row label="ID">
							<code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{props.audit.id}</code>
						</Row>
						<div className="grid grid-cols-2 gap-3">
							<Row label="User">{props.audit.user ?? <span className="text-muted-foreground italic">System</span>}</Row>
							<Row label="Time">{formatTimestamp(props.audit.timestamp)}</Row>
						</div>
						<Row label="Payload">
							<pre className="max-h-24 overflow-auto rounded bg-muted p-2 font-mono text-xs">
								{JSON.stringify(props.audit.payload, null, 2)}
							</pre>
						</Row>
						<Row label="Result">
							<pre className="max-h-24 overflow-auto rounded bg-muted p-2 font-mono text-xs">
								{JSON.stringify(props.audit.result, null, 2)}
							</pre>
						</Row>
					</div>
				</DialogContent>
			</Dialog>
		</>
	)
}

function Row(props: { label: string; children: React.ReactNode }) {
	return (
		<div className="flex flex-col gap-1">
			<span className="text-muted-foreground text-xs">{props.label}</span>
			<span>{props.children}</span>
		</div>
	)
}
