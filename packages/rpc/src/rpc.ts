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

/** Provides type definitions for RPC method calls. */
export namespace callRpc {
	export type Rpcs = ExtractEndpoints<'post'>
	export type Methods = keyof Rpcs
	export type Payload<M extends Methods> = ExtractPayload<Rpcs[M]>
	export type Result<M extends Methods> = ExtractResponse<Rpcs[M]>
	export type RequiresPayload<M extends Methods> = [Payload<M>] extends [never] ? false : true
}

/** Persists cookies across requests for server-side usage. */
const cookieRef = Ref.unsafeMake(Cookies.empty)

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
	export type Methods = callRpc.Methods
	export type Payload<Method extends callRpc.Methods> = callRpc.Payload<Method>
	export type Result<Method extends callRpc.Methods> = callRpc.Result<Method>

	type RpcResponse<Method extends callRpc.Methods> = PromiseLike<callRpc.Result<Method>> &
		E.Effect<callRpc.Result<Method>, RPCError | AuthError>

	export type Type = {
		[Method in callRpc.Methods]: callRpc.RequiresPayload<Method> extends true
			? (payload: callRpc.Payload<Method>) => RpcResponse<Method>
			: () => RpcResponse<Method>
	}
}

/**
 * Creates typed RPC methods for all POST endpoints, usable with await or Effect.
 *
 * @example
 * await rpc.findUserById({ id: "123" })
 * yield* rpc.findUserById({ id: "123" })
 */
export const rpc = createCachedProxy<rpc.Type>(method => {
	return (payload: rpc.Payload<typeof method>) => AwaitableEffect(callRpc(method, payload))
})
