import * as d3 from 'd3-color';
import { $window, isMini } from './mini-adapter';
export interface IColorRamp {
  positions?: number[];
  colors?: string[];
  weights?: number[];
  [key: string]: any;
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

enum ColorRampType {
  LINEAR =  'linear',
  CAT = 'cat'
}

type ColorCategory = [number, number, string];

function getColorRampType(colorRamp: IColorRamp) {
  if(colorRamp.colors && colorRamp.positions) {
    return ColorRampType.LINEAR;
  } else {
    return ColorRampType.CAT;
  }
}

function isValid(category: any) {
  // valid category - [number, number, string?] || string
 if(typeof category === 'string') return true;
 if(Array.isArray(category) && category.length === 3) {
   return typeof category[0] === 'number' &&
   typeof category[1] === 'number' &&
   typeof category[2] === 'string'
 }
 return false;
}

export function formatCategory(colorRamp: IColorRamp) {
  /**
   * {
   *  a: '#f00',
   *  b: [0.2, 0.3, #ff0],
   *  c: [0.3, 0.4, #0f0],
   *  d: '#fff',
   *  e: #0ff
   * }
   */
  
  const keywords = ['colors', 'position', 'default'];

  /** categories
   * [
   *  [0, 0.2 #f00],
   *  [0.2, 0.3, #ff0],
   *  [0.3, 0.4, #ff0],
   *  [0.4, 1.0, #fff, #0ff]
   * ]
   */
  const categories: any[]= [];
  let range = 0;
  Object.keys(colorRamp)
  .filter(key => keywords.indexOf(key) < 0)
  .filter(key => isValid(colorRamp[key]))
  .forEach((key) => {
    const category = colorRamp[key];
    const last = categories[categories.length - 1];
    if(Array.isArray(category)) {
      // category === [number, number, color]
      if(last) {
        if(last[1] === -1) {
            last[1] = category[0];
        } else if(last[1] < category[0]){
            categories.push([last[1], category[0], null])
        }
    }
      range = category[1];
      categories.push(category);
    } else {
      // category === color
      if(last && last[1] === -1) {
        last.push(category)
      } else {
        categories.push([range, -1, category])
      }
    }
    return category
  })

  // incase all raw color
  if(categories.length > 0) {
    categories[categories.length - 1][1] = 1;
  }

  const validCategories: ColorCategory[] = [];
  categories.forEach(category => {
    const [start, end, ...colors] = category;
    const step = (end - start)/colors.length;
    colors.forEach((color: string, index: number) => {
      validCategories.push([start + index * step, start + (index + 1) * step, color])
    })
  })
  return validCategories;
}

// draw cat color
function drawCat(colorRamp: IColorRamp, ctx: CanvasRenderingContext2D) {
  // 色带未指定部分的默认颜色
  const defaultColor = colorRamp.default || '#fff';
  const canvasWidth = 256;
  const categories =  formatCategory(colorRamp);
  categories.forEach(([start, end, color]) => {
    const drawColor = isColor(color) ? color : defaultColor;
    ctx.fillStyle = drawColor;
    ctx.fillRect(start * canvasWidth, 0, end * canvasWidth, 1);
  })
}

// draw linear color
function drawLinear(colorRamp: IColorRamp, ctx: CanvasRenderingContext2D) {
  const gradient = ctx.createLinearGradient(0, 0, 256, 1);
  const positions = colorRamp.positions as number[];
  const colors = colorRamp.colors as string[];
  const min = positions[0];
  const max = positions[positions.length - 1];
  for (let i = 0; i < colors.length; ++i) {
    const value = (positions[i] - min) / (max - min);
    gradient.addColorStop(value, colors[i]);
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 1);
}

function getColorData(ctx: CanvasRenderingContext2D) {
  let data = null;
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

export function generateColorRampKey(colorRamp: IColorRamp) {
  const type = getColorRampType(colorRamp);
  switch(type) {
    case ColorRampType.CAT:
      const defaultColor = colorRamp.default || '#fff';
      const categories =  formatCategory(colorRamp);
      const fields: string[] = [];
      const values: string[] = [];
      categories.forEach(category => {
        const start = category[0];
        const end = category[1];
        const color = category[2];
        fields.push(String(start));
        fields.push(String(end));
        const drawColor = isColor(color) ? color : defaultColor;
        values.push(drawColor)
      })
      if(categories.length > 0) {
        fields.push(String(categories[categories.length - 1][0]));
        fields.push(String(categories[categories.length - 1][1]));
        values.push(categories[categories.length - 1][2]);
      }
      return [...values, ...fields].join('_');
    case ColorRampType.LINEAR:
      return `${colorRamp?.colors?.join('_')}_${colorRamp?.positions?.join('_')}`;
  }

}

/**
 * init color texture for data range
 * @param colorRamp 
 * @returns 
 */
export function generateColorRamp(
  colorRamp: IColorRamp,
): ImageData | IImagedata {
  let canvas = $window.document.createElement('canvas');
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  canvas.width = 256;
  canvas.height = 1;

  const type = getColorRampType(colorRamp);
  switch(type) {
    case ColorRampType.CAT:
      drawCat(colorRamp, ctx);
      break;
    case ColorRampType.LINEAR:
      drawLinear(colorRamp, ctx);
      break;
  }

  const colorData = getColorData(ctx);

  canvas.width = 0;
  canvas.height = 0;
  canvas = null;
  return colorData;
}
