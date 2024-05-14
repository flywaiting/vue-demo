export function loadImage(f: File) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image()
        img.src = URL.createObjectURL(f)
        img.onload = () => resolve(img)
        img.onerror = reject
    })
}

export function saveImage(blob: Blob) {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `Image-${Date.now()}`
    a.click()
    a.remove()
}
