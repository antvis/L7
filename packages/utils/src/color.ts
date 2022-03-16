import * as d3 from 'd3-color';
import { $window, isMini } from './mini-adapter';
export interface IColorRamp {
  positions: number[];
  colors: string[];
}

export function isColor(str: any) {
  if (typeof str === 'string') {
    return !!(d3.color(str) as d3.RGBColor);
  } else {
    return false;
  }
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

export function decodePickingColor(color: Uint8Array): number {
  const i1 = color && color[0];
  const i2 = color && color[1];
  const i3 = color && color[2];
  // 1 was added to seperate from no selection
  const index = i1 + i2 * 256 + i3 * 65536 - 1;
  return index;
}

export function encodePickingColor(
  featureIdx: number,
): [number, number, number] {
  return [
    (featureIdx + 1) & 255,
    ((featureIdx + 1) >> 8) & 255,
    (((featureIdx + 1) >> 8) >> 8) & 255,
  ];
}

export interface IImagedata {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

export function generateColorRamp(
  colorRamp: IColorRamp,
): ImageData | IImagedata {
  const canvas = $window.document.createElement('canvas');
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  canvas.width = 256;
  canvas.height = 1;
  const gradient = ctx.createLinearGradient(0, 0, 256, 1);
  let data = null;
  const min = colorRamp.positions[0];
  const max = colorRamp.positions[colorRamp.positions.length - 1];
  for (let i = 0; i < colorRamp.colors.length; ++i) {
    const value = (colorRamp.positions[i] - min) / (max - min);
    gradient.addColorStop(value, colorRamp.colors[i]);
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 1);

  // data = new Uint8ClampedArray(ctx.getImageData(0, 0, 256, 1).data);
  // return !isMini
  //   ? new ImageData(data, 256, 1)
  //   : { data, width: 256, height: 1 };

  if (!isMini) {
    data = ctx.getImageData(0, 0, 256, 1).data;
    // 使用 createImageData 替代 new ImageData、兼容 IE11
    const imageData = ctx.createImageData(256, 1);
    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i + 0] = data[i + 0];
      imageData.data[i + 1] = data[i + 1];
      imageData.data[i + 2] = data[i + 2];
      imageData.data[i + 3] = data[i + 3];
    }
    return imageData;
  } else {
    data = new Uint8ClampedArray(ctx.getImageData(0, 0, 256, 1).data);
    return { data, width: 256, height: 1 };
  }
}
