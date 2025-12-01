import type * as TanstackTable from '@tanstack/react-table'
import { Array, Match, Predicate } from 'effect'
import { Icon } from '#components/icon.tsx'
import { Select } from '#components/select.tsx'
import { renderValue, toSentenceCase } from '#lib/utils.tsx'
import { type ColumnFilter, getFilterFn } from './filters.tsx'

type DotNotation<T> = {
	[K in keyof T & (string | number)]: NonNullable<T[K]> extends object
		? `${K}` | `${K}.${DotNotation<NonNullable<T[K]>>}`
		: `${K}`
}[keyof T & (string | number)]

export type ColumnDef<TData> =
	| {
			hidden?: boolean
			header?: string
			enableGlobalFilter?: boolean
			accessorKey: DotNotation<TData>
	  }
	| {
			header?: string
			render: (row: TData) => React.ReactNode
	  }
	| {
			hidden?: boolean
			header?: string
			enableGlobalFilter?: boolean
			accessorFn: (row: TData) => string | boolean | number | Date | undefined
	  }

export function convertToTanstackColumns<TData>(columnDefs: ColumnDef<TData>[]) {
	return Array.map(columnDefs, (col, index) =>
		Match.value(col).pipe(
			Match.when(
				Predicate.hasProperty('accessorKey'),
				(col): TanstackTable.ColumnDef<TData, unknown> => ({
					enableHiding: true,
					enableSorting: true,
					id: col.header ? toSentenceCase(col.header) : toSentenceCase(col.accessorKey),
					accessorKey: col.accessorKey,
					header: col.header ? toSentenceCase(col.header) : toSentenceCase(col.accessorKey),
					cell: ({ getValue }) => renderValue(getValue()),
					enableGlobalFilter: col.enableGlobalFilter ?? true,
					filterFn: (row, columnId, filter: ColumnFilter) => getFilterFn(row.getValue(columnId), filter)
				})
			),
			Match.when(
				Predicate.hasProperty('accessorFn'),
				(col): TanstackTable.ColumnDef<TData, unknown> => ({
					enableHiding: !!col.header,
					enableSorting: !!col.header,
					id: col.header ?? `render_${index}`,
					accessorFn: col.accessorFn,
					header: toSentenceCase(col.header ?? ''),
					cell: ({ getValue }) => renderValue(getValue()),
					enableGlobalFilter: col.enableGlobalFilter ?? true,
					filterFn: (row, columnId, filter: ColumnFilter) => getFilterFn(row.getValue(columnId), filter)
				})
			),
			Match.when(
				Predicate.hasProperty('render'),
				(col): TanstackTable.ColumnDef<TData, unknown> => ({
					size: 1,
					enableHiding: !!col.header,
					enableColumnFilter: false,
					enableGlobalFilter: false,
					id: col.header ?? `render_${index}`,
					header: toSentenceCase(col.header ?? ''),
					cell: ({ row }) => renderValue(col.render(row.original))
				})
			),
			Match.orElseAbsurd
		)
	)
}

export function getInitialColumnVisibility<TData>(
	columnDefs: ColumnDef<TData>[],
	columns: TanstackTable.ColumnDef<TData, unknown>[]
) {
	const visibility: TanstackTable.VisibilityState = {}
	columnDefs.forEach((col, index) => {
		if (!Predicate.hasProperty(col, 'hidden') || col.hidden !== true) return
		const tanstackColumn = columns[index]
		if (tanstackColumn?.id) visibility[tanstackColumn.id] = false
	})
	return visibility
}

export declare namespace ColumnsVisibility {
	export type Props<TData> = {
		columns: TanstackTable.Column<TData>[]
		className?: string
	}
}

export function ColumnsVisibility<TData>(props: ColumnsVisibility.Props<TData>) {
	return (
		<Select label={<Icon.Prefix name="view_column">columns</Icon.Prefix>} className={props.className}>
			{Array.map(props.columns, column => (
				<Select.Item
					key={column.id}
					onClick={() => column.toggleVisibility()}
					selected={column.getIsVisible()}
					children={toSentenceCase(column.id)}
				/>
			))}
		</Select>
	)
}
