import { Component } from "solid-js";
import { CanvasDraw } from "./CanvasDraw";
import { RecognizerContainer } from "./RecognizerContainer";
import { GlobalStateProvider } from "./GlobalProvider";

import styles from './styles.css'

export const App: Component = props =>
  <div style={styles}>
    <h1>Hello World</h1>
    <div id='app-container'>
      <GlobalStateProvider>
        <CanvasDraw />
        <RecognizerContainer />
      </GlobalStateProvider>
    </div>
  </div>