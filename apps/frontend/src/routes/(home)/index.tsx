import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(home)/')({ component: Page })

function Page() {
	return <div>Hello "/(home)/"!</div>
}
