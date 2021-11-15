const ort = require('onnxruntime-web')
import { InferenceSession } from "onnxruntime-web";
import { Component, createResource, Show, useContext, Suspense } from 'solid-js'
import { GlobalStateContext } from './GlobalProvider'
import { Recognizer } from './Recognizer'

export const RecognizerContainer: Component = () => {
  const [global] = useContext(GlobalStateContext)
  const netFetcher = async (): Promise<InferenceSession> => {
    try {
      const session: InferenceSession = await ort.InferenceSession.create('./net.onnx')
      return session
    } catch (ex) {
      console.error(ex)
      throw ex
    }
  }
  const [session] = createResource(netFetcher)

  return <div>
    <h2>{session.loading && 'Starting recognizer session...'}</h2>
    <h2>{!session.loading && <Recognizer session={session() as InferenceSession} />}</h2>
  </div>
}
