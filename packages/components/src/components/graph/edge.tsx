import * as xyFlow from '@xyflow/react'

export declare namespace Edge {
	export type Props<T extends Record<string, unknown>> = Omit<xyFlow.EdgeProps, 'data' | 'style'> & {
		data: T
		className?: string
		style?: React.CSSProperties
	}
}

/** Renders a bezier edge with optional label positioned at the midpoint. */
export function Edge(props: Edge.Props<Record<string, unknown>> & { children?: React.ReactNode }) {
	const [edgePath, labelX, labelY] = xyFlow.getBezierPath(props)

	return (
		<>
			<xyFlow.BaseEdge path={edgePath} markerEnd={props.markerEnd} style={props.style} className={props.className} />
			{props.children && (
				<xyFlow.EdgeLabelRenderer>
					<div
						style={{ transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)` }}
						className="absolute flex items-center justify-center"
					>
						{props.children}
					</div>
				</xyFlow.EdgeLabelRenderer>
			)}
		</>
	)
}
