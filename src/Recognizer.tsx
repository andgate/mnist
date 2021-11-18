const ort = require('onnxruntime-web')
import { InferenceSession, Tensor } from "onnxruntime-web";
import { Component, createMemo, createResource, For } from 'solid-js'

type RecognizerProps = {
  session: InferenceSession,
  imageData: ImageData
}

const createImageTensor = (imgData: ImageData): Tensor => {
  const raw: Uint8ClampedArray = imgData?.data
  const data = new Float32Array(raw.length / 4)
  for (let i = 0, j = 0, len = data.length; i < len; i++, j += 4) {
    data[i] += raw[j];
    data[i] += raw[j + 1];
    data[i] += raw[j + 2];
    data[i] /= 3 * 255;
  }

  return new ort.Tensor('float32', data, [1, 1, 28, 28])
}

type MinstSession = {
  session: InferenceSession;
  inputTensor: Tensor
}

const runMinst = async (minst: MinstSession): Promise<Float32Array> => {
  const outputMap = await minst.session.run({ input: minst.inputTensor })
  const outputTensor = outputMap.output
  return outputTensor.data as Float32Array
}

export const Recognizer: Component<RecognizerProps> = ({ session, imageData }) => {
  const minstSession = createMemo<MinstSession>(() => ({
    session: session,
    inputTensor: createImageTensor(imageData)
  }))

  const [result] = createResource(minstSession, runMinst)

  return <div>
    <ul>
      <For each={result()} fallback={<div>Loading...</div>}>
        {(item, i) =>
          <li>{'' + i() + ': ' + item + '%'}</li>
        }
      </For>
    </ul>
  </div>
}
