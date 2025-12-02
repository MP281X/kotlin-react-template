import { FetchHttpClient } from '@effect/platform'
import { Effect, Layer, Logger, LogLevel, pipe } from 'effect'

// configure global layers and runtime used in all the projects
export type BaseLayers = Layer.Layer.Success<typeof BaseLayers>
export const BaseLayers = Layer.mergeAll(
	// base layers that are always injected
	Layer.scope,
	Logger.pretty,
	Logger.minimumLogLevel(LogLevel.Debug),
	FetchHttpClient.layer
)

export type AwaitableEffect<T> = Effect.Effect<T> & PromiseLike<T>
export function AwaitableEffect<A, E, R>(effect: Effect.Effect<A, E, R>) {
	const program = pipe(effect, Effect.provide(BaseLayers))
	// biome-ignore lint/style/noRestrictedGlobals: special case
	return Object.assign(program, {
		// biome-ignore lint/suspicious/noThenProperty: thenable
		then: (resolve: (v: any) => void, reject: (e: any) => void) => {
			return Effect.runPromise(program as any).then(resolve, reject)
		}
	})
}
