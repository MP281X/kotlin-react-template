import { createFileRoute } from '@tanstack/react-router'
import { Graph } from '@/components/graph'

export const Route = createFileRoute('/(home)/graph/')({ component: Page })

function TaskNode(props: Graph.Node<{ label: string; status: 'pending' | 'in-progress' | 'completed' }>) {
	const statusStyles: Record<(typeof props.data)['status'], React.CSSProperties> = {
		pending: { backgroundColor: 'var(--color-muted)', color: 'var(--color-muted-foreground)' },
		'in-progress': {
			backgroundColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)',
			color: 'var(--color-primary)'
		},
		completed: { backgroundColor: 'color-mix(in srgb, #22c55e 20%, transparent)', color: '#22c55e' }
	}

	return (
		<Graph.Node {...props}>
			<div
				className="flex h-full w-full flex-col items-center justify-center rounded-md border px-3 py-2"
				style={statusStyles[props.data.status]}
			>
				<span className="font-medium text-sm">{props.data.label}</span>
				<span className="text-xs opacity-70">{props.data.status}</span>
			</div>
		</Graph.Node>
	)
}

function DecisionNode(props: Graph.Node<{ label: string; condition: string }>) {
	return (
		<Graph.Node {...props}>
			<div
				className="flex h-full w-full flex-col items-center justify-center rounded-md border px-3 py-2"
				style={{
					backgroundColor: 'color-mix(in srgb, #f59e0b 20%, transparent)',
					borderColor: '#f59e0b',
					color: '#f59e0b'
				}}
			>
				<span className="font-medium text-sm">{props.data.label}</span>
				<span className="text-xs opacity-70">{props.data.condition}</span>
			</div>
		</Graph.Node>
	)
}

// Define custom edge types
type FlowEdgeData = { label?: string }

function FlowEdge(props: Graph.Edge<FlowEdgeData>) {
	return (
		<Graph.Edge {...props}>
			{props.data.label && (
				<span
					className="rounded border px-2 py-0.5 text-xs"
					style={{
						backgroundColor: 'var(--color-background)',
						borderColor: 'var(--color-border)',
						color: 'var(--color-muted-foreground)'
					}}
				>
					{props.data.label}
				</span>
			)}
		</Graph.Edge>
	)
}

function Page() {
	return (
		<Graph
			orientation="vertical"
			nodeTypes={{ task: TaskNode, decision: DecisionNode }}
			edgeTypes={{ flow: FlowEdge }}
			nodes={[
				// Linear start
				{ id: 'start', type: 'task', data: { label: 'Start Process', status: 'completed' } },
				{ id: 'review', type: 'task', data: { label: 'Code Review', status: 'completed' } },
				{ id: 'test', type: 'task', data: { label: 'Run Tests', status: 'completed' } },

				// Split into 3 parallel checks
				{ id: 'lint', type: 'task', data: { label: 'Lint Check', status: 'completed' } },
				{ id: 'unit', type: 'task', data: { label: 'Unit Tests', status: 'completed' } },
				{ id: 'e2e', type: 'task', data: { label: 'E2E Tests', status: 'in-progress' } },

				// Converge and continue linear
				{ id: 'build', type: 'task', data: { label: 'Build', status: 'pending' } },
				{ id: 'deploy-decision', type: 'decision', data: { label: 'Environment?', condition: 'select target' } },

				// Split into 2 deploy options
				{ id: 'deploy-staging', type: 'task', data: { label: 'Deploy Staging', status: 'pending' } },
				{ id: 'deploy-prod', type: 'task', data: { label: 'Deploy Prod', status: 'pending' } },

				// Converge to end
				{ id: 'notify', type: 'task', data: { label: 'Send Notification', status: 'pending' } },
				{ id: 'end', type: 'task', data: { label: 'Complete', status: 'pending' } }
			]}
			edges={[
				// Linear start
				{ source: 'start', target: 'review', type: 'flow', data: {} },
				{ source: 'review', target: 'test', type: 'flow', data: {} },

				// Split into 3
				{ source: 'test', target: 'lint', type: 'flow', data: {} },
				{ source: 'test', target: 'unit', type: 'flow', data: {} },
				{ source: 'test', target: 'e2e', type: 'flow', data: {} },

				// Converge from 3
				{ source: 'lint', target: 'build', type: 'flow', data: {} },
				{ source: 'unit', target: 'build', type: 'flow', data: {} },
				{ source: 'e2e', target: 'build', type: 'flow', data: {} },

				// Continue linear to decision
				{ source: 'build', target: 'deploy-decision', type: 'flow', data: {} },

				// Split into 2
				{ source: 'deploy-decision', target: 'deploy-staging', type: 'flow', data: { label: 'Staging' } },
				{ source: 'deploy-decision', target: 'deploy-prod', type: 'flow', data: { label: 'Prod' } },

				// Converge from 2
				{ source: 'deploy-staging', target: 'notify', type: 'flow', data: {} },
				{ source: 'deploy-prod', target: 'notify', type: 'flow', data: {} },

				// Linear end
				{ source: 'notify', target: 'end', type: 'flow', data: {} }
			]}
		/>
	)
}
