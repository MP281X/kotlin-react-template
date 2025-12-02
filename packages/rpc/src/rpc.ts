import { Cookies, HttpBody, HttpClient, HttpClientRequest } from '@effect/platform'
import { Data, Effect as E, Effect, flow, pipe, Ref } from 'effect'
import type { ExtractEndpoints, ExtractPayload, ExtractResponse } from '#lib/utils.ts'
import { createCachedProxy } from '@/utils/cachedProxy'
import { AwaitableEffect } from '@/utils/runtime'

export class RPCError extends Data.TaggedError('RPCError')<{
	message: string
	status: 'Transport' | 'Encode' | 'InvalidUrl' | 'StatusCode' | 'Decode' | 'EmptyBody'
}> {}

export class AuthError extends Data.TaggedError('AuthError')<{ message: string }> {}

/**
 * RPC client namespace containing core types for method calls with readable expanded types
 */
export namespace callRpc {
	export type Rpcs = ExtractEndpoints<'post'>

	/** Union of all available RPC method names */
	export type Methods = keyof Rpcs

	/** Extract payload type for a given RPC method with full type expansion */
	export type Payload<M extends Methods> = ExtractPayload<Rpcs[M]>

	/** Extract result type for a given RPC method with full type expansion */
	export type Result<M extends Methods> = ExtractResponse<Rpcs[M]>

	/** Check if RPC method requires payload */
	export type RequiresPayload<M extends Methods> = [Payload<M>] extends [never] ? false : true
}

/**
 * Reference to persist the cookies across requests in NodeJs
 */
const cookieRef = Ref.unsafeMake(Cookies.empty)

/**
 * Core RPC function for making typed method calls
 * @example rpc("updateUser", { id: "123", data: { name: "John" } }) -> never
 * @example rpc("findUserById", { id: "123" }) -> User
 */
export const callRpc = flow(
	E.fn(function* <Method extends callRpc.Methods>(method: Method, payload?: callRpc.Payload<Method>) {
		const request = HttpClientRequest.post(`${process.env['BACKEND_URL'] ?? ''}/api/${method}`).pipe(
			HttpClientRequest.acceptJson,
			HttpClientRequest.setHeader('Content-Type', 'application/json'),
			HttpClientRequest.setBody(HttpBody.unsafeJson(payload ?? {}))
		)

		const client = yield* pipe(HttpClient.HttpClient, Effect.andThen(HttpClient.withCookiesRef(cookieRef)))
		const res = yield* client.execute(request)

		if (res.status === 200) return (yield* res.json) as callRpc.Result<Method>
		if (res.status === 401) return yield* new AuthError({ message: yield* res.text })
		if (res.status === 502) return yield* new RPCError({ status: 'StatusCode', message: 'Server is unavailable' })
		return yield* new RPCError({ status: 'StatusCode', message: yield* res.text })
	}),
	E.catchTag('RequestError', e => new RPCError({ status: 'Transport', message: e.message })),
	E.catchTag('ResponseError', e => new RPCError({ status: 'Transport', message: e.message })),
	E.catchAllDefect(() => new RPCError({ status: 'Transport', message: 'Unknown Error' }))
)

export declare namespace rpc {
	/** Union of all available RPC method names */
	export type Methods = callRpc.Methods

	/** Extract parameter type for rpc hook (already expanded) */
	export type Payload<Method extends callRpc.Methods> = callRpc.Payload<Method>

	/** Extract result type for rpc hook (already expanded) */
	export type Result<Method extends callRpc.Methods> = callRpc.Result<Method>

	/** Base return type for all RPC methods */
	type RpcResponse<Method extends callRpc.Methods> =
		// promise
		PromiseLike<callRpc.Result<Method>> &
			// effect
			E.Effect<callRpc.Result<Method>, RPCError | AuthError>

	/** Main RPC type mapping each method to its appropriate function signature */
	export type Type = {
		[Method in callRpc.Methods]: callRpc.RequiresPayload<Method> extends true
			? (payload: callRpc.Payload<Method>) => RpcResponse<Method>
			: () => RpcResponse<Method>
	}
}

/**
 * Typed RPC proxy that dynamically creates methods for all available API endpoints
 * Each method corresponds to a POST endpoint and returns an Effect that is also thenable/awaitable
 * Methods are cached to ensure stable references after first invocation
 * @example await rpc.findUserById({ id: "123" }) // using await
 * @example yield* rpc.findUserById({ id: "123" }) // using Effect
 */
export const rpc = createCachedProxy<rpc.Type>(method => {
	return (payload: rpc.Payload<typeof method>) => AwaitableEffect(callRpc(method, payload))
})
