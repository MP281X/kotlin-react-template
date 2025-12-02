import { eq, useLiveSuspenseQuery } from '@tanstack/react-db'
import { createFileRoute } from '@tanstack/react-router'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatTimestamp } from '@/components/utils'
import { sync } from '@/rpc'

export const Route = createFileRoute('/(home)/audit/')({ component: Page })

const PAGE_SIZE = 15

function Page() {
	const [page, setPage] = useState(0)

	const { data } = useLiveSuspenseQuery(q =>
		q
			.from({ audits: sync.audits })
			.leftJoin({ users: sync.users }, ({ audits, users }) => eq(audits.userId, users.id))
			.orderBy(({ audits }) => audits.timestamp, 'desc')
			.select(({ users, audits }) => ({ ...audits, user: users?.email }))
	)

	const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE))
	const paginatedData = data.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

	return (
		<div className="flex h-full flex-col">
			<div className="min-h-0 flex-1 overflow-auto rounded-lg border">
				<Table>
					<TableHeader className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm">
						<TableRow className="hover:bg-transparent">
							<TableHead className="w-44">Timestamp</TableHead>
							<TableHead className="w-48">User</TableHead>
							<TableHead>Action</TableHead>
							<TableHead className="hidden w-64 md:table-cell">Payload</TableHead>
							<TableHead className="hidden w-64 lg:table-cell">Result</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedData.map(audit => (
							<TableRow key={audit.id}>
								<TableCell className="font-mono text-muted-foreground text-xs">
									{formatTimestamp(audit.timestamp)}
								</TableCell>
								<TableCell className="text-muted-foreground">{audit.user ?? '—'}</TableCell>
								<TableCell className="font-medium">{audit.message}</TableCell>
								<TableCell className="hidden max-w-64 truncate font-mono text-muted-foreground text-xs md:table-cell">
									{JSON.stringify(audit.payload)}
								</TableCell>
								<TableCell className="hidden max-w-64 truncate font-mono text-muted-foreground text-xs lg:table-cell">
									{audit.result ? JSON.stringify(audit.result) : '—'}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<div className="flex items-center justify-between pt-4">
				<span className="text-muted-foreground text-sm tabular-nums">
					{data.length} {data.length === 1 ? 'entry' : 'entries'}
				</span>
				<div className="flex items-center gap-1">
					<Button variant="ghost" size="icon-sm" onClick={() => setPage(p => p - 1)} disabled={page === 0}>
						<ChevronLeftIcon />
					</Button>
					<span className="min-w-24 text-center text-muted-foreground text-sm tabular-nums">
						Page {page + 1} of {totalPages}
					</span>
					<Button variant="ghost" size="icon-sm" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>
						<ChevronRightIcon />
					</Button>
				</div>
			</div>
		</div>
	)
}
