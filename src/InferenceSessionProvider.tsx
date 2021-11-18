import { InferenceSession } from "onnxruntime-web";
import { Component, Context, createContext, createEffect, createMemo, createResource, useContext } from "solid-js";
import { createStore, Store } from "solid-js/store";
import { createCpuInferenceSession, warmupInferenceSession } from "./utils/Inference";

type InferenceSessionStore = {
  session: InferenceSession | null
}

const emptyInferenceSessionStore: InferenceSessionStore = {
  session: null
}

type InferenceSessionProviderProps = {
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

export const InferenceSessionContext: Context<InferenceSessionStore> =
  createContext<InferenceSessionStore>(emptyInferenceSessionStore)

export const InferenceSessionProvider: Component<InferenceSessionProviderProps> = (props) => {
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
    <InferenceSessionContext.Provider value={state}>
      {props.children}
    </InferenceSessionContext.Provider>
  )
}

export const useInferenceSession = (): Store<InferenceSessionStore> =>
  useContext(InferenceSessionContext)