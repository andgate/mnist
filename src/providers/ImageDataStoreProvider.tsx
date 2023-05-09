import { Component, createEffect, createMemo, createResource } from "solid-js";
import { createStore, Store } from "solid-js/store";
import { ImageDataStoreContext } from "../contexts/ImageDataStoreContext";
import { emptyImageDataStore, ImageDataStore, ImageDataStoreCommands } from "../stores/ImageDataStore";
import { createNormalizedImage } from "../utils/image-normalization";
import { Image } from 'image-js'

export const ImageDataStoreProvider: Component = (props) => {
  const [state, setState] = createStore(emptyImageDataStore)

  const store: [Store<ImageDataStore>, ImageDataStoreCommands] = [
    state,
    {
      setDrawingCanvas(canvas: HTMLCanvasElement) {
        setState('drawingCanvas', canvas)
      },
      normalizeImage() {
        if (!state.drawingCanvas) {
          setState('normalizedImage', new Image(28, 28).grey())
          return
        }

        const normalizedImage = createNormalizedImage(state.drawingCanvas)
        setState('normalizedImage', normalizedImage)
      }
    },
  ]

  return (
    <ImageDataStoreContext.Provider value={store}>
      {props.children}
    </ImageDataStoreContext.Provider>
  )
}
