import * as TanstackTable from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { Button } from '#components/button.tsx'
import { Dialog } from '#components/dialog.tsx'
import { Icon } from '#components/icon.tsx'
import { Toast } from '#components/toast.tsx'
import { BaseTable } from './baseTable.tsx'
import { type ColumnDef, convertToTanstackColumns, getInitialColumnVisibility } from './columns.tsx'
import { Filters, useFilters } from './filters.tsx'
import { Pagination } from './pagination.tsx'
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

			<div className="flex flex-1 flex-col overflow-hidden rounded-md border-2 border-border">
				<div className="flex-1 overflow-auto">
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

Table.Actions = (props: Table.Actions.Props) => {
	const [isViewOpen, setIsViewOpen] = useState(false)
	const [isEditOpen, setIsEditOpen] = useState(false)
	const [isDeleteOpen, setIsDeleteOpen] = useState(false)

	return (
		<div className="flex flex-1 items-center justify-end gap-1 text-3xl">
			{props.link && (
				<div className="flex items-center justify-center rounded-md px-1 hover:bg-accent disabled:text-text-disabled disabled:hover:bg-disabled">
					{props.link}
				</div>
			)}
			{props.view && (
				<Button.Unstyled
					onClick={() => setIsViewOpen(true)}
					className="rounded-md bg-transparent px-1 hover:bg-accent disabled:text-text-disabled disabled:hover:bg-disabled"
				>
					<Icon name="article" />
				</Button.Unstyled>
			)}
			{props.onDownload && (
				<Button.Unstyled
					disabled={props.disabled}
					onClick={props.onDownload}
					className="rounded-md bg-transparent px-1 hover:bg-accent disabled:text-text-disabled disabled:hover:bg-disabled"
				>
					<Icon name="download" />
				</Button.Unstyled>
			)}
			{props.edit && (
				<Button.Unstyled
					disabled={props.disabled}
					onClick={() => setIsEditOpen(true)}
					className="rounded-md bg-transparent px-1 hover:bg-accent disabled:text-text-disabled disabled:hover:bg-disabled"
				>
					<Icon name="edit" />
				</Button.Unstyled>
			)}
			{props.onDelete && (
				<Button.Unstyled
					disabled={props.disabled}
					onClick={() => setIsDeleteOpen(true)}
					className="rounded-md bg-transparent px-1 hover:bg-accent disabled:text-text-disabled disabled:hover:bg-disabled"
				>
					<Icon name="delete" />
				</Button.Unstyled>
			)}

			{isViewOpen && props.view?.({ isOpen: true, onClose: () => setIsViewOpen(false) })}
			{isEditOpen && props.edit?.({ isOpen: true, onClose: () => setIsEditOpen(false) })}

			{isDeleteOpen && (
				<Dialog open={true} onClose={() => setIsDeleteOpen(false)}>
					<Dialog.Title>Confirm Delete</Dialog.Title>
					<Dialog.Content children={[]} />
					<Dialog.Actions>
						<Button.Cancel onClick={() => setIsDeleteOpen(false)} children="Cancel" />
						<Button.Action
							className="bg-destructive hover:border-destructive hover:bg-destructive"
							onClick={async () => {
								try {
									await props.onDelete?.()
									setIsDeleteOpen(false)
								} catch (e) {
									Toast.error(e)
								}
							}}
							children="Delete"
						/>
					</Dialog.Actions>
				</Dialog>
			)}
		</div>
	)
}
