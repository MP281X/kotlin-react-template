import type { components, paths } from 'backend'

export type Entities = components['schemas']

/**
 * TypeScript utility to expand types and remove the never type
 * @example Expand<{ a: string; b: never }> -> { a: string }
 */
export type Expand<T> = T extends (...args: any[]) => any
	? T
	: T extends (infer U)[]
		? Expand<U>[]
		: T extends object
			? { [K in keyof T as T[K] extends never ? never : K]: Expand<T[K]> }
			: T

export type RemovePrefix<Str extends string, Prefix extends string> = Str extends `${Prefix}${infer Rest}`
	? Rest
	: never

export type RemoveSuffix<Str extends string, Suffix extends string> = Str extends `${infer Pre}${Suffix}` ? Pre : never

/**
 * Extract method name by removing leading slash
 * @example CleanMethodName<"/updateUser"> -> "updateUser"
 */
type CleanMethodName<T> = T extends `/${infer P}` ? P : never

export type ExtractEndpoints<Method extends 'get' | 'post' | 'put' | 'delete'> = {
	[K in keyof paths as paths[K] extends { [M in Method]: unknown }
		? CleanMethodName<Extract<K, string>>
		: never]: paths[K][Method]
}

/**
 * Extract payload type from request body with recursively expanded types for readability
 * @example ExtractPayload<{requestBody: {content: {"application/json": UpdateUser}}}} -> UpdateUser (fully expanded)
 */
export type ExtractPayload<T> = T extends { requestBody: { content: { 'application/json': infer P } } }
	? Expand<P>
	: never

/**
 * Extract response type with recursively expanded types for readability - handles both void and data responses
 * @example RpcResult<{responses: {200: {content: {"star/star": User}}}}> -> User (fully expanded)
 * @example RpcResult<{responses: {200: {content?: never}}}> -> void
 */
export type ExtractResponse<T> = T extends { responses: { 200: { content: { '*/*': infer R } } } }
	? Expand<R>
	: T extends { responses: { 200: { content?: never } } }
		? void
		: void

export function camelToPascal<Str extends string>(str: Str) {
	return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<Str>
}
