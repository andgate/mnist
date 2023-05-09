import { InferenceSession, Tensor } from "onnxruntime-web"
import { Component, createEffect, createMemo, createResource } from 'solid-js'
import { useImageDataStore } from "../contexts/ImageDataStoreContext"
import { useInferenceSessionStore } from "../contexts/InferenceSessionStoreContext"
import { runInferenceSession } from "../utils/Inference"
import { BarPlot } from "./BarPlot"
import { Image } from 'image-js'


const createImageTensor = (normalizedImage: Image): Tensor | undefined => {
  // The known mean and std of mnist, which our model is scaled by.
  const mean = 0.1307
  const std = 0.3081
  const normalizedImageData = Float32Array.from(normalizedImage.data, x => ((x / 255) - mean) / std)
  console.log('createImageTensor', normalizedImageData)
  const imgTensor = new Tensor('float32', normalizedImageData, [1, 1, 28, 28])
  
  return imgTensor
}

type MinstSession = {
  session: InferenceSession | null;
  inputTensor?: Tensor
}

interface MinstPrediction {
  probabilities: number[]
  inferenceTime: number
}

const runMnist = async (minst: MinstSession): Promise<MinstPrediction | null> => {
  if (!minst.session) {
    console.warn('runMnist called with null session.')
    return null
  }

  if (!minst.inputTensor) {
    return null
  }

  try {
    const [logProbabilities, inferenceTime] = await runInferenceSession(minst.session, minst.inputTensor)
    const probabilities = Array.from(logProbabilities.data as Float32Array).map(x => Math.exp(x))

    return { probabilities, inferenceTime }
  } catch (err) {
    console.error(err)
    throw err
  }

}

export const MNIST: Component = () => {
  const sessionStore = useInferenceSessionStore()
  const session = createMemo(() => sessionStore.session)

  const [imageDataStore] = useImageDataStore()
  const normalizedImage = createMemo(() => imageDataStore.normalizedImage)

  const minstSession = createMemo<MinstSession>(() => ({
    session: session(),
    inputTensor: createImageTensor(normalizedImage())
  }))

  const [prediction] = createResource<MinstPrediction | null, MinstSession>(minstSession, runMnist, { initialValue: null })

  const probabilities = createMemo(() => prediction()?.probabilities ?? [])
  const inferenceTime = createMemo(() => prediction()?.inferenceTime ?? 0)

  const boxPlotMargin = { top: 10, right: 10, bottom: 30, left: 20 },
    boxPlotWidth = 370,
    boxPlotHeight = 300;

  return <div>
    prediction time: {inferenceTime()}ms
    <BarPlot
      data={probabilities()}
      margin={boxPlotMargin}
      width={boxPlotWidth}
      height={boxPlotHeight}
    />
  </div>
}
