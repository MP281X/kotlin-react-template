import { useAtomSet } from '@effect-atom/atom-react'
import { eq, useLiveSuspenseQuery } from '@tanstack/react-db'
import { createFileRoute } from '@tanstack/react-router'
import { Record } from 'effect'
import { CheckCircle2Icon, CircleDotIcon, CircleIcon, MoreHorizontalIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import { AtomRuntime } from '#lib/runtime.ts'
import { Form, useForm } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { errorToast, infoToast } from '@/components/ui/sonner'
import { cn, formatTimestamp } from '@/components/utils'
import { rpc, sync } from '@/rpc'

export const Route = createFileRoute('/(home)/realtime/')({ component: Page })

const createTaskAtom = AtomRuntime.fn(rpc.createTask)
const updateTaskAtom = AtomRuntime.fn(rpc.updateTask)
const deleteTaskAtom = AtomRuntime.fn(rpc.deleteTask)

type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'
type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'

const STATUS_CONFIG = {
	TODO: { label: 'To Do', icon: CircleIcon, color: 'text-muted-foreground' },
	IN_PROGRESS: { label: 'In Progress', icon: CircleDotIcon, color: 'text-primary' },
	DONE: { label: 'Done', icon: CheckCircle2Icon, color: 'text-green-500' }
} satisfies globalThis.Record<TaskStatus, { label: string; icon: React.ElementType; color: string }>

const PRIORITY_CONFIG = {
	LOW: { label: 'Low', color: 'bg-muted text-muted-foreground' },
	MEDIUM: { label: 'Medium', color: 'bg-primary/10 text-primary' },
	HIGH: { label: 'High', color: 'bg-destructive/10 text-destructive' }
} satisfies globalThis.Record<TaskPriority, { label: string; color: string }>

type Task = sync.Table['tasks']

function Page() {
	const [isCreating, setIsCreating] = useState(false)

	const { data: tasks } = useLiveSuspenseQuery(q =>
		q
			.from({ tasks: sync.tasks })
			.where(({ tasks }) => eq(tasks.deleted, false))
			.orderBy(({ tasks }) => tasks.createdAt, 'desc')
	)

	const todoTasks = tasks.filter(t => t.status === 'TODO')
	const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS')
	const doneTasks = tasks.filter(t => t.status === 'DONE')

	return (
		<div className="flex h-full flex-col gap-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-semibold text-xl">Real-time Tasks</h1>
					<p className="text-muted-foreground text-sm">
						{tasks.length} tasks • Changes sync instantly across all clients
					</p>
				</div>
				<Button onClick={() => setIsCreating(true)} disabled={isCreating}>
					<PlusIcon />
					Add Task
				</Button>
			</div>

			{isCreating && <CreateTaskForm onClose={() => setIsCreating(false)} />}

			<div className="grid min-h-0 flex-1 grid-cols-3 gap-4 overflow-hidden">
				<TaskColumn status="TODO" tasks={todoTasks} />
				<TaskColumn status="IN_PROGRESS" tasks={inProgressTasks} />
				<TaskColumn status="DONE" tasks={doneTasks} />
			</div>
		</div>
	)
}

function CreateTaskForm({ onClose }: { onClose: () => void }) {
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
			onClose()
		}
	})

	return (
		<Card className="fade-in slide-in-from-top-2 animate-in duration-200">
			<CardHeader className="pb-4">
				<CardTitle className="text-base">New Task</CardTitle>
				<CardDescription>Create a new task that syncs in real-time</CardDescription>
			</CardHeader>
			<CardContent>
				<Form form={form} className="flex-col items-stretch gap-4">
					<form.AppField name="title" children={field => <field.TextField />} />
					<form.AppField name="description" children={field => <field.TextAreaField />} />
					<div className="flex justify-end gap-2">
						<Button variant="outline" onClick={onClose}>
							Cancel
						</Button>
						<form.SubmitButton>Create Task</form.SubmitButton>
					</div>
				</Form>
			</CardContent>
		</Card>
	)
}

function TaskColumn({ status, tasks }: { status: TaskStatus; tasks: Task[] }) {
	const config = STATUS_CONFIG[status]
	const Icon = config.icon

	return (
		<div className="flex flex-col gap-3 overflow-hidden">
			<div className="flex items-center gap-2 px-1">
				<Icon className={cn('size-4', config.color)} />
				<span className="font-medium text-sm">{config.label}</span>
				<span className="ml-auto text-muted-foreground text-xs">{tasks.length}</span>
			</div>
			<div className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
				{tasks.map(task => (
					<TaskCard key={task.id} task={task} />
				))}
				{tasks.length === 0 && (
					<div className="flex flex-1 items-center justify-center rounded-md border border-dashed p-4">
						<span className="text-muted-foreground text-xs">No tasks</span>
					</div>
				)}
			</div>
		</div>
	)
}

function TaskCard({ task }: { task: Task }) {
	const updateTask = useAtomSet(updateTaskAtom, { mode: 'promise' })
	const deleteTask = useAtomSet(deleteTaskAtom, { mode: 'promise' })

	const priorityConfig = PRIORITY_CONFIG[task.priority]

	const handleUpdate = async (data: { status?: TaskStatus; priority?: TaskPriority }) => {
		try {
			await updateTask({ id: task.id, ...data })
		} catch (e) {
			errorToast(e)
		}
	}

	const handleDelete = async () => {
		try {
			await deleteTask({ id: task.id })
			infoToast('Task deleted')
		} catch (e) {
			errorToast(e)
		}
	}

	return (
		<Card className="group gap-3 py-3 transition-shadow hover:shadow-md">
			<CardContent className="flex flex-col gap-2 px-3 py-0">
				<div className="flex items-start justify-between gap-2">
					<span className="font-medium text-sm leading-tight">{task.title}</span>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon-sm"
								className="-mr-1 -mt-1 opacity-0 transition-opacity group-hover:opacity-100"
							>
								<MoreHorizontalIcon className="size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem disabled className="text-muted-foreground text-xs">
								Move to
							</DropdownMenuItem>
							{Record.collect(STATUS_CONFIG, (key, { label, icon: StatusIcon }) => (
								<DropdownMenuItem
									key={key}
									disabled={task.status === key}
									onClick={() => handleUpdate({ status: key })}
								>
									<StatusIcon className="size-4" />
									{label}
								</DropdownMenuItem>
							))}
							<DropdownMenuSeparator />
							<DropdownMenuItem disabled className="text-muted-foreground text-xs">
								Priority
							</DropdownMenuItem>
							{Record.collect(PRIORITY_CONFIG, (key, { label }) => (
								<DropdownMenuItem
									key={key}
									disabled={task.priority === key}
									onClick={() => handleUpdate({ priority: key })}
								>
									{label}
								</DropdownMenuItem>
							))}
							<DropdownMenuSeparator />
							<DropdownMenuItem variant="destructive" onClick={handleDelete}>
								<Trash2Icon className="size-4" />
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{task.description && (
					<p className="line-clamp-2 text-muted-foreground text-xs leading-relaxed">{task.description}</p>
				)}

				<div className="flex items-center gap-2">
					<span className={cn('rounded-sm px-1.5 py-0.5 text-xs', priorityConfig.color)}>{priorityConfig.label}</span>
					<span className="ml-auto text-muted-foreground text-xs">{formatTimestamp(task.createdAt)}</span>
				</div>
			</CardContent>
		</Card>
	)
}
