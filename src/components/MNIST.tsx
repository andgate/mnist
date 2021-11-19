import { InferenceSession, Tensor } from "onnxruntime-web"
import { Component, createEffect, createMemo, createResource, For } from 'solid-js'
import { useImageDataStore } from "../contexts/ImageDataStoreContext"
import { useInferenceSessionStore } from "../contexts/InferenceSessionStoreContext"
import { runInferenceSession } from "../utils/Inference"
import { BarPlot } from "./BarPlot"

const softmax = (xs: number[]): number[] => {
  if (xs.length == 0) {
    return xs
  }
  const C = Math.max(...xs)
  const d = xs.map((x) => Math.exp(x - C)).reduce((a, b) => a + b)
  return xs.map(value => {
    return Math.exp(value - C) / d;
  })
}

const createImageTensor = (imgData: ImageData): Tensor => {
  const raw: Uint8ClampedArray = imgData.data
  var data = new Float32Array(raw.length / 4)
  for (let i = 0, j = 3, len = data.length; i < len; i++, j += 4) {
    data[i] = raw[j] / 255
  }

  console.log({ rawImageData: raw, greyscaleImageData: data })

  return new Tensor('float32', data, [1, 1, 28, 28])
}

const emptyOutput: Float32Array = new Float32Array(10)

type MinstSession = {
  session: InferenceSession | null;
  inputTensor: Tensor
}

const runMnist = async (minst: MinstSession): Promise<Float32Array> => {
  if (!minst.session) {
    console.warn('runMnist called with null session.')
    return emptyOutput
  }

  try {
    const [output, inferenceTime] = await runInferenceSession(minst.session, minst.inputTensor)
    console.info(`MNIST inference time was ${inferenceTime}`)

    return output.data as Float32Array
  } catch (err) {
    console.error(err)
    throw err
  }

}

export const MNIST: Component = () => {
  const sessionStore = useInferenceSessionStore()
  const session = createMemo(() => sessionStore.session)

  const [imageDataStore] = useImageDataStore()
  const imageData = createMemo(() => imageDataStore.imageData)

  const minstSession = createMemo<MinstSession>(() => ({
    session: session(),
    inputTensor: createImageTensor(imageData())
  }))

  createEffect(() => console.log(minstSession()))

  const [result] = createResource<Float32Array, MinstSession>(minstSession, runMnist, { initialValue: emptyOutput })

  createEffect(() => console.log(result()))

  const output = createMemo(() => softmax(Array.from(result())))

  const boxPlotMargin = { top: 10, right: 10, bottom: 30, left: 20 },
    boxPlotWidth = 370,
    boxPlotHeight = 300;

  return <div>
    <BarPlot
      data={output()}
      margin={boxPlotMargin}
      width={boxPlotWidth}
      height={boxPlotHeight}
    />
  </div>
}
