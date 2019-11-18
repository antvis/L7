import * as d3 from 'd3-color';
export interface IColorRamp {
  positions: number[];
  colors: string[];
}
export function rgb2arr(str: string) {
  const color = d3.color(str) as d3.RGBColor;
  const arr = [0, 0, 0, 0];
  if (color != null) {
    arr[0] = color.r / 255;
    arr[1] = color.g / 255;
    arr[2] = color.b / 255;
    arr[3] = color.opacity;
  }
  return arr;
}

export function generateColorRamp(colorRamp: IColorRamp): ImageData {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  canvas.width = 256;
  canvas.height = 1;
  const gradient = ctx.createLinearGradient(0, 0, 256, 0);
  let data = null;
  const min = colorRamp.positions[0];
  const max = colorRamp.positions[colorRamp.positions.length - 1];
  for (let i = 0; i < colorRamp.colors.length; ++i) {
    const value = (colorRamp.positions[i] - min) / (max - min);
    gradient.addColorStop(value, colorRamp.colors[i]);
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 1);
  data = new Uint8ClampedArray(ctx.getImageData(0, 0, 256, 1).data);

  return new ImageData(data, 16, 16);
}
