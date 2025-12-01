import * as TanstackTable from '@tanstack/react-table'
import { Icon } from '#components/icon.tsx'
import { cn } from '#lib/cn.tsx'

export declare namespace BaseTable {
	export type Props = { children?: React.ReactNode; className?: string }

	export namespace Header {
		export type Props = { children?: React.ReactNode; className?: string }
	}

	export namespace Body {
		export type Props = { children?: React.ReactNode; className?: string }
	}

	export namespace Row {
		export type Props = { className?: string; style?: React.CSSProperties; children: React.ReactNode }
	}

	export namespace Head {
		export type Props<TData> =
			| { header: TanstackTable.Header<TData, unknown>; className?: string; sortable?: boolean }
			| { children?: React.ReactNode; className?: string }
	}

	export namespace Cell {
		export type Props = { children?: React.ReactNode; className?: string; columnSize?: number }
	}
}

export function BaseTable(props: BaseTable.Props) {
	return <table {...props} className={cn('w-full', props.className)} />
}

BaseTable.Header = function TableHeader(props: BaseTable.Header.Props) {
	return <thead {...props} />
}

BaseTable.Body = function TableBody(props: BaseTable.Body.Props) {
	return <tbody {...props} />
}

BaseTable.Row = function TableRow(props: BaseTable.Row.Props) {
	return <tr {...props} className={cn('group', props.className)} />
}

BaseTable.Head = function TableHead<TData>(props: any) {
	const header = props.header as TanstackTable.Header<TData, unknown>

	const dir = header.column.getIsSorted()
	const canSort = header.column.getCanSort()
	const columnSize = header.column.columnDef.size

	return (
		<th
			className={cn(
				'sticky top-0 z-10 bg-muted px-4 py-2 font-normal',
				'border-border border-b-2 border-l first:border-l-0 last:border-r-0',
				canSort && 'hover:bg-hover',
				columnSize === 1 && 'w-px whitespace-nowrap',
				props.className
			)}
			onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
		>
			<div className="flex items-center justify-between gap-1">
				{TanstackTable.flexRender(header.column.columnDef.header, header.getContext())}
				{canSort && (
					<>
						{dir === 'asc' && <Icon name="keyboard_arrow_up" />}
						{dir === 'desc' && <Icon name="keyboard_arrow_down" />}
						{!dir && <Icon name="unfold_more" className="opacity-50" />}
					</>
				)}
			</div>
		</th>
	)
}

BaseTable.Cell = function TableCell(props: BaseTable.Cell.Props) {
	return (
		<td
			className={cn(
				'border-border border-b border-l p-4 py-1 first:border-l-0 last:border-r-0',
				props.columnSize === 1 && 'w-px whitespace-nowrap',
				props.className
			)}
		>
			<div className="flex items-center gap-2 text-lg">{props.children}</div>
		</td>
	)
}
