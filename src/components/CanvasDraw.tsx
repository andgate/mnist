import { Component, createEffect, onMount, createMemo } from 'solid-js';
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
  let canvasRef!: HTMLCanvasElement;
  let scaledCanvasRef!: HTMLCanvasElement;

  const [imageDataStore, imageDataStoreCommands] = useImageDataStore()

  let ctx: CanvasRenderingContext2D | null;
  let scaledCtx: CanvasRenderingContext2D | null;
  const [localStore, setLocalStore] = createStore({ isDrawing: false })

  const initializeDrawingCanvas = () => {
    if (!ctx) {
      console.warn('Could not get drawing canvas context in onMount')  
      return
    }

    ctx.scale(2, 2)
    ctx.lineCap = 'round'
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 24
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvasRef.width, canvasRef.height)
    imageDataStoreCommands.normalizeImage()
  }

  onMount(() => {
    imageDataStoreCommands.setDrawingCanvas(canvasRef)
    canvasRef.width = 1024
    canvasRef.height = 1024
    canvasRef.style.width = '300px'
    canvasRef.style.height = '300px'
    ctx = canvasRef.getContext('2d')
    scaledCtx = scaledCanvasRef.getContext('2d')
    initializeDrawingCanvas()
  })

  
  const normalizedImage = createMemo(() => imageDataStore.normalizedImage) 

  createEffect(() => {
    if (!scaledCtx) {
      return
    }

    const newNormalizedImage = normalizedImage()
    const newScaledCanvas = newNormalizedImage.rgba8().getCanvas()
    const normalizedImageData = newScaledCanvas.getContext('2d')?.getImageData(0, 0, 28, 28)

    scaledCtx?.clearRect(0, 0, scaledCanvasRef.width, scaledCanvasRef.height)
    if (normalizedImageData) {
      scaledCtx?.putImageData(normalizedImageData, 0, 0)
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

  const finishDrawing = () => {
    if (!localStore.isDrawing || !ctx) {
      return
    }
    ctx.closePath()
    imageDataStoreCommands.normalizeImage()
    setLocalStore('isDrawing', false)
  }

  const draw = (ev: MouseEvent) => {
    if (!localStore.isDrawing || !ctx) {
      return
    }
    const p = getCursorPosition(canvasRef, ev)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
    imageDataStoreCommands.normalizeImage()
  }

  const clear = () => {
    if (!ctx || !scaledCtx) {
      return
    }
    
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvasRef.width, canvasRef.height)
    scaledCtx.clearRect(0, 0, scaledCanvasRef.width, scaledCanvasRef.height)
    imageDataStoreCommands.normalizeImage()
  }

  return <div>
    <canvas
      ref={scaledCanvasRef}
      width="28"
      height="28"
      // style='display: none'
    />
    <canvas
      id='drawing-canvas'
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={draw}
      onMouseLeave={finishDrawing}
    />
    <button onClick={clear}>Clear</button>
  </div>
}