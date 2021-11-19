import { Component, onMount } from 'solid-js';
import { createStore } from "solid-js/store";
import { useImageDataStore } from '../contexts/ImageDataStoreContext';

function getCursorPosition(canvas: HTMLCanvasElement, event: MouseEvent) {
  const rect = canvas.getBoundingClientRect(),
    scaleX = canvas.width / rect.width,
    scaleY = canvas.height / rect.height
  return {
    x: event.offsetX * scaleX / 2.0,
    y: event.offsetY * scaleY / 2.0
  }
}

export const CanvasDraw: Component = () => {
  let canvasRef: HTMLCanvasElement;
  let scaledCanvasRef: HTMLCanvasElement;

  const [_imageData, imageDataStoreHooks] = useImageDataStore()

  let ctx: CanvasRenderingContext2D | null;
  let scaledCtx: CanvasRenderingContext2D | null;
  const [localStore, setLocalStore] = createStore({ isDrawing: false })

  onMount(() => {
    canvasRef.width = 1024
    canvasRef.height = 1024
    canvasRef.style.width = '300px'
    canvasRef.style.height = '300px'
    ctx = canvasRef.getContext('2d')
    scaledCtx = scaledCanvasRef.getContext('2d')
    if (ctx) {
      ctx.scale(2, 2)
      ctx.lineCap = 'round'
      ctx.strokeStyle = 'black'
      ctx.lineWidth = 12
    }
  })

  const startDrawing = (ev: MouseEvent) => {
    if (!ctx) {
      return
    }
    const p = getCursorPosition(canvasRef, ev)

    ctx.beginPath()
    ctx.moveTo(p.x, p.y)

    setLocalStore('isDrawing', true)
  }

  const updateImageDateStore = () => {
    if (!scaledCtx) {
      return
    }
    imageDataStoreHooks.setImageData(scaledCtx.getImageData(0, 0, scaledCanvasRef.width, scaledCanvasRef.height))
  }

  const updateScaledCanvas = () => {
    if (!ctx || !scaledCtx) {
      return
    }
    const scaleX = scaledCanvasRef.width / canvasRef.width
    const scaleY = scaledCanvasRef.height / canvasRef.height
    scaledCtx.clearRect(0, 0, scaledCanvasRef.width, scaledCanvasRef.height)
    scaledCtx.scale(scaleX, scaleY)
    scaledCtx.drawImage(canvasRef, 0, 0)
    scaledCtx.scale(1.0 / scaleX, 1.0 / scaleY)
    updateImageDateStore()
  }

  const finishDrawing = () => {
    if (!localStore.isDrawing || !ctx) {
      return
    }
    ctx.closePath()
    updateScaledCanvas()
    setLocalStore('isDrawing', false)
  }

  const draw = (ev: MouseEvent) => {
    if (!localStore.isDrawing || !ctx) {
      return
    }
    const p = getCursorPosition(canvasRef, ev)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
  }

  const clear = () => {
    if (!ctx || !scaledCtx) {
      return
    }
    ctx.clearRect(0, 0, canvasRef.width, canvasRef.height)
    scaledCtx.clearRect(0, 0, scaledCanvasRef.width, scaledCanvasRef.height)
    updateImageDateStore()
  }

  return <div>
    <canvas
      ref={scaledCanvasRef}
      width="28"
      height="28"
      style='display: none'
    />
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={draw}
      onMouseLeave={finishDrawing}
    />
    <button onClick={clear}>Clear</button>
  </div>
}