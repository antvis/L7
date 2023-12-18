import type { IParseDataItem } from '@antv/l7-core';
// @ts-ignore
import Martini from '@mapbox/martini';
export function RasterTriangulation(parserData: IParseDataItem) {
  const { data, width, height } = parserData;
  const maxlength = Math.max(width, height);
  const gridSize = Math.pow(2, Math.ceil(Math.log2(maxlength))) + 1;
  const terrain = new Float32Array(gridSize * gridSize);
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      terrain[i * gridSize + j] = data[i * width + j];
    }
  }
  const martini = new Martini(gridSize);
  const tile = martini.createTile(terrain);
  const mesh = tile.getMesh(gridSize / 2);
  return {
    vertices: Array.from(mesh.vertices) as number[],
    indices: Array.from(mesh.triangles) as number[],
    size: 2,
  };
}
