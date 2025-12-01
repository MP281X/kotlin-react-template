import type * as TanstackTable from '@tanstack/react-table'
import { Button } from '#components/button.tsx'
import { Icon } from '#components/icon.tsx'
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
				onClick={() => props.filters.toggleFilterMode('search')}
				data-active={props.filters.filterMode === 'search'}
			>
				<Icon.Prefix name="search">global search</Icon.Prefix>
			</Button>
			<Button
				onClick={() => props.filters.toggleFilterMode('filter')}
				data-active={props.filters.filterMode === 'filter'}
			>
				<Icon.Prefix name="filter_list">advanced filters</Icon.Prefix>
			</Button>

			<div className="w-full" />

			<ColumnsVisibility columns={props.toggleableColumns} />

			<Button onClick={props.filters.clearAllFilters} disabled={!props.filters.hasActiveFilters()}>
				<Icon.Prefix name="delete">clear filters</Icon.Prefix>
			</Button>
		</div>
	)
}
