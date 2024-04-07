import * as d3 from 'd3-color';
import type { Context } from 'vm';
export interface IColorRamp {
  type?: 'cat' | 'linear' | 'quantize' | 'custom';
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

export function encodePickingColor(featureIdx: number): [number, number, number] {
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

// 连续型 老版本兼容
export function generateColorRamp(colorRamp: IColorRamp): ImageData | IImagedata {
  let canvas = window.document.createElement('canvas');
  let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  canvas.width = 256;
  canvas.height = 1;
  let data = null;

  // draw linear color
  const gradient = ctx.createLinearGradient(0, 0, 256, 1);

  const min = colorRamp.positions[0];
  const max = colorRamp.positions[colorRamp.positions.length - 1];
  for (let i = 0; i < colorRamp.colors.length; ++i) {
    const value = (colorRamp.positions[i] - min) / (max - min);
    gradient.addColorStop(value, colorRamp.colors[i]);
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 1);

  data = new Uint8ClampedArray(ctx.getImageData(0, 0, 256, 1).data);
  // @ts-ignore
  canvas = null;
  // @ts-ignore
  ctx = null;
  return { data, width: 256, height: 1 };
}

// 连续型 Position 支持设置原始数据
export function generateLinearRamp(
  colorRamp: IColorRamp,
  domain: [number, number],
): ImageData | IImagedata {
  let canvas = window.document.createElement('canvas');
  let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  canvas.width = 256;
  canvas.height = 1;
  // draw linear color
  const gradient = ctx.createLinearGradient(0, 0, 256, 1);
  const step = domain[1] - domain[0];

  for (let i = 0; i < colorRamp.colors.length; ++i) {
    const value = Math.max((colorRamp.positions[i] - domain[0]) / step, 0);
    gradient.addColorStop(value, colorRamp.colors[i]);
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 1);
  const data = ctx.getImageData(0, 0, 256, 1).data;
  const imageData = toIEIMageData(ctx, data);

  // @ts-ignore
  canvas = null;
  // @ts-ignore
  ctx = null;
  return imageData;
}

// 枚举类型
export function generateCatRamp(colorRamp: IColorRamp): ImageData | IImagedata {
  let canvas = window.document.createElement('canvas');
  let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  canvas.width = 256;
  canvas.height = 1;
  const imageData = ctx.createImageData(256, 1);
  imageData.data.fill(0);
  colorRamp.positions.forEach((p: number, index: number) => {
    const colorArray = rgb2arr(colorRamp.colors[index]);
    imageData.data[p * 4 + 0] = colorArray[0] * 255;
    imageData.data[p * 4 + 1] = colorArray[1] * 255;
    imageData.data[p * 4 + 2] = colorArray[2] * 255;
    imageData.data[p * 4 + 3] = colorArray[3] * 255;
  });
  // @ts-ignore
  canvas = null;
  // @ts-ignore
  ctx = null;
  return imageData;
}

// 等间距
export function generateQuantizeRamp(colorRamp: IColorRamp): ImageData | IImagedata {
  let canvas = window.document.createElement('canvas');
  let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.globalAlpha = 1.0;
  canvas.width = 256;
  canvas.height = 1;
  const step = 256 / colorRamp.colors.length; // TODO 精度问题
  // draw linear color
  for (let i = 0; i < colorRamp.colors.length; i++) {
    ctx.beginPath();
    ctx.lineWidth = 2;

    ctx.strokeStyle = colorRamp.colors[i];
    ctx.moveTo(i * step, 0); // positioned at 50,25
    ctx.lineTo((i + 1) * step, 0);
    ctx.stroke();
  }

  const data = ctx.getImageData(0, 0, 256, 1).data;
  // 使用 createImageData 替代 new ImageData、兼容 IE11
  const imageData = toIEIMageData(ctx, data);

  // @ts-ignore
  canvas = null;
  // @ts-ignore
  ctx = null;
  return imageData;
}

// 自定义间距

export function generateCustomRamp(
  colorRamp: IColorRamp,
  domain: [number, number],
): ImageData | IImagedata {
  let canvas = window.document.createElement('canvas');
  let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.globalAlpha = 1.0;
  canvas.width = 256;
  canvas.height = 1;
  const step = domain[1] - domain[0];
  if (colorRamp.positions.length - colorRamp.colors.length !== 1) {
    console.warn(
      'positions 的数字个数应当比 colors 的样式多一个,poisitions 的首尾值一般为数据的最大最新值',
    );
  }

  for (let i = 0; i < colorRamp.colors.length; i++) {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = colorRamp.colors[i];
    ctx.moveTo(((colorRamp.positions[i] - domain[0]) / step) * 255, 0); // positioned at 50,25
    ctx.lineTo(((colorRamp.positions[i + 1] - domain[0]) / step) * 255, 0);
    ctx.stroke();
  }
  const data = ctx.getImageData(0, 0, 256, 1).data;
  const imageData = toIEIMageData(ctx, data);
  // @ts-ignore
  canvas = null;
  // @ts-ignore
  ctx = null;
  return imageData;
}
function toIEIMageData(ctx: Context, data: Uint8ClampedArray) {
  const imageData = ctx.createImageData(256, 1);
  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i + 0] = data[i + 0];
    imageData.data[i + 1] = data[i + 1];
    imageData.data[i + 2] = data[i + 2];
    imageData.data[i + 3] = data[i + 3];
  }
  return imageData;
}

export function getDefaultDomain(rampColors: IColorRamp) {
  switch (rampColors?.type) {
    case 'cat':
      return [0, 255];
    default:
      return [0, 1];
  }
}
