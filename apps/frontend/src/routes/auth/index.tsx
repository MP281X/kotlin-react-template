import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Effect, Function, Schema } from 'effect'
import { runEffect } from '#lib/runtime.ts'
import { rpc } from '@/rpc'

import { Dialog } from '@/ui/components/dialog'
import { Form } from '@/ui/components/form'
import Logo from '../../../static/logo.png'

export const Route = createFileRoute('/auth/')({
	validateSearch: Schema.standardSchemaV1(Schema.Struct({ redirect: Schema.optional(Schema.String) })),
	component: Page
})

function Page() {
	const navigate = useNavigate()
	const { redirect } = Route.useSearch()

	const email = localStorage.getItem('email') ?? ''
	const password = localStorage.getItem('password') ?? ''

	const form = Form.useForm({
		defaultValues: { email, password },
		onSubmit: async ({ value }) =>
			runEffect(
				Effect.gen(function* () {
					yield* rpc.login({ email: value.email, password: value.password })

					localStorage.setItem('email', value.email)
					if (import.meta.env.DEV) localStorage.setItem('password', value.password)

					const redirectTo = redirect ? decodeURIComponent(redirect) : '/'
					yield* Effect.all(
						[Effect.sleep('5 seconds'), Effect.promise(() => navigate({ to: redirectTo, reloadDocument: true }))],
						{ concurrency: 'unbounded' }
					)
				})
			)
	})

	return (
		<Dialog open onClose={Function.constUndefined}>
			<div className="flex justify-between">
				<Dialog.Title className="font-family-nasalization text-2xl">kotlin-react-template</Dialog.Title>
				<img src={Logo} alt="logo" className="h-8" style={{ imageRendering: 'pixelated' }} />
			</div>

			<Form form={form}>
				<Dialog.Content>
					<form.Field name="email" children={Form.Email} />
					<form.Field name="password" children={Form.Password} />
				</Dialog.Content>
				<Dialog.Actions>
					<form.SubmitButton children="Sign In" />
				</Dialog.Actions>
			</Form>
		</Dialog>
	)
}
