import { Image } from 'image-js'

export function createNormalizedImage(canvas: HTMLCanvasElement): Image {
    const image = Image.fromCanvas(canvas)
    const normalizedImage = image
        .grey({ mergeAlpha: true })
        .resize({
            width: 28,
            height: 28,
        })
        .invert()
    return normalizedImage
}