import type * as TanstackTable from '@tanstack/react-table'
import { Array, Option, pipe, String, Struct } from 'effect'
import { useState } from 'react'
import { Button } from '#components/button.tsx'
import { Field } from '#components/field.tsx'
import { Icon } from '#components/icon.tsx'
import { Select } from '#components/select.tsx'
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
	return FILTERS[filter.operator](global.String(value ?? ''), filter.value)
}

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
		<Field>
			<Field.Label floating children="Search across all columns" />
			<Field.Input
				name="Search across all columns"
				value={props.value}
				onChange={e => props.onChange(e.target.value)}
				className="w-full"
			/>
		</Field>
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
		<div className="space-y-2 rounded border-2 border-border bg-foreground p-2">
			{Array.map(props.filters, (filter, index) => (
				<div key={filter.id} className="flex items-center gap-2 pb-2">
					<span className="w-12 text-left text-sm text-text-muted">{index === 0 ? 'where' : 'and'}</span>
					<Select label={toSentenceCase(filter.column)}>
						{Array.map(props.columns, col => (
							<Select.Item
								key={global.String(col)}
								selected={col === filter.column}
								children={toSentenceCase(global.String(col))}
								onClick={() => props.onUpdateFilter(filter.id, { column: global.String(col) })}
							/>
						))}
					</Select>
					<Select label={filter.operator}>
						{Array.map(['equals', 'contains', 'starts with', 'ends with', 'does not contain'] as const, op => (
							<Select.Item
								key={op}
								children={op}
								selected={op === filter.operator}
								onClick={() => props.onUpdateFilter(filter.id, { operator: op })}
							/>
						))}
					</Select>
					<Field.Input
						name="value"
						value={filter.value}
						onChange={e => props.onUpdateFilter(filter.id, { value: e.target.value })}
						className="w-full flex-1 border-2 border-border bg-foreground px-2 py-1"
					/>
					<Button onClick={() => props.onRemoveFilter(filter.id)}>
						<Icon name="delete" />
					</Button>
				</div>
			))}

			<Button.Unstyled
				onClick={() => props.onAddFilter(props.columns.length ? global.String(props.columns[0]) : '')}
				className="text-lg"
				children={<Icon.Prefix name="add">Add filter</Icon.Prefix>}
			/>
		</div>
	)
}

export declare namespace Filters {
	export type Props<TData> = {
		table: TanstackTable.Table<TData>
		filters: ReturnType<typeof useFilters>
	}
}

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
