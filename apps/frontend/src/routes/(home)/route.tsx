import { createFileRoute, Link, Outlet, useLocation } from '@tanstack/react-router'
import { rpc } from '@/rpc'
import { Icon } from '@/ui/components/icon'
import { Sidebar } from '@/ui/components/sidebar'
import Logo from '../../../static/logo.png'
import type { FileRouteTypes } from '../../routeTree.gen.ts'

export const Route = createFileRoute('/(home)')({
	beforeLoad: async () => await rpc.getCurrentUser(),
	component: Layout,
	wrapInSuspense: true
})

function Layout() {
	const location = useLocation()

	const isCurrentPage = (path: FileRouteTypes['to']) => location.pathname.startsWith(path)

	return (
		<div className="flex h-svh w-full flex-row gap-2">
			<Sidebar>
				<Sidebar.Header className="flex w-60 items-center justify-between text-2xl">
					<div className="font-bold text-base">kotlin-react-template</div>
					<img src={Logo} alt="logo" className="h-6" style={{ imageRendering: 'pixelated' }} />
				</Sidebar.Header>

				<div className="h-[calc(100vh-185px)] overflow-auto">
					<Link to="/audit">
						<Sidebar.Item current={isCurrentPage('/audit')}>
							<Icon.Prefix name="policy">Audit</Icon.Prefix>
						</Sidebar.Item>
					</Link>
				</div>

				<Sidebar.Footer>
					<Link to="/users">
						<Sidebar.Item current={isCurrentPage('/users')}>
							<Icon.Prefix name="group">Users</Icon.Prefix>
						</Sidebar.Item>
					</Link>
					<Link to="/auth" onClick={async () => await rpc.logout()}>
						<Sidebar.Item>
							<Icon.Prefix name="logout">Logout</Icon.Prefix>
						</Sidebar.Item>
					</Link>
				</Sidebar.Footer>
			</Sidebar>

			<main className="flex min-h-svh w-full flex-1 flex-col overflow-hidden p-3">
				<div className="flex h-full flex-col gap-3 overflow-hidden">
					<Outlet />
				</div>
			</main>
		</div>
	)
}
