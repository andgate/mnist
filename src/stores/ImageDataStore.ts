export type ImageDataStore = {
  imageData: ImageData
}

export type ImageDataStoreCommands = {
  setImageData: (newData: ImageData) => void
}

export const emptyImageData: ImageData =
  new ImageData(28, 28)

export const emptyImageDataStore: ImageDataStore =
  { imageData: emptyImageData }
