import { App } from "./App";
import { render } from "solid-js/web";

const root: HTMLDivElement = document.createElement('div')
root.id = 'root'
document.body.appendChild(root)

render(() => <App />, root)
