const ort = require('onnxruntime-web')
import { InferenceSession, Tensor } from "onnxruntime-web";
import { Component, createMemo, createResource } from 'solid-js'
import { useGlobal } from "./GlobalProvider";

type RecognizerProps = {
  session: InferenceSession
}


const emptyTensor = new ort.Tensor('float32', new Float32Array(0))

const createImageTensor = (imgData: ImageData): Tensor => {
  const raw: Uint8ClampedArray = imgData?.data
  const data = new Float32Array((raw.length / 4) ?? 0)
  for (let i = 0, j = 0, len = raw.length; i < len; i++, j += 4) {
    data[i] += raw[j];
    data[i] += raw[j + 1];
    data[i] += raw[j + 2];
    data[i] *= raw[j + 3] / 255;
    data[i] /= 255 * 3;
  }

  return new ort.Tensor('float32', data)
}

type MinstSession = {
  session: InferenceSession;
  inputTensor: Tensor
}

const runMinst = async (minst: MinstSession): Promise<number> => {
  const outputMap = await minst.session.run({ input: minst.inputTensor })
  const outputTensor = outputMap.values().next().value
  const predictions = outputTensor.data
  const maxPrediction = Math.max(...predictions);
  return maxPrediction
}

export const Recognizer: Component<RecognizerProps> = ({ session }) => {
  const [global] = useGlobal()

  const minstSession = createMemo<MinstSession>(() => ({
    session: session,
    inputTensor:
      global.data
        ? createImageTensor(global.data)
        : emptyTensor
  }))

  const [result] = createResource(minstSession, runMinst)

  return <div>
    <h2>{'' + result()}</h2>
  </div>
}
