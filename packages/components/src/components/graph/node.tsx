import * as xyFlow from '@xyflow/react'

export declare namespace Node {
	export type Props<T extends Record<string, unknown>> = Omit<xyFlow.NodeProps, 'data'> & {
		data: T
		className?: string
		style?: React.CSSProperties
	}
}

/** Wraps node content with source/target handles for graph connections. */
export function Node(props: Node.Props<Record<string, unknown>> & { children: React.ReactNode }) {
	return (
		<>
			<div className={'flex h-full w-full items-center justify-center'}>{props.children}</div>

			{props.sourcePosition && (
				<xyFlow.Handle
					type="source"
					style={props.style}
					className={props.className}
					isConnectable={props.isConnectable}
					position={props.sourcePosition}
				/>
			)}
			{props.targetPosition && (
				<xyFlow.Handle
					type="target"
					style={props.style}
					className={props.className}
					isConnectable={props.isConnectable}
					position={props.targetPosition}
				/>
			)}
		</>
	)
}
