const ort = require('onnxruntime-web')
import { InferenceSession } from "onnxruntime-web";
import { Component, createResource, Show, useContext, Suspense, createMemo } from 'solid-js'
import { useGlobal } from './GlobalProvider'
import { Recognizer } from './Recognizer'

export const RecognizerContainer: Component = () => {
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

  const [global] = useGlobal()
  const imageData = createMemo<ImageData | null>(() => global?.data)

  return <div>
    <h2>{session.loading && 'Starting recognizer session...'}</h2>
    <h2>{!session.loading && imageData() && <Recognizer session={session() as InferenceSession} imageData={imageData() as ImageData} />}</h2>
  </div>
}
