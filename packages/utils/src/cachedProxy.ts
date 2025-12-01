/**
 * Create a cached proxy from a single-argument factory function.
 *
 * The runtime uses a Proxy and caches the computed value per-property on first access.
 */
export function createCachedProxy<Obj extends Record<string, unknown>>(fn: (key: keyof Obj) => any): Obj {
	const cache = new Map<PropertyKey, any>()

	const handler: ProxyHandler<any> = {
		get(_target, prop) {
			if (cache.has(prop)) return cache.get(prop)

			const value = fn(prop as any)
			cache.set(prop, value)
			return value
		}
	}

	return new Proxy({}, handler)
}
