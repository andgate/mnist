import { Context, createContext, useContext } from "solid-js"
import { Store } from "solid-js/store"
import { emptyInferenceSessionStore, InferenceSessionStore } from "../stores/InferenceSessionStore"

export const InferenceSessionStoreContext: Context<InferenceSessionStore> =
  createContext<InferenceSessionStore>(emptyInferenceSessionStore)

export const useInferenceSessionStore = (): Store<InferenceSessionStore> =>
  useContext(InferenceSessionStoreContext)
