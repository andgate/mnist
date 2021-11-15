import { Component } from "solid-js";
import { render } from "solid-js/web";

const HelloMessage: Component<{ name: string }> = props =>
  <div>Hello {props.name}</div>

const root = document.createElement('div')
root.id = 'root'
document.body.appendChild(root)

render(() => <HelloMessage name='World' />, root)
