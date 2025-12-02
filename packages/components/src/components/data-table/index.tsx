import * as TanstackTable from '@tanstack/react-table'
import { DownloadIcon, EditIcon, EyeIcon, TrashIcon } from 'lucide-react'
import * as Radix from 'radix-ui'
import { useMemo, useState } from 'react'
import { Button } from '#components/ui/button.tsx'
import { errorToast } from '#components/ui/sonner.tsx'
import { cn } from '#lib/utils.tsx'
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
		<div className="flex flex-1 items-center justify-end gap-1">
			{props.link && <div className="flex items-center justify-center">{props.link}</div>}

			{props.view && (
				<Button
					variant="ghost"
					size="icon-sm"
					onClick={() => setIsViewOpen(true)}
					className={cn(props.disabled && 'pointer-events-none opacity-50')}
				>
					<EyeIcon className="size-4" />
				</Button>
			)}

			{props.onDownload && (
				<Button
					variant="ghost"
					size="icon-sm"
					disabled={props.disabled}
					onClick={() => props.onDownload?.()}
					className={cn(props.disabled && 'pointer-events-none opacity-50')}
				>
					<DownloadIcon className="size-4" />
				</Button>
			)}

			{props.edit && (
				<Button
					variant="ghost"
					size="icon-sm"
					disabled={props.disabled}
					onClick={() => setIsEditOpen(true)}
					className={cn(props.disabled && 'pointer-events-none opacity-50')}
				>
					<EditIcon className="size-4" />
				</Button>
			)}

			{props.onDelete && (
				<Button
					variant="ghost"
					size="icon-sm"
					disabled={props.disabled}
					onClick={() => setIsDeleteOpen(true)}
					className={cn(props.disabled && 'pointer-events-none opacity-50')}
				>
					<TrashIcon className="size-4" />
				</Button>
			)}

			{isViewOpen && props.view?.({ isOpen: true, onClose: () => setIsViewOpen(false) })}
			{isEditOpen && props.edit?.({ isOpen: true, onClose: () => setIsEditOpen(false) })}

			<Radix.AlertDialog.Root open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
				<Radix.AlertDialog.Portal>
					<Radix.AlertDialog.Overlay className="data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=open]:animate-in" />
					<Radix.AlertDialog.Content className="data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 -translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in sm:rounded-lg">
						<Radix.AlertDialog.Title className="font-semibold text-lg">Confirm Delete</Radix.AlertDialog.Title>
						<Radix.AlertDialog.Description className="text-muted-foreground text-sm">
							Are you sure you want to delete this item? This action cannot be undone.
						</Radix.AlertDialog.Description>
						<div className="flex justify-end gap-2">
							<Radix.AlertDialog.Cancel asChild>
								<Button variant="outline">Cancel</Button>
							</Radix.AlertDialog.Cancel>
							<Radix.AlertDialog.Action asChild>
								<Button
									variant="destructive"
									onClick={async () => {
										try {
											await props.onDelete?.()
											setIsDeleteOpen(false)
										} catch (e) {
											errorToast(e)
										}
									}}
								>
									Delete
								</Button>
							</Radix.AlertDialog.Action>
						</div>
					</Radix.AlertDialog.Content>
				</Radix.AlertDialog.Portal>
			</Radix.AlertDialog.Root>
		</div>
	)
}
