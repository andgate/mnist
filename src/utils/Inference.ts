import { InferenceSession, Tensor } from 'onnxruntime-web';

export async function createCpuInferenceSession(model: ArrayBuffer): Promise<InferenceSession> {
  return await InferenceSession.create(model, { executionProviders: ['wasm'] });
}
export async function createGpuInferenceSession(model: ArrayBuffer): Promise<InferenceSession> {
  return await InferenceSession.create(model, { executionProviders: ['webgl'] });
}

export async function warmupInferenceSession(session: InferenceSession, dims: number[]) {
  // OK. we generate a random input and call Session.run() as a warmup query
  const size = dims.reduce((a, b) => a * b);
  const warmupTensor = new Tensor('float32', new Float32Array(size), dims);

  for (let i = 0; i < size; i++) {
    warmupTensor.data[i] = Math.random() * 2.0 - 1.0;  // random value [-1.0, 1.0)
  }
  try {
    const feeds: Record<string, Tensor> = {};
    feeds[session.inputNames[0]] = warmupTensor;
    await session.run(feeds);
  } catch (e) {
    console.error(e);
  }
}

export async function runInferenceSession(session: InferenceSession, preprocessedData: Tensor): Promise<[Tensor, number]> {
  const start = new Date();
  try {
    const feeds: Record<string, Tensor> = {};
    feeds[session.inputNames[0]] = preprocessedData;
    const outputData = await session.run(feeds);
    const end = new Date();
    const inferenceTime = (end.getTime() - start.getTime());
    const output = outputData[session.outputNames[0]];

    return [output, inferenceTime];
  } catch (e) {
    console.error(e);
    throw new Error();
  }
}