import { createRouter, RouterProvider } from '@tanstack/react-router'

import React from 'react'
import ReactDOM from 'react-dom/client'

import './main.css'
import * as Fallbacks from '@/components/fallbacks'

const router = createRouter({
	defaultPreload: 'intent',
	scrollRestoration: true,
	defaultErrorComponent: Fallbacks.Error,
	defaultPendingComponent: Fallbacks.Loading,
	defaultNotFoundComponent: Fallbacks.NotFound,
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
