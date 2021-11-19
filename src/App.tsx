import { Component } from "solid-js";
import { CanvasDraw } from "./components/CanvasDraw";
import { MNIST } from "./components/MNIST";
import { ImageDataStoreProvider } from "./providers/ImageDataStoreProvider";
import { InferenceSessionStoreProvider } from "./providers/InferenceSessionStoreProvider";
import { Instructions } from "./components/Instructions";

import styles from './assets/styles.css'
import mnistModelBuffer from './assets/mnist.onnx'
import logoImage from './assets/andgate.png'

const homeUrl = 'https://andgate.github.com/'

export const App: Component = props =>
  <div style={styles}>
    <div id="page-header">
      <div id="dev-container" onClick={() => location.href = homeUrl} >
        <img src={logoImage} id="dev-logo" />
        <h2 id="dev-name">
          andgate
        </h2>
      </div>
      <div id="page-title-container">
        <h1 id="page-title">MNIST Handwritten Digit Recognizer</h1>
      </div>
    </div>
    <div id='app-container'>
      <ImageDataStoreProvider>
        <Instructions />
        <CanvasDraw />
        <InferenceSessionStoreProvider
          modelBuffer={mnistModelBuffer}
          dims={[1, 1, 28, 28]}
        >
          <MNIST />
        </InferenceSessionStoreProvider>
      </ImageDataStoreProvider>
    </div>
  </div >