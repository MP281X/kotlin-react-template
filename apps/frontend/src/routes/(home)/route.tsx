import { Result, useAtomSet, useAtomValue } from '@effect-atom/atom-react'
import { createFileRoute, Link, Navigate, Outlet, useMatches, useNavigate } from '@tanstack/react-router'
import { Match } from 'effect'
import { ClipboardListIcon, GitGraphIcon, HomeIcon, LogOutIcon, UserIcon } from 'lucide-react'
import { AtomRuntime } from '#lib/runtime.ts'
import { Separator } from '@/components/ui/separator'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger
} from '@/components/ui/sidebar'
import { Spinner } from '@/components/ui/spinner'
import { rpc } from '@/rpc'

export const Route = createFileRoute('/(home)')({ component: Layout })

const sessionAtom = AtomRuntime.atom(rpc.getCurrentUser)
const signOutAtom = AtomRuntime.fn(rpc.logout)

function Layout() {
	const navigate = useNavigate()
	const signOut = useAtomSet(signOutAtom, { mode: 'promise' })

	return Result.builder(useAtomValue(sessionAtom))
		.onErrorTag('AuthError', () => <Navigate to="/auth" />)
		.onWaiting(() => <Spinner />)
		.onSuccess(() => (
			<SidebarProvider className="items-stretch! min-h-dvh">
				<Sidebar collapsible="icon">
					<SidebarHeader className="h-14 flex-row items-center justify-between border-sidebar-border border-b">
						<SidebarMenu className="flex-1">
							<SidebarMenuItem>
								<SidebarMenuButton size="lg" asChild className="group-data-[collapsible=icon]:p-0!">
									<Link to="/">
										<div className="flex size-8 items-center justify-center rounded-md bg-[#ffffff]">
											<img src="/logo.png" alt="Logo" className="size-5" />
										</div>
										<div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
											<span className="font-semibold">Acme Inc</span>
											<span className="text-muted-foreground text-xs">kotlin-react-template</span>
										</div>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarHeader>

					<SidebarContent>
						<SidebarGroup>
							<SidebarGroupContent>
								<SidebarMenu>
									<SidebarMenuItem>
										<SidebarMenuButton asChild tooltip="Home">
											<Link to="/">
												<HomeIcon />
												<span>Home</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
									<SidebarMenuItem>
										<SidebarMenuButton asChild tooltip="Audits">
											<Link to="/audit">
												<ClipboardListIcon />
												<span>Audits</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
									<SidebarMenuItem>
										<SidebarMenuButton asChild tooltip="Graph">
											<Link to="/graph">
												<GitGraphIcon />
												<span>Graph</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					</SidebarContent>

					<SidebarFooter className="border-sidebar-border border-t">
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild tooltip="Profile">
									<Link to="/profile">
										<UserIcon />
										<span>Profile</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton
									tooltip="Logout"
									onClick={async () => {
										await signOut()
										await navigate({ to: '/auth' })
									}}
								>
									<LogOutIcon />
									<span>Logout</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarFooter>
				</Sidebar>

				<SidebarInset className="h-dvh max-h-dvh">
					<Header />

					<main className="flex min-h-0 flex-1 flex-col p-4">
						<Outlet />
					</main>
				</SidebarInset>
			</SidebarProvider>
		))
		.render()
}

function Header() {
	const matches = useMatches()

	const title = Match.value(matches.at(-1)?.routeId).pipe(
		Match.when('/(home)/profile/', () => 'Profile'),
		Match.when('/(home)/audit/', () => 'Audits'),
		Match.when('/(home)/graph/', () => 'Graph'),
		Match.orElse(() => 'kotlin-react-template')
	)

	return (
		<header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
			<SidebarTrigger className="-ml-1" />
			<Separator orientation="vertical" className="mr-2 h-4" />
			<span className="text-muted-foreground text-sm">{title}</span>
		</header>
	)
}
