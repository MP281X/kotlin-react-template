import { Atom } from '@effect-atom/atom-react'
import { Layer, ManagedRuntime, pipe } from 'effect'
import { BaseLayers, runEffectConstructor } from '@/utils/runtime'

const LiveLayers = Layer.mergeAll(BaseLayers)

export const runEffect = pipe(ManagedRuntime.make(LiveLayers), runEffectConstructor)
export const runtimeAtom = Atom.runtime(LiveLayers)
