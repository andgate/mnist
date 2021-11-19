import { Component } from "solid-js"

export const Instructions: Component = () => {
  return <div id='instructions-container'>
    <div id='instructions-header'>
      Instructions
    </div>
    <div id='instructions-body'>
      Draw a digit on the canvas, and a neural network will try to recognize it!
    </div>
  </div>
}