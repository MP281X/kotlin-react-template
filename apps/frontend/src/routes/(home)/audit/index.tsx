import { eq, useLiveSuspenseQuery } from '@tanstack/react-db'
import { createFileRoute } from '@tanstack/react-router'
import { EyeIcon, MoreHorizontalIcon } from 'lucide-react'
import { useState } from 'react'
import { Table } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
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
				{
					render: audit => <AuditActions audit={audit} />
				}
			]}
			data={data}
		/>
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

function JsonBlock(props: { data: unknown }) {
	return (
		<pre className="max-h-32 overflow-auto rounded bg-muted p-2 font-mono text-xs">
			{JSON.stringify(props.data, null, 2)}
		</pre>
	)
}

function AuditActions(props: { audit: sync.Table['audits'] & { user: string | null } }) {
	const [isViewing, setIsViewing] = useState(false)

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
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog open={isViewing} onOpenChange={open => !open && setIsViewing(false)}>
				<DialogContent className="max-w-xl">
					<DialogHeader>
						<DialogTitle>Audit Details</DialogTitle>
						<DialogDescription>{props.audit.message}</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4 py-2">
						<DetailRow label="ID">
							<code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{props.audit.id}</code>
						</DetailRow>
						<div className="grid grid-cols-2 gap-4">
							<DetailRow label="User">
								{props.audit.user ?? <span className="text-muted-foreground italic">System</span>}
							</DetailRow>
							<DetailRow label="Timestamp">{formatTimestamp(props.audit.timestamp)}</DetailRow>
						</div>
						<DetailRow label="Message">{props.audit.message}</DetailRow>
						<DetailRow label="Payload">
							<JsonBlock data={props.audit.payload} />
						</DetailRow>
						<DetailRow label="Result">
							<JsonBlock data={props.audit.result} />
						</DetailRow>
					</div>
				</DialogContent>
			</Dialog>
		</>
	)
}
