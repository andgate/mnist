import { Component, onMount, useContext } from 'solid-js';
import { createStore } from "solid-js/store";
import { GlobalStateContext } from './GlobalProvider';

function getCursorPosition(canvas: HTMLCanvasElement, event: MouseEvent) {
  const rect = canvas.getBoundingClientRect(),
    scaleX = canvas.width / rect.width,
    scaleY = canvas.height / rect.height
  return {
    x: event.offsetX * scaleX / 2.0,
    y: event.offsetY * scaleY / 2.0
  }
}

export const CanvasDraw: Component = props => {
  let canvasRef: HTMLCanvasElement;
  let scaledCanvasRef: HTMLCanvasElement;

  const [global, hooks] = useContext(GlobalStateContext)

  let ctx: CanvasRenderingContext2D | null;
  const [localStore, setLocalStore] = createStore({ isDrawing: false })

  onMount(() => {
    canvasRef.width = 1024
    canvasRef.height = 1024
    canvasRef.style.width = '300px'
    canvasRef.style.height = '300px'
    ctx = canvasRef.getContext('2d')
    if (ctx) {
      ctx.scale(2, 2)
      ctx.lineCap = 'round'
      ctx.strokeStyle = 'black'
      ctx.lineWidth = 12
    }
  })

  const startDrawing = (ev: MouseEvent) => {
    const p = getCursorPosition(canvasRef, ev)

    if (ctx) {
      ctx.beginPath()
      ctx.moveTo(p.x, p.y)
    }

    setLocalStore('isDrawing', true)
  }

  const finishDrawing = () => {
    if (!localStore.isDrawing) {
      return
    }
    if (ctx) {
      ctx.closePath()
      const scaledContext = scaledCanvasRef.getContext('2d') as CanvasRenderingContext2D
      scaledContext.clearRect(0, 0, scaledCanvasRef.width, scaledCanvasRef.height);
      scaledContext.scale(0.5, 0.5);
      scaledContext.drawImage(canvasRef, 0, 0);
      hooks.setData(ctx.getImageData(0, 0, 28, 28))
    }

    setLocalStore('isDrawing', false)
  }

  const draw = (ev: MouseEvent) => {
    if (!localStore.isDrawing) {
      return
    }
    const p = getCursorPosition(canvasRef, ev)
    if (ctx) {
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
    }
  }

  const clear = () => {
    finishDrawing()
    ctx?.clearRect(0, 0, canvasRef.width, canvasRef.height);
  }

  return <div>
    <canvas
      ref={scaledCanvasRef}
      width="28"
      height="28"
      style="display: none"
    />
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={draw}
    />
    <button onClick={clear}>Clear</button>
  </div>
}