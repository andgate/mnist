const ort = require('onnxruntime-web')
import { InferenceSession, Tensor } from "onnxruntime-web";
import { Component, createMemo, createResource, For } from 'solid-js'
import { useImageData } from "./ImageDataProvider";
import { useInferenceSession } from "./InferenceSessionProvider";

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
  session: InferenceSession | null;
  inputTensor: Tensor
}

const runMnist = async (minst: MinstSession): Promise<Float32Array> => {
  if (!minst.session) {
    console.warn('runMnist called with null session.')
    return new Float32Array(10)
  }

  const outputMap = await minst.session.run({ input: minst.inputTensor })
  const outputTensor = outputMap.output
  return outputTensor.data as Float32Array
}

export const MNIST: Component = () => {
  const sessionStore = useInferenceSession()
  const session = createMemo(() => sessionStore.session)

  const [imageData] = useImageData()

  const minstSession = createMemo<MinstSession>(() => ({
    session: session(),
    inputTensor: createImageTensor(imageData)
  }))

  const [result] = createResource(minstSession, runMnist)


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
