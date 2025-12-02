import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(home)/users/')({ component: Page })

function Page() {
	return <div>Hello "/(home)/users/"!</div>
}
