import earcut from 'earcut';
import type { ArrowType, IArrowOptions, ILineSymbol } from '../interface';
import { circle } from './Path';

export interface IArrowData {
  vertices: number[];
  indices: number[];
  outLineIndices: number[];
  dimensions: number;
  offset?: number[];
  normals: number[];
}
const maxArrowWidthMap = {
  circle: 2,
  triangle: 2,
  diamond: 4,
  rect: 2,
  classic: 3,
  halfTriangle: 2,
  none: 0,
};
export type arrowPosition = -1 | 1;
const PathHeight = 1 / 2;
export function halfTriangleArrow(dir: arrowPosition, options: IArrowOptions): IArrowData {
  const { width = 2, height = 1 } = options;
  return {
    vertices: [
      0,
      PathHeight * dir,
      1 * dir * width,
      -(height + PathHeight) * dir,
      1 * dir * width,
      (height - PathHeight) * dir,
      0,
      PathHeight * dir,
      1 * dir * width,
      -(height + PathHeight) * dir,
      1 * dir * width,
      (height - PathHeight) * dir,
    ],
    indices: [3, 4, 5],
    outLineIndices: [0, 1, 2],
    normals: [
      1 * dir,
      -2 * dir,
      1, // y,x
      -2 * dir,
      1.5 * dir,
      1,
      1 * dir,
      1.5 * dir,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ],
    dimensions: 2,
  };
}
export function triangleArrow(dir: arrowPosition, options: IArrowOptions): IArrowData {
  const { width = 2, height = 3 } = options;
  return {
    vertices: [
      0,
      0,
      1 * dir * width,
      1 * height,
      1 * dir * width,
      -1 * height,
      0,
      0,
      1 * dir * width,
      1 * height,
      1 * dir * width,
      -1 * height,
    ],
    outLineIndices: [0, 1, 2],
    indices: [3, 4, 5],
    normals: [0, -1.5 * dir, 1, 2, 1 * dir, 1, -2, 1 * dir, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    dimensions: 2,
  };
}
export function rectArrow(dir: arrowPosition, options: IArrowOptions): IArrowData {
  const { width = 2, height = 2 } = options;
  return {
    vertices: [
      0,
      height / 2,
      dir * width * 1,
      height / 2,
      dir * width * 1,
      -height / 2,
      0,
      -height / 2,
      0,
      height / 2,
      dir * width * 1,
      height / 2,
      dir * width * 1,
      -height / 2,
      0,
      -height / 2,
    ],
    dimensions: 2,
    indices: [4, 5, 6, 4, 6, 7],
    outLineIndices: [0, 1, 2, 0, 2, 3],
    normals: [0, -dir, 1, 1, 0, 1, 0, -dir, 1, -1, -0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  };
}
export function diamondArrow(dir: arrowPosition, options: IArrowOptions): IArrowData {
  const { width = 2, height = 3 } = options;
  return {
    vertices: [
      0,
      0,
      1 * width * dir,
      0.5 * height,
      2 * width * dir,
      0,
      1 * width * dir,
      -0.5 * height,
      0,
      0,
      1 * width * dir,
      0.5 * height,
      2 * width * dir,
      0,
      1 * width * dir,
      -0.5 * height,
    ],
    dimensions: 2,
    indices: [4, 5, 6, 4, 6, 7],
    outLineIndices: [0, 1, 2, 0, 2, 3],
    normals: [0, -dir, 1, 1, 0, 1, 0, -dir, 1, -1, -0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  };
}
export function classicArrow(dir: arrowPosition, options: IArrowOptions): IArrowData {
  const { width = 2, height = 3 } = options;
  return {
    vertices: [
      0,
      0,
      2 * dir * width,
      1 * height,
      1.5 * dir * width,
      0,
      2 * dir * width,
      -1 * height,
      0,
      0,
      2 * dir * width,
      1 * height,
      1.5 * dir * width,
      0,
      2 * dir * width,
      -1 * height,
    ],
    dimensions: 2,
    indices: [4, 5, 6, 4, 6, 7],
    outLineIndices: [0, 1, 2, 0, 2, 3],
    normals: [0, -dir, 1, 1, 0, 1, 0, -dir, 1, -1, -0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  };
}

export function circleArraw(dir: arrowPosition, options: IArrowOptions): IArrowData {
  const { width = 2, height = 2 } = options;
  const path = circle();
  const flattengeo = earcut.flatten([path]);
  const triangles = earcut(flattengeo.vertices, flattengeo.holes, flattengeo.dimensions);
  // @ts-ignore
  const vertice = path.map((t) => [t[0] * width * dir, t[1] * height]).flat();
  return {
    vertices: [...vertice, ...vertice],
    dimensions: 2,
    indices: triangles.map((v) => v + path.length),
    outLineIndices: triangles,
    normals: [
      // @ts-ignore
      ...path.map((t) => [t[1] * height, t[0] * width * dir, 1]).flat(),
      ...new Array(path.length * 3).fill(0),
    ],
  };
}

export function lineArrowPath(
  coord: number[],
  indexOffset: number = 0,
  symbol: ILineSymbol,
): IArrowData {
  const sourceType =
    typeof symbol['source'] === 'object' ? symbol['source'].type : symbol['source'];
  const targetType =
    typeof symbol['target'] === 'object' ? symbol['target'].type : symbol['target'];
  const { width: sourceWidth = sourceType ? maxArrowWidthMap[sourceType] : 0 } =
    typeof symbol['source'] === 'object' ? symbol['source'] : {};
  const { width: targetWidth = targetType ? maxArrowWidthMap[targetType] : 0 } =
    typeof symbol['target'] === 'object' ? symbol['target'] : {};
  return {
    vertices: [
      0,
      PathHeight,
      1 * sourceWidth,
      ...coord,
      1,
      PathHeight,
      -1 * targetWidth,
      ...coord,
      1,
      -PathHeight,
      -1 * targetWidth,
      ...coord,
      0,
      -PathHeight,
      1 * sourceWidth,
      ...coord,
      0,
      PathHeight,
      1 * sourceWidth,
      ...coord,
      1,
      PathHeight,
      -1 * targetWidth,
      ...coord,
      1,
      -PathHeight,
      -1 * targetWidth,
      ...coord,
      0,
      -PathHeight,
      1 * sourceWidth,
      ...coord,
    ],
    outLineIndices: [0, 1, 2, 0, 2, 3].map((t) => t + indexOffset),
    indices: [4, 5, 6, 4, 6, 7].map((t) => t + indexOffset),
    normals: [1, -1, 1, 1, 1, 1, -1, 0, 1, -1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    dimensions: 2,
  };
}

export function getSymbol(type: ArrowType | IArrowOptions, position: 'source' | 'target') {
  const shape = typeof type === 'object' ? type.type : type;
  const dir = position === 'source' ? 1 : -1;
  const option = typeof type === 'object' ? type : ({} as IArrowOptions);
  switch (shape) {
    case 'circle':
      return circleArraw(dir, option);
    case 'triangle':
      return triangleArrow(dir, option);
    case 'diamond':
      return diamondArrow(dir, option);
    case 'rect':
      return rectArrow(dir, option);
    case 'classic':
      return classicArrow(dir, option);
    case 'halfTriangle':
      return halfTriangleArrow(dir, option);
    default:
      return {
        vertices: [],
        indices: [],
        normals: [],
        dimensions: 2,
        outLineIndices: [],
        outLineNormals: [],
      };
  }
}
