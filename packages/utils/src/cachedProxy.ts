/** Caches computed values by property key to avoid redundant factory calls. */
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
