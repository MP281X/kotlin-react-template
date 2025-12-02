import type * as TanstackTable from '@tanstack/react-table'
import { FilterXIcon, ListFilterIcon, SearchIcon } from 'lucide-react'
import { Button } from '#components/ui/button.tsx'
import { ColumnsVisibility } from './columns.tsx'
import type { useFilters } from './filters.tsx'

export declare namespace Toolbar {
	export type Props<TData> = {
		filters: ReturnType<typeof useFilters>
		toggleableColumns: TanstackTable.Column<TData>[]
	}
}

export function Toolbar<TData>(props: Toolbar.Props<TData>) {
	return (
		<div className="flex items-center justify-center gap-2">
			<Button
				variant={props.filters.filterMode === 'search' ? 'default' : 'outline'}
				size="sm"
				onClick={() => props.filters.toggleFilterMode('search')}
			>
				<SearchIcon className="size-4" />
				<span>Global search</span>
			</Button>
			<Button
				variant={props.filters.filterMode === 'filter' ? 'default' : 'outline'}
				size="sm"
				onClick={() => props.filters.toggleFilterMode('filter')}
			>
				<ListFilterIcon className="size-4" />
				<span>Advanced filters</span>
			</Button>

			<div className="flex-1" />

			<ColumnsVisibility columns={props.toggleableColumns} />

			<Button
				variant="outline"
				size="sm"
				onClick={props.filters.clearAllFilters}
				disabled={!props.filters.hasActiveFilters()}
			>
				<FilterXIcon className="size-4" />
				<span>Clear filters</span>
			</Button>
		</div>
	)
}
