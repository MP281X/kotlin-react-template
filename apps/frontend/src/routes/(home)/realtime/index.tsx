import { useAtomSet } from '@effect-atom/atom-react'
import { eq, useLiveSuspenseQuery } from '@tanstack/react-db'
import { createFileRoute } from '@tanstack/react-router'
import { CheckCircle2Icon, CircleDotIcon, CircleIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import { AtomRuntime } from '#lib/runtime.ts'
import { Form, useForm } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { errorToast, infoToast } from '@/components/ui/sonner'
import { cn } from '@/components/utils'
import { rpc, sync } from '@/rpc'

export const Route = createFileRoute('/(home)/realtime/')({ component: Page })

const createTaskAtom = AtomRuntime.fn(rpc.createTask)
const updateTaskAtom = AtomRuntime.fn(rpc.updateTask)
const deleteTaskAtom = AtomRuntime.fn(rpc.deleteTask)

const COLUMNS = [
	{ status: 'TODO', label: 'To Do', icon: CircleIcon, color: 'text-muted-foreground' },
	{ status: 'IN_PROGRESS', label: 'In Progress', icon: CircleDotIcon, color: 'text-primary' },
	{ status: 'DONE', label: 'Done', icon: CheckCircle2Icon, color: 'text-green-500' }
] as const

const NEXT_STATUS = { TODO: 'IN_PROGRESS', IN_PROGRESS: 'DONE', DONE: 'TODO' } as const
const NEXT_PRIORITY = { LOW: 'MEDIUM', MEDIUM: 'HIGH', HIGH: 'LOW' } as const
const PRIORITY_STYLE = {
	LOW: 'bg-muted text-muted-foreground hover:bg-muted/80',
	MEDIUM: 'bg-primary/10 text-primary hover:bg-primary/20',
	HIGH: 'bg-destructive/10 text-destructive hover:bg-destructive/20'
} as const

function Page() {
	const [isCreating, setIsCreating] = useState(false)

	const { data: tasks } = useLiveSuspenseQuery(q =>
		q
			.from({ tasks: sync.tasks })
			.where(({ tasks }) => eq(tasks.deleted, false))
			.orderBy(({ tasks }) => tasks.createdAt, 'desc')
	)

	return (
		<div className="flex h-full flex-col gap-4">
			<div className="flex items-center justify-between">
				<p className="text-muted-foreground text-sm">{tasks.length} tasks • syncs in real-time</p>
				<Button size="sm" onClick={() => setIsCreating(true)} disabled={isCreating}>
					<PlusIcon />
					Add
				</Button>
			</div>

			{isCreating && <CreateTaskForm onClose={() => setIsCreating(false)} />}

			<div className="grid min-h-0 flex-1 grid-cols-3 gap-4 overflow-hidden">
				{COLUMNS.map(col => (
					<Column key={col.status} {...col} tasks={tasks.filter(t => t.status === col.status)} />
				))}
			</div>
		</div>
	)
}

function CreateTaskForm(props: { onClose: () => void }) {
	const createTask = useAtomSet(createTaskAtom, { mode: 'promise' })

	const form = useForm({
		defaultValues: { title: '', description: '' },
		onSubmit: async ({ value }) => {
			await createTask({
				title: value.title,
				description: value.description || undefined,
				status: 'TODO',
				priority: 'MEDIUM'
			})
			infoToast('Task created')
			props.onClose()
		}
	})

	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="text-base">New Task</CardTitle>
				<CardDescription>Syncs instantly to all clients</CardDescription>
			</CardHeader>
			<CardContent>
				<Form form={form} className="flex-col items-stretch gap-3">
					<form.AppField name="title" children={field => <field.TextField />} />
					<form.AppField name="description" children={field => <field.TextAreaField />} />
					<div className="flex justify-end gap-2">
						<Button type="button" variant="outline" onClick={props.onClose}>
							Cancel
						</Button>
						<form.SubmitButton>Create</form.SubmitButton>
					</div>
				</Form>
			</CardContent>
		</Card>
	)
}

function Column(props: {
	status: string
	label: string
	icon: React.ComponentType<{ className?: string }>
	color: string
	tasks: sync.Table['tasks'][]
}) {
	return (
		<div className="flex flex-col gap-3 overflow-hidden">
			<div className="flex items-center gap-2 px-1">
				<props.icon className={cn('size-4', props.color)} />
				<span className="font-medium text-sm">{props.label}</span>
				<span className="ml-auto text-muted-foreground text-xs">{props.tasks.length}</span>
			</div>
			<div className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
				{props.tasks.length === 0 ? (
					<div className="flex flex-1 items-center justify-center rounded-md border border-dashed p-4">
						<span className="text-muted-foreground text-xs">No tasks</span>
					</div>
				) : (
					props.tasks.map(task => <TaskCard key={task.id} task={task} />)
				)}
			</div>
		</div>
	)
}

function TaskCard(props: { task: sync.Table['tasks'] }) {
	const updateTask = useAtomSet(updateTaskAtom, { mode: 'promise' })
	const deleteTask = useAtomSet(deleteTaskAtom, { mode: 'promise' })

	return (
		<Card className="group gap-2 py-2">
			<CardContent className="flex flex-col gap-2 px-3 py-0">
				<div className="flex items-start justify-between gap-2">
					<button
						type="button"
						className="text-left font-medium text-sm leading-tight hover:underline"
						onClick={() => updateTask({ id: props.task.id, status: NEXT_STATUS[props.task.status] }).catch(errorToast)}
					>
						{props.task.title}
					</button>
					<Button
						variant="ghost"
						size="icon-sm"
						className="-mt-1 -mr-1 opacity-0 transition-opacity group-hover:opacity-100"
						onClick={() => deleteTask({ id: props.task.id }).catch(errorToast)}
					>
						<Trash2Icon className="size-4" />
					</Button>
				</div>

				{props.task.description && (
					<p className="line-clamp-2 text-muted-foreground text-xs">{props.task.description}</p>
				)}

				<button
					type="button"
					className={cn(
						'w-fit rounded-sm px-1.5 py-0.5 text-xs transition-colors',
						PRIORITY_STYLE[props.task.priority]
					)}
					onClick={() =>
						updateTask({ id: props.task.id, priority: NEXT_PRIORITY[props.task.priority] }).catch(errorToast)
					}
				>
					{props.task.priority}
				</button>
			</CardContent>
		</Card>
	)
}
