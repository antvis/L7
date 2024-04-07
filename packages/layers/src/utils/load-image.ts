export async function loadImage(url: string): Promise<HTMLImageElement | ImageBitmap> {
  // @ts-ignore
  if (window.createImageBitmap) {
    const response = await fetch(url);
    const imageBitmap = await createImageBitmap(await response.blob());
    return imageBitmap;
  } else {
    const image = new window.Image();
    return new Promise((res) => {
      image.onload = () => res(image);
      image.src = url;
      image.crossOrigin = 'Anonymous';
    });
  }
}
