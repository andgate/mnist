import { Component } from "solid-js";
import { CanvasDraw } from "./CanvasDraw";
import { MNIST } from "./MNIST";
import { ImageDataProvider } from "./ImageDataProvider";
import { InferenceSessionProvider } from "./InferenceSessionProvider";

import styles from './styles.css'
import mnistModelBuffer from './mnist.onnx'

export const App: Component = props =>
  <div style={styles}>
    <h1>Hello World</h1>
    <div id='app-container'>
      <ImageDataProvider>
        <CanvasDraw />
        <InferenceSessionProvider
          modelBuffer={mnistModelBuffer}
          dims={[1, 1, 28, 28]}
        >
          <MNIST />
        </InferenceSessionProvider>
      </ImageDataProvider>
    </div>
  </div>