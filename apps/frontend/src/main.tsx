import * as Root from '#routes/__root.tsx'
import './main.css'

import { createRouter, RouterProvider } from '@tanstack/react-router'

import React from 'react'
import ReactDOM from 'react-dom/client'

const router = createRouter({
	search: { strict: true },
	defaultPreload: 'intent',
	scrollRestoration: true,
	defaultPendingMs: 0,
	defaultPendingMinMs: 500,
	defaultErrorComponent: Root.Error,
	defaultPendingComponent: Root.Loading,
	defaultNotFoundComponent: Root.NotFound,
	...(await import('./routeTree.gen.ts'))
})

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

// biome-ignore lint/style/noNonNullAssertion: the root need to exists
ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
)
