import type { PaginationState } from '@tanstack/react-table'
import { Array } from 'effect'
import { Button } from '#components/button.tsx'
import { Icon } from '#components/icon.tsx'
import { Select } from '#components/select.tsx'

export declare namespace Pagination {
	export type Props = {
		pagination: PaginationState
		onPaginationChange: (pagination: PaginationState) => void
		pageCount: number
		totalItems: number
	}
}

export function Pagination(props: Pagination.Props) {
	const canPreviousPage = props.pagination.pageIndex > 0
	const canNextPage = props.pagination.pageIndex < props.pageCount - 1

	function handlePageChange(pageIndex: number) {
		props.onPaginationChange({ ...props.pagination, pageIndex })
	}

	function handlePageSizeChange(pageSize: number) {
		props.onPaginationChange({ pageSize, pageIndex: 0 })
	}

	return (
		<nav className="flex items-center justify-between">
			<div className="flex items-center gap-2 text-sm text-text-muted">
				<span>{props.totalItems} items</span>
				<span>•</span>
				<span>
					Page {props.pagination.pageIndex + 1} of {props.pageCount}
				</span>
			</div>
			<div className="flex items-center gap-2">
				<Select label={props.pagination.pageSize}>
					{Array.map([50, 100, 150], size => (
						<Select.Item
							key={size}
							onClick={() => handlePageSizeChange(size)}
							selected={size === props.pagination.pageSize}
							children={size}
						/>
					))}
				</Select>
				<Button onClick={() => handlePageChange(0)} disabled={!canPreviousPage}>
					<Icon name="first_page" />
				</Button>
				<Button onClick={() => handlePageChange(props.pagination.pageIndex - 1)} disabled={!canPreviousPage}>
					<Icon name="chevron_left" />
				</Button>
				<Button onClick={() => handlePageChange(props.pagination.pageIndex + 1)} disabled={!canNextPage}>
					<Icon name="chevron_right" />
				</Button>
				<Button onClick={() => handlePageChange(props.pageCount - 1)} disabled={!canNextPage}>
					<Icon name="last_page" />
				</Button>
			</div>
		</nav>
	)
}
