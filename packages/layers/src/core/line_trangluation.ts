import type { IEncodeFeature } from '@antv/l7-core';
import type { ILineSymbol } from './interface';
import type { IArrowData } from './shape/arrow';
import { getSymbol, lineArrowPath } from './shape/arrow';

// list all arrow shape

// Half Edge
export function FlowHalfArrowFillTriangulation(feature: IEncodeFeature) {
  // @ts-ignore
  const coord = (feature.coordinates as Array<[number, number]>).flat();
  const tin = 1;
  const tout = 1.0;
  return {
    vertices: [
      1,
      0,
      0,
      ...coord, // 0
      1,
      2,
      -3,
      ...coord, // 1
      1,
      1,
      -3,
      ...coord, // 2
      0,
      1,
      0,
      ...coord, // 3
      0,
      0,
      0,
      ...coord, // 4
      1,
      0,
      0,
      ...coord, // 0
      1,
      2,
      -3,
      ...coord, // 1
      1,
      1,
      -3,
      ...coord, // 2
      0,
      1,
      0,
      ...coord, // 3
      0,
      0,
      0,
      ...coord, // 4
    ],
    normals: [
      -tin,
      2 * tout,
      1, // 0
      2 * tout,
      -tout,
      1, // 1
      tout,
      -tout,
      1, // 2
      tout,
      -tout,
      1, // 3
      -tin,
      -tout,
      1, // 4
      0,
      0,
      0,
      0,
      0,
      0,
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
    indices: [0, 1, 2, 0, 2, 3, 0, 3, 4, 5, 6, 7, 5, 7, 8, 5, 8, 9],
    size: 7,
  };
}

export function FlowLineTriangulation(feature: IEncodeFeature, symbolOption?: unknown) {
  return symbolOption
    ? ArrowLineTriangulation(feature, symbolOption)
    : FlowHalfArrowFillTriangulation(feature);
}

export function ArrowLineTriangulation(feature: IEncodeFeature, symbolOption?: unknown) {
  // @ts-ignore
  const coord = (feature.coordinates as Array<[number, number]>).flat();
  const { target = 'classic', source = 'circle' } = symbolOption as ILineSymbol;
  const startSymbol = shape2Vertices(getSymbol(source, 'source'), coord, 0, 0);
  const linePath = lineArrowPath(
    coord,
    startSymbol.vertices.length / 7,
    symbolOption as ILineSymbol,
  );
  const endSymbol = shape2Vertices(
    getSymbol(target, 'target'),
    coord,
    1,
    startSymbol.vertices.length / 7 + linePath.vertices.length / 7,
  );
  const data = {
    vertices: [...startSymbol.vertices, ...linePath.vertices, ...endSymbol.vertices],
    indices: [
      ...startSymbol.outLineIndices,
      ...linePath.outLineIndices,
      ...endSymbol.outLineIndices,
      ...startSymbol.indices,
      ...linePath.indices,
      ...endSymbol.indices,
    ],
    normals: [...startSymbol.normals, ...linePath.normals, ...endSymbol.normals],
    size: 7,
  };
  return data;
}
// start 0,end 1;
function shape2Vertices(
  shape: IArrowData,
  coord: number[],
  type: 0 | 1 = 1,
  indexOffset: number = 0,
) {
  const shapeVertices: number[] = [];
  const { vertices, indices, dimensions, outLineIndices } = shape;
  for (let i = 0; i < vertices.length; i += dimensions) {
    shapeVertices.push(type, vertices[i + 1], vertices[i], ...coord);
  }
  return {
    ...shape,
    vertices: shapeVertices,
    indices: indices.map((i) => i + indexOffset),
    outLineIndices: outLineIndices.map((i) => i + indexOffset),
  };
}
