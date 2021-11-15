import { Component } from "solid-js";
import { CanvasDraw } from "./CanvasDraw";

import styles from './styles.css'

export const App: Component = props =>
  <div style={styles}>
    <h1>Hello World</h1>
    <div id='app-container'>
      <CanvasDraw />
      <h2>Recognizer (unimplemented)</h2>
    </div>
  </div>