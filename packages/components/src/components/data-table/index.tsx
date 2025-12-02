import * as TanstackTable from '@tanstack/react-table'
import { Array, Boolean } from 'effect'
import { InboxIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { type ColumnDef, convertToTanstackColumns, getInitialColumnVisibility } from './columns.tsx'
import { Filters, useFilters } from './filters.tsx'
import { Pagination } from './pagination.tsx'
import { BaseTable } from './tablePrimitives.tsx'
import { Toolbar } from './toolbar.tsx'

export declare namespace Table {
	export type Props<TData> = {
		data: TData[]
		columns: ColumnDef<TData>[]
		rowProps?: (row: TData) => Partial<Omit<BaseTable.Row.Props, 'children'>>
	}

	export namespace Actions {
		export type Props = {
			disabled?: boolean

			link?: React.ReactNode
			view?: (props: { isOpen: boolean; onClose: () => void }) => React.ReactNode
			edit?: (props: { isOpen: boolean; onClose: () => void }) => React.ReactNode

			onDownload?: () => unknown | Promise<unknown>
			onDelete?: () => unknown | Promise<unknown>
		}
	}
}

/** Provides a full-featured data table with sorting, filtering, pagination, and column visibility. */
export function Table<TData>(props: Table.Props<TData>) {
	'use no memo'

	const columns = useMemo(() => convertToTanstackColumns(props.columns), [props.columns])

	const initialColumnVisibility = useMemo(
		() => getInitialColumnVisibility(props.columns, columns),
		[props.columns, columns]
	)

	const filters = useFilters()
	const [sorting, setSorting] = useState<TanstackTable.SortingState>([])
	const [pagination, setPagination] = useState<TanstackTable.PaginationState>({ pageIndex: 0, pageSize: 50 })
	const [columnVisibility, setColumnVisibility] = useState<TanstackTable.VisibilityState>(initialColumnVisibility)

	const tanstackTable = TanstackTable.useReactTable({
		data: props.data,
		columns,
		onSortingChange: setSorting,
		onGlobalFilterChange: filters.setGlobalFilter,
		onPaginationChange: setPagination,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: TanstackTable.getCoreRowModel(),
		getSortedRowModel: TanstackTable.getSortedRowModel(),
		getFilteredRowModel: TanstackTable.getFilteredRowModel(),
		getPaginationRowModel: TanstackTable.getPaginationRowModel(),
		state: {
			sorting,
			columnFilters: filters.columnFilters,
			globalFilter: filters.globalFilter,
			pagination,
			columnVisibility
		}
	})

	const toggleableColumns = tanstackTable.getAllLeafColumns().filter(col => col.getCanHide())

	return (
		<div className="flex h-full w-full flex-col gap-4 overflow-hidden">
			<Toolbar filters={filters} toggleableColumns={toggleableColumns} />

			<Filters table={tanstackTable} filters={filters} />

			<div className="flex flex-1 flex-col overflow-hidden rounded-md border">
				{Boolean.match(Array.isEmptyArray(tanstackTable.getRowModel().rows), {
					onTrue: () => (
						<>
							<div className="overflow-auto outline-none">
								<BaseTable>
									<BaseTable.Header>
										{tanstackTable.getHeaderGroups().map(headerGroup => (
											<BaseTable.Row key={headerGroup.id}>
												{headerGroup.headers.map(header => (
													<BaseTable.Head key={header.id} header={header} />
												))}
											</BaseTable.Row>
										))}
									</BaseTable.Header>
								</BaseTable>
							</div>
							<div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
								<InboxIcon className="size-10 stroke-1" />
								<span className="text-sm">No results found</span>
							</div>
						</>
					),
					onFalse: () => (
						<div className="flex-1 overflow-auto outline-none">
							<BaseTable>
								<BaseTable.Header>
									{tanstackTable.getHeaderGroups().map(headerGroup => (
										<BaseTable.Row key={headerGroup.id}>
											{headerGroup.headers.map(header => (
												<BaseTable.Head key={header.id} header={header} />
											))}
										</BaseTable.Row>
									))}
								</BaseTable.Header>

								<BaseTable.Body>
									{tanstackTable.getRowModel().rows.map(row => (
										<BaseTable.Row key={row.id} {...props.rowProps?.(row.original)}>
											{row.getVisibleCells().map(cell => (
												<BaseTable.Cell key={cell.id} columnSize={cell.column.columnDef.size}>
													{TanstackTable.flexRender(cell.column.columnDef.cell, cell.getContext())}
												</BaseTable.Cell>
											))}
										</BaseTable.Row>
									))}
								</BaseTable.Body>
							</BaseTable>
						</div>
					)
				})}
			</div>

			<Pagination
				pagination={pagination}
				onPaginationChange={setPagination}
				pageCount={tanstackTable.getPageCount()}
				totalItems={tanstackTable.getFilteredRowModel().rows.length}
			/>
		</div>
	)
}
