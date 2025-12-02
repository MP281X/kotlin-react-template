import * as xyFlow from '@xyflow/react'

import { cn } from '#lib/utils.tsx'
import { Edge } from './edge.tsx'
import { getLayoutedElements } from './layout.tsx'
import { Node } from './node.tsx'

export declare namespace Graph {
	export type Node<T extends Record<string, unknown>> = Node.Props<T>
	export type Edge<T extends Record<string, unknown>> = Edge.Props<T>

	export type NodeConfig = Omit<xyFlow.Node, 'position' | 'type'>
	export type EdgeConfig = Omit<xyFlow.Edge, 'id' | 'type'>

	export type Props<NodeTypes extends xyFlow.NodeTypes, EdgeTypes extends xyFlow.EdgeTypes> = {
		nodeTypes: NodeTypes
		edgeTypes: EdgeTypes

		nodes: (NodeConfig & { type: keyof NodeTypes })[]
		edges: (EdgeConfig & { type: keyof EdgeTypes })[]
		children?: React.ReactNode | React.ReactNode[]

		interactive?: boolean
		onConnect?: (data: { source: string; target: string }) => void

		className?: string
		orientation: 'vertical' | 'horizontal'
	}
}

/** Renders a flow graph with automatic dagre layout and optional interactivity. */
export function Graph<NodeTypes extends xyFlow.NodeTypes, EdgeTypes extends xyFlow.EdgeTypes>(
	props: Graph.Props<NodeTypes, EdgeTypes>
) {
	const { layoutedNodes, layoutedEdges } = getLayoutedElements({
		nodes: props.nodes,
		edges: props.edges,
		orientation: props.orientation,
		sizes: { height: 50, width: 220 }
	})

	return (
		<div
			className={cn('h-full w-full rounded-lg border-2', props.className)}
			style={{
				borderColor: 'var(--color-border)',
				backgroundColor: 'var(--color-background)'
			}}
		>
			<xyFlow.ReactFlow
				fitView
				minZoom={0.05}
				nodes={layoutedNodes}
				edges={layoutedEdges}
				nodeTypes={props.nodeTypes}
				edgeTypes={props.edgeTypes}
				nodesDraggable={false}
				nodesConnectable={props.interactive ?? false}
				edgesReconnectable={props.interactive ?? false}
				proOptions={{ hideAttribution: true }}
				onConnect={connection => props.onConnect?.({ source: connection.source, target: connection.target })}
			>
				<xyFlow.Background color="var(--color-muted-foreground)" style={{ opacity: 0.3 }} />
			</xyFlow.ReactFlow>
		</div>
	)
}

Graph.Node = Node
Graph.Edge = Edge
