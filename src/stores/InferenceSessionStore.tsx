import { InferenceSession } from "onnxruntime-web";

export type InferenceSessionStore = {
  session: InferenceSession | null
}

export const emptyInferenceSessionStore: InferenceSessionStore = {
  session: null
}
