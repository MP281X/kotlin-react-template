import type { PaginationState } from '@tanstack/react-table'
import { Array } from 'effect'
import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Button } from '#components/ui/button.tsx'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '#components/ui/dropdown-menu.tsx'

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
			<div className="flex items-center gap-2 text-muted-foreground text-sm">
				<span>{props.totalItems} items</span>
				<span>-</span>
				<span>
					Page {props.pagination.pageIndex + 1} of {props.pageCount}
				</span>
			</div>
			<div className="flex items-center gap-2">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="sm">
							{props.pagination.pageSize} per page
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{Array.map([50, 100, 150], size => (
							<DropdownMenuItem key={size} onClick={() => handlePageSizeChange(size)}>
								{size} per page
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>

				<Button variant="outline" size="icon-sm" onClick={() => handlePageChange(0)} disabled={!canPreviousPage}>
					<ChevronFirstIcon className="size-4" />
				</Button>
				<Button
					variant="outline"
					size="icon-sm"
					onClick={() => handlePageChange(props.pagination.pageIndex - 1)}
					disabled={!canPreviousPage}
				>
					<ChevronLeftIcon className="size-4" />
				</Button>
				<Button
					variant="outline"
					size="icon-sm"
					onClick={() => handlePageChange(props.pagination.pageIndex + 1)}
					disabled={!canNextPage}
				>
					<ChevronRightIcon className="size-4" />
				</Button>
				<Button
					variant="outline"
					size="icon-sm"
					onClick={() => handlePageChange(props.pageCount - 1)}
					disabled={!canNextPage}
				>
					<ChevronLastIcon className="size-4" />
				</Button>
			</div>
		</nav>
	)
}
