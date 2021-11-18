import { Component, Context, createContext, useContext } from "solid-js";
import { createStore, Store } from "solid-js/store";

type ImageDataCommands = {
  setImageData: (newData: ImageData) => void
}

const emptyImageData: ImageData = new ImageData(28, 28)

export const ImageDataContext: Context<[ImageData, ImageDataCommands]> =
  createContext([emptyImageData, { setImageData: (_newData: ImageData) => { } }])

export const ImageDataProvider: Component = (props) => {
  const [state, setState] = createStore(emptyImageData)
  const store: [Store<ImageData>, ImageDataCommands] = [
    state,
    {
      setImageData(newData: ImageData) {
        setState(newData)
      }
    },
  ]

  return (
    <ImageDataContext.Provider value={store}>
      {props.children}
    </ImageDataContext.Provider>
  )
}

export const useImageData = (): [Store<ImageData>, ImageDataCommands] =>
  useContext(ImageDataContext)