import { createFileRoute, useCanGoBack, useRouter } from '@tanstack/react-router'
import { pipe, Schema } from 'effect'
import { Form, revalidateLogic, useForm } from '@/components/form'
import { Card, CardAction, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { rpc } from '@/rpc'

export const Route = createFileRoute('/auth/')({ component: Page })

const signInSchema = Schema.Struct({
	email: pipe(Schema.Lowercase, Schema.minLength(5), Schema.includes('@')),
	password: Schema.NonEmptyString
})

function Page() {
	const router = useRouter()
	const canGoBack = useCanGoBack()

	const form = useForm({
		defaultValues: { email: localStorage.getItem('email') ?? '', password: '' },
		validationLogic: revalidateLogic({ mode: 'change' }),
		validators: { onDynamic: Schema.standardSchemaV1(signInSchema) },
		onSubmit: async ({ value }) => {
			await rpc.login(value)
			localStorage.setItem('email', value.email)
			if (canGoBack) return router.history.back()
			await router.navigate({ to: '/' })
		}
	})

	return (
		<Form form={form} className="w-full max-w-lg px-4 sm:px-0">
			<Card className="w-full">
				<CardHeader>
					<span className="font-bold">Sign In</span>
					<CardAction>
						<img src="/logo.png" alt="Logo" className="h-8 w-8" />
					</CardAction>
				</CardHeader>

				<CardContent className="flex flex-col gap-4">
					<form.AppField name="email" children={field => <field.EmailField />} />
					<form.AppField name="password" children={field => <field.PasswordField />} />
				</CardContent>

				<CardFooter className="justify-end">
					<form.SubmitButton children="Sign In" />
				</CardFooter>
			</Card>
		</Form>
	)
}
