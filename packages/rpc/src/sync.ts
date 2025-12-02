import { electricCollectionOptions } from '@tanstack/electric-db-collection'
import * as TanstackDB from '@tanstack/react-db'
import { Array, flow, String } from 'effect'
import type { Entities, ExtractEndpoints, RemovePrefix, RemoveSuffix } from '#lib/utils.ts'
import { camelToPascal } from '#lib/utils.ts'
import { createCachedProxy } from '@/utils/cachedProxy'

export namespace sync {
	type SyncEnpoints = {
		[Key in keyof ExtractEndpoints<'get'> as Uncapitalize<RemovePrefix<Key, 'sync'>>]: ExtractEndpoints<'get'>[Key]
	}

	/** Union of all available Sync method names */
	export type Endpoints = keyof SyncEnpoints

	export type Table = {
		[K in Endpoints]: Entities[RemoveSuffix<Capitalize<K>, 's'>]
	}

	export type Type = {
		[Entity in sync.Endpoints]: TanstackDB.Collection<Table[Entity], string>
	}
}

export const sync = createCachedProxy<sync.Type>(entityName => {
	const backendUrl = process.env['BACKEND_URL'] ?? window.location.origin

	return TanstackDB.createCollection(
		electricCollectionOptions({
			shapeOptions: {
				url: `${backendUrl}/api/sync${camelToPascal(entityName)}`,
				parser: {
					_int4: flow(String.slice(1, -1), String.split(','), Array.map(globalThis.Number))
				}
			},
			getKey: (item: { id: string }) => item.id
		})
	)
})
