import { Component } from "solid-js";
import { CanvasDraw } from "./components/CanvasDraw";
import { MNIST } from "./components/MNIST";
import { ImageDataStoreProvider } from "./providers/ImageDataStoreProvider";
import { InferenceSessionStoreProvider } from "./providers/InferenceSessionStoreProvider";

import styles from './assets/styles.css'
import mnistModelBuffer from './assets/mnist.onnx'

export const App: Component = props =>
  <div style={styles}>
    <h1>Hello World</h1>
    <div id='app-container'>
      <ImageDataStoreProvider>
        <CanvasDraw />
        <InferenceSessionStoreProvider
          modelBuffer={mnistModelBuffer}
          dims={[1, 1, 28, 28]}
        >
          <MNIST />
        </InferenceSessionStoreProvider>
      </ImageDataStoreProvider>
    </div>
  </div>