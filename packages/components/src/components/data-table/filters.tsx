import type * as TanstackTable from '@tanstack/react-table'
import { Array, Option, pipe, String, Struct } from 'effect'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '#components/ui/button.tsx'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '#components/ui/dropdown-menu.tsx'

import { Input } from '#components/ui/input.tsx'
import { toSentenceCase } from '#lib/utils.tsx'

declare namespace FilterLogic {
	export type FilterOperator = keyof typeof FILTERS
	export type FilterMode = 'search' | 'filter' | undefined
	export type ColumnFilter = {
		id: string
		column: string
		operator: FilterOperator
		value: string
	}
}

/** Available filter operations for column filtering (case-insensitive). */
const FILTERS = {
	equals: (value: string, search: string) => value === search,
	contains: (value: string, search: string) => String.toLowerCase(value).includes(String.toLowerCase(search)),
	'starts with': (value: string, search: string) => String.toLowerCase(value).startsWith(String.toLowerCase(search)),
	'ends with': (value: string, search: string) => String.toLowerCase(value).endsWith(String.toLowerCase(search)),
	'does not contain': (value: string, search: string) => !String.toLowerCase(value).includes(String.toLowerCase(search))
} as const

export type FilterOperator = FilterLogic.FilterOperator
export type FilterMode = FilterLogic.FilterMode
export type ColumnFilter = FilterLogic.ColumnFilter

export function getFilterFn(value: unknown, filter: ColumnFilter) {
	return FILTERS[filter.operator](globalThis.String(value ?? ''), filter.value)
}

/** Manages filter state for both global search and per-column advanced filters. */
export function useFilters() {
	const [filterMode, setFilterMode] = useState<FilterMode>()
	const [globalFilter, setGlobalFilter] = useState('')
	const [advancedFilters, setAdvancedFilters] = useState<ColumnFilter[]>([])

	function toggleFilterMode(mode: FilterMode) {
		setFilterMode(current => {
			const newMode = current === mode ? undefined : mode
			if (newMode === 'search') setAdvancedFilters([])
			else if (newMode === 'filter') setGlobalFilter('')
			return newMode
		})
	}

	function addFilter(column: string) {
		const newFilter: ColumnFilter = {
			id: crypto.randomUUID(),
			column,
			operator: Option.getOrThrow(Array.head(Struct.keys(FILTERS))),
			value: ''
		}
		setAdvancedFilters(Array.append(newFilter))
	}

	function removeFilter(filterId: string) {
		setAdvancedFilters(Array.filter(filter => filter.id !== filterId))
	}

	function updateFilter(filterId: string, updates: Partial<ColumnFilter>) {
		setAdvancedFilters(Array.map(filter => (filter.id === filterId ? { ...filter, ...updates } : filter)))
	}

	function clearAllFilters() {
		setGlobalFilter('')
		setAdvancedFilters([])
		setFilterMode(undefined)
	}

	function hasActiveFilters() {
		return (
			filterMode !== undefined ||
			String.isNonEmpty(globalFilter) ||
			advancedFilters.some(filter => String.isNonEmpty(filter.value))
		)
	}

	const columnFilters = pipe(
		advancedFilters,
		Array.filter(filter => String.isNonEmpty(filter.value)),
		Array.map(filter => ({ id: filter.column, value: filter }))
	)

	return {
		filterMode,
		globalFilter,
		advancedFilters,
		columnFilters,
		toggleFilterMode,
		setGlobalFilter,
		addFilter,
		removeFilter,
		updateFilter,
		clearAllFilters,
		hasActiveFilters
	}
}

declare namespace SearchFilter {
	type Props = {
		value: string
		onChange: (value: string) => void
	}
}

function SearchFilter(props: SearchFilter.Props) {
	return (
		<Input
			name="Search across all columns"
			value={props.value}
			onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.onChange(e.target.value)}
			className="w-full"
			placeholder="Search..."
		/>
	)
}

declare namespace AdvancedFilters {
	type Props<TData> = {
		columns: (keyof TData)[]
		filters: ColumnFilter[]
		onAddFilter: (column: string) => void
		onRemoveFilter: (filterId: string) => void
		onUpdateFilter: (filterId: string, updates: Partial<ColumnFilter>) => void
	}
}

function AdvancedFilters<TData>(props: AdvancedFilters.Props<TData>) {
	return (
		<div className="space-y-2 rounded-md border bg-card p-3">
			{Array.map(props.filters, (filter, index) => (
				<div key={filter.id} className="flex items-center gap-2">
					<span className="w-12 text-left text-muted-foreground text-sm">{index === 0 ? 'where' : 'and'}</span>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="min-w-[120px] justify-between">
								{toSentenceCase(filter.column)}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							{Array.map(props.columns, col => (
								<DropdownMenuItem
									key={globalThis.String(col)}
									onClick={() => props.onUpdateFilter(filter.id, { column: globalThis.String(col) })}
								>
									{toSentenceCase(globalThis.String(col))}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="min-w-[140px] justify-between">
								{filter.operator}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							{Array.map(['equals', 'contains', 'starts with', 'ends with', 'does not contain'] as const, op => (
								<DropdownMenuItem key={op} onClick={() => props.onUpdateFilter(filter.id, { operator: op })}>
									{op}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					<Input
						name="value"
						value={filter.value}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							props.onUpdateFilter(filter.id, { value: e.target.value })
						}
						className="flex-1"
						placeholder="Value..."
					/>

					<Button variant="ghost" size="icon-sm" onClick={() => props.onRemoveFilter(filter.id)}>
						<TrashIcon className="size-4" />
					</Button>
				</div>
			))}

			<Button
				variant="ghost"
				size="sm"
				onClick={() => props.onAddFilter(props.columns.length ? globalThis.String(props.columns[0]) : '')}
			>
				<PlusIcon className="size-4" />
				<span>Add filter</span>
			</Button>
		</div>
	)
}

export declare namespace Filters {
	export type Props<TData> = {
		table: TanstackTable.Table<TData>
		filters: ReturnType<typeof useFilters>
	}
}

/** Renders either global search input or advanced column filters based on filter mode. */
export function Filters<TData>(props: Filters.Props<TData>) {
	if (!props.filters.filterMode) return null

	if (props.filters.filterMode === 'search') {
		return <SearchFilter value={props.filters.globalFilter} onChange={props.filters.setGlobalFilter} />
	}

	const toggleableColumns = props.table.getAllLeafColumns().filter(col => col.getCanFilter())
	const columnKeys = toggleableColumns.map(col => col.id as keyof TData)

	return (
		<AdvancedFilters
			columns={columnKeys}
			filters={props.filters.advancedFilters}
			onAddFilter={props.filters.addFilter}
			onRemoveFilter={props.filters.removeFilter}
			onUpdateFilter={props.filters.updateFilter}
		/>
	)
}
