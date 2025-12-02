import * as xyFlow from '@xyflow/react'
import * as dagre from 'dagre'

export declare namespace Layout {
	export type Props = {
		nodes: Omit<xyFlow.Node, 'position' | 'type'>[]
		edges: Omit<xyFlow.Edge, 'id' | 'type'>[]

		orientation: 'vertical' | 'horizontal'
		sizes: { width: number; height: number }
	}

	export type Result = {
		layoutedNodes: xyFlow.Node[]
		layoutedEdges: xyFlow.Edge[]
	}
}

/** Calculates node positions using dagre for automatic graph layout. */
export function getLayoutedElements(props: Layout.Props): Layout.Result {
	const dagreGraph = new dagre.graphlib.Graph()
	dagreGraph.setGraph({
		rankdir: props.orientation === 'horizontal' ? 'LR' : 'TB',
		ranksep: 150
	})
	dagreGraph.setDefaultEdgeLabel(() => ({}))

	const nodes: xyFlow.Node[] = props.nodes.map(node => {
		dagreGraph.setNode(node.id, { width: node.width ?? props.sizes.width, height: node.height ?? props.sizes.height })
		return { ...node, position: { x: 0, y: 0 } }
	})

	const edges: xyFlow.Edge[] = props.edges.map(edge => {
		dagreGraph.setEdge(edge.source, edge.target)
		return { ...edge, id: `${edge.source}-${edge.target}` }
	})

	const usedNodeIds = new Set(edges.flatMap(edge => [edge.source, edge.target]))
	const unusedNodes = nodes.filter(node => !usedNodeIds.has(node.id)).map(node => node.id)
	// biome-ignore lint/style/noNonNullAssertion: valid
	for (let i = 0; i < unusedNodes.length - 1; i++) dagreGraph.setEdge(unusedNodes[i]!, unusedNodes[i + 1]!)

	dagre.layout(dagreGraph)

	const layoutedNodes: xyFlow.Node[] = nodes.map(node => {
		const { x, y } = dagreGraph.node(node.id)
		return {
			...node,
			...props.sizes,
			targetPosition: props.orientation === 'horizontal' ? xyFlow.Position.Left : xyFlow.Position.Top,
			sourcePosition: props.orientation === 'horizontal' ? xyFlow.Position.Right : xyFlow.Position.Bottom,
			position: {
				x: x - (node.width ?? props.sizes.width) / 2,
				y: y - (node.height ?? props.sizes.height) / 2
			}
		}
	})

	return { layoutedNodes, layoutedEdges: edges }
}
