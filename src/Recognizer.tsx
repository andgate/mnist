import { InferenceSession } from "onnxruntime-web";
import { Component } from 'solid-js'

type RecognizerProps = {
  session: InferenceSession
}

export const Recognizer: Component<RecognizerProps> = ({ session }) => {
  return <div>
    <h2>Loaded recognizer net.</h2>
  </div>
}
