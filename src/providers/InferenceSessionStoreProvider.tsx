import { InferenceSession } from "onnxruntime-web"
import { Component, createEffect, createMemo, createResource } from "solid-js"
import { createStore } from "solid-js/store"
import { InferenceSessionStoreContext } from "../contexts/InferenceSessionStoreContext"
import { emptyInferenceSessionStore, InferenceSessionStore } from "../stores/InferenceSessionStore"
import { createCpuInferenceSession, warmupInferenceSession } from "../utils/Inference"

export type InferenceSessionStoreProviderProps = {
  modelBuffer: Uint8Array,
  dims: number[]
}

type InferenceSessionConfig = {
  modelBuffer: Uint8Array,
  dims: number[]
}

const createSession = async (config: InferenceSessionConfig): Promise<InferenceSession> => {
  try {
    const session: InferenceSession = await createCpuInferenceSession(config.modelBuffer)
    warmupInferenceSession(session, config.dims)
    return session
  } catch (ex) {
    console.error(ex)
    throw ex
  }
}

export const InferenceSessionStoreProvider: Component<InferenceSessionStoreProviderProps> = (props) => {
  const inferenceSessionConfig = createMemo<InferenceSessionConfig>(() => ({
    modelBuffer: props.modelBuffer,
    dims: props.dims
  }))

  const [state, setState] = createStore<InferenceSessionStore>(emptyInferenceSessionStore)
  const [sessionResource] = createResource<InferenceSession, InferenceSessionConfig>(inferenceSessionConfig, createSession)
  createEffect(() => {
    if (sessionResource.loading) {
      setState('session', null as InferenceSession | null)
    }
    setState('session', sessionResource() as InferenceSession | null)
  })

  return (
    <InferenceSessionStoreContext.Provider value={state}>
      {props.children}
    </InferenceSessionStoreContext.Provider>
  )
}
