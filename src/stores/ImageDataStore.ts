import { Image } from 'image-js'

export type ImageDataStore = {
  drawingCanvas?: HTMLCanvasElement
  normalizedImage: Image
}

export type ImageDataStoreCommands = {
  setDrawingCanvas: (canvas: HTMLCanvasElement) => void
  normalizeImage: () => void
}

export const emptyImageDataStore: ImageDataStore = {
  normalizedImage: new Image(28, 28).grey()
}
