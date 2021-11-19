import { Component } from "solid-js";
import { createStore, Store } from "solid-js/store";
import { ImageDataStoreContext } from "../contexts/ImageDataStoreContext";
import { emptyImageDataStore, ImageDataStore, ImageDataStoreCommands } from "../stores/ImageDataStore";

export const ImageDataStoreProvider: Component = (props) => {
  const [state, setState] = createStore(emptyImageDataStore)
  const store: [Store<ImageDataStore>, ImageDataStoreCommands] = [
    state,
    {
      setImageData(newData: ImageData) {
        setState('imageData', newData)
      }
    },
  ]

  return (
    <ImageDataStoreContext.Provider value={store}>
      {props.children}
    </ImageDataStoreContext.Provider>
  )
}
