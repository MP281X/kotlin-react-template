import { createFileRoute, useCanGoBack, useRouter } from '@tanstack/react-router'
import { pipe, Schema } from 'effect'
import { Form, revalidateLogic, useForm } from '@/components/form'
import { rpc } from '@/rpc'

export const Route = createFileRoute('/auth/')({ component: Page })

const signInSchema = Schema.Struct({
	email: pipe(Schema.Uppercase, Schema.minLength(5), Schema.includes('@')),
	password: Schema.NonEmptyString
})

function Page() {
	const router = useRouter()
	const canGoBack = useCanGoBack()

	const navigateAfterAuth = async () => {
		if (canGoBack) return router.history.back()
		return await router.navigate({ to: '/' })
	}

	const form = useForm({
		defaultValues: { email: '', password: '' } as rpc.Payload<'login'>,
		validationLogic: revalidateLogic({ mode: 'change' }),
		validators: { onDynamic: Schema.standardSchemaV1(signInSchema) },
		onSubmit: async ({ value }) => {
			await rpc.login(value)
			await navigateAfterAuth()
		}
	})

	return (
		<div className="flex w-full max-w-80 flex-col gap-8">
			<div className="flex flex-col gap-1 text-center">
				<h1 className="font-semibold text-2xl tracking-tight">Sign in</h1>
				<p className="text-muted-foreground text-sm">Enter your credentials to continue</p>
			</div>

			<Form form={form} className="flex-col gap-4">
				<form.AppField name="email" children={field => <field.EmailField />} />
				<form.AppField name="password" children={field => <field.PasswordField />} />
				<form.SubmitButton children="Login" />
			</Form>
		</div>
	)
}
