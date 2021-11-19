import { Context, createContext, useContext } from "solid-js";
import { Store } from "solid-js/store";
import { emptyImageDataStore, ImageDataStore, ImageDataStoreCommands } from "../stores/ImageDataStore";

export const ImageDataStoreContext: Context<[ImageDataStore, ImageDataStoreCommands]> =
  createContext([emptyImageDataStore, { setImageData: (_newData: ImageData) => { } }])

export const useImageDataStore = (): [Store<ImageDataStore>, ImageDataStoreCommands] =>
  useContext(ImageDataStoreContext)
