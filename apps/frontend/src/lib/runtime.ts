import { Atom } from '@effect-atom/atom-react'
import { BaseLayers } from '@/utils/runtime'

/** Provides shared Effect runtime for atoms in the React app. */
export const AtomRuntime = Atom.runtime(BaseLayers)
