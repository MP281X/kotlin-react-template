import { cn } from '#lib/cn.tsx'

export declare namespace Icon {
	export type Names =
		| 'add'
		| 'dns'
		| 'lan'
		| 'edit'
		| 'room'
		| 'host'
		| 'cable'
		| 'check'
		| 'close'
		| 'group'
		| 'label'
		| 'print'
		| 'delete'
		| 'logout'
		| 'policy'
		| 'search'
		| 'devices'
		| 'mystery'
		| 'tenancy'
		| 'storage'
		| 'article'
		| 'download'
		| 'last_page'
		| 'first_page'
		| 'hard_drive'
		| 'visibility'
		| 'location_on'
		| 'inventory_2'
		| 'filter_list'
		| 'unfold_more'
		| 'upload_file'
		| 'view_column'
		| 'chevron_left'
		| 'chevron_right'
		| 'library_books'
		| 'report_problem'
		| 'account_circle'
		| 'progress_activity'
		| 'keyboard_arrow_up'
		| 'keyboard_arrow_down'

	export type Props = {
		name: Names
		className?: string
	}

	export namespace Label {
		export type Props = {
			name: Names
			children: React.ReactNode
			className?: string
		}
	}
}

export function Icon(props: Icon.Props) {
	return <span className={cn('align-bottom font-family-icons text-[0.8em]', props.className)}>{props.name}</span>
}

Icon.Prefix = (props: Icon.Label.Props) => {
	return (
		<span className="flex items-center gap-2">
			<Icon name={props.name} />
			<span>{props.children}</span>
		</span>
	)
}

Icon.Suffix = (props: Icon.Label.Props) => {
	return (
		<span className={cn('flex items-center justify-between gap-2', props.className)}>
			<span>{props.children}</span>
			<Icon name={props.name} />
		</span>
	)
}
