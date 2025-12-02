import * as TanstackTable from '@tanstack/react-table'
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '#components/ui/table.tsx'
import { cn } from '#lib/utils.tsx'

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
	return <Table className={props.className}>{props.children}</Table>
}

BaseTable.Header = function BaseTableHeader(props: BaseTable.Header.Props) {
	return <TableHeader className={props.className}>{props.children}</TableHeader>
}

BaseTable.Body = function BaseTableBody(props: BaseTable.Body.Props) {
	return <TableBody className={props.className}>{props.children}</TableBody>
}

BaseTable.Row = function BaseTableRow(props: BaseTable.Row.Props) {
	return (
		<TableRow className={props.className} style={props.style}>
			{props.children}
		</TableRow>
	)
}

BaseTable.Head = function BaseTableHead<TData>(props: any) {
	const header = props.header as TanstackTable.Header<TData, unknown>

	const dir = header.column.getIsSorted()
	const canSort = header.column.getCanSort()
	const columnSize = header.column.columnDef.size

	return (
		<TableHead
			className={cn(
				'sticky top-0 z-10 bg-card',
				canSort && 'cursor-pointer select-none hover:bg-accent',
				columnSize === 1 && 'w-px whitespace-nowrap',
				props.className
			)}
			onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
		>
			<div className="flex items-center justify-between gap-1">
				{TanstackTable.flexRender(header.column.columnDef.header, header.getContext())}
				{canSort && (
					<>
						{dir === 'asc' && <ArrowUpIcon className="size-4" />}
						{dir === 'desc' && <ArrowDownIcon className="size-4" />}
						{!dir && <ChevronsUpDownIcon className="size-4 opacity-50" />}
					</>
				)}
			</div>
		</TableHead>
	)
}

BaseTable.Cell = function BaseTableCell(props: BaseTable.Cell.Props) {
	return (
		<TableCell className={cn(props.columnSize === 1 && 'w-px whitespace-nowrap', props.className)}>
			<div className="flex items-center gap-2">{props.children}</div>
		</TableCell>
	)
}
