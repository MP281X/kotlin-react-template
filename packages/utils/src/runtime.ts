import { FetchHttpClient } from '@effect/platform'
import { Effect, Either, Function, Layer, Logger, LogLevel, type ManagedRuntime, pipe } from 'effect'
import { LoggerLive } from './logger.ts'

// configure global layers and runtime used in all the projects
export type BaseLayers = Layer.Layer.Success<typeof BaseLayers>
export const BaseLayers = Layer.mergeAll(
	// base layers that are always injected
	Layer.scope,
	LoggerLive,
	Logger.minimumLogLevel(LogLevel.Debug),
	FetchHttpClient.layer
)

export function runEffectConstructor<Layers, ER>(runtime: ManagedRuntime.ManagedRuntime<Layers, ER>) {
	return <A, E, R extends Layers>(program: Effect.Effect<A, E, R>, signal?: AbortSignal) =>
		pipe(
			program,
			Effect.catchAllDefect(Effect.fail),
			Effect.either,
			program => runtime.runPromise(program, { signal }),
			res => res.then(Either.getOrThrowWith(Function.identity))
		)
}

export type AwaitableEffect<T> = Effect.Effect<T> & PromiseLike<T>
export function AwaitableEffect<A, E, R>(effect: Effect.Effect<A, E, R>) {
	const program = pipe(effect, Effect.provide(BaseLayers))
	return Object.assign(program, {
		// biome-ignore lint/suspicious/noThenProperty: thenable
		then: (resolve: (v: any) => void, reject: (e: any) => void) => {
			return Effect.runPromise(program as any).then(resolve, reject)
		}
	})
}
