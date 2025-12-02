import { useAtomSuspense } from '@effect-atom/atom-react'
import { createFileRoute } from '@tanstack/react-router'
import { AtomRuntime } from '#lib/runtime.ts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatTimestamp } from '@/components/utils'
import { rpc } from '@/rpc'

export const Route = createFileRoute('/(home)/profile/')({ component: Page })

const sessionAtom = AtomRuntime.atom(rpc.getCurrentUser)

function Page() {
	const user = useAtomSuspense(sessionAtom).value

	return (
		<div className="m-auto w-full max-w-2xl space-y-6">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="space-y-1">
							<CardTitle className="text-lg">{user.email}</CardTitle>
							<CardDescription>Primary email address</CardDescription>
						</div>
						<span className="border bg-muted px-3 py-1 text-primary text-xs">{user.role}</span>
					</div>
				</CardHeader>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Account Details</CardTitle>
					<CardDescription>Information about your account</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex justify-between">
						<span className="text-muted-foreground text-sm">User ID</span>
						<span className="font-mono text-sm">{user.id}</span>
					</div>
					<Separator />
					<div className="flex justify-between">
						<span className="text-muted-foreground text-sm">Created</span>
						<span className="text-sm">{formatTimestamp(user.createdAt)}</span>
					</div>
					<Separator />
					<div className="flex justify-between">
						<span className="text-muted-foreground text-sm">Last modified</span>
						<span className="text-sm">{formatTimestamp(user.modifiedAt)}</span>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
