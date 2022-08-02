import earcut from 'earcut';
import { calculateCentroid } from '../geo';
import ExtrudePolyline from './extrude_polyline';
import { IEncodeFeature } from './interface';

export function LineTriangulation(feature: IEncodeFeature) {
  const { coordinates, originCoordinates, version } = feature;
  // let path = coordinates as number[][][] | number[][];
  // if (!Array.isArray(path[0][0])) {
  //   path = [coordinates] as number[][][];
  // }

  const line = new ExtrudePolyline({
    dash: true,
    join: 'bevel',
  });

  if (version === 'GAODE2.x') {
    // 处理高德2.0几何体构建
    let path1 = coordinates as number[][][] | number[][]; // 计算位置
    if (!Array.isArray(path1[0][0])) {
      path1 = [coordinates] as number[][][];
    }
    let path2 = originCoordinates as number[][][] | number[][]; // 计算法线
    if (!Array.isArray(path2[0][0])) {
      path2 = [originCoordinates] as number[][][];
    }

    for (let i = 0; i < path1.length; i++) {
      // 高德2.0在计算线时，需要使用经纬度计算发现，使用 customCoords.lnglatToCoords 计算的数据来计算顶点的位置
      const item1 = path1[i];
      const item2 = path2[i];
      line.extrude_gaode2(item1 as number[][], item2 as number[][]);
    }
  } else {
    // 处理非高德2.0的几何体构建
    let path = coordinates as number[][][] | number[][];
    if (path[0] && !Array.isArray(path[0][0])) {
      path = [coordinates] as number[][][];
    }
    path.forEach((item: any) => {
      line.extrude(item as number[][]);
    });
  }

  const linebuffer = line.complex;
  return {
    vertices: linebuffer.positions, // [ x,y,z, distance, miter,total ]
    indices: linebuffer.indices,
    normals: linebuffer.normals,
    indexes: linebuffer.indexes,
    size: 6,
  };
}

export function PointFillTriangulation(feature: IEncodeFeature) {
  const coordinates = calculateCentroid(feature.coordinates);
  return {
    vertices: [...coordinates, ...coordinates, ...coordinates, ...coordinates],
    indices: [0, 1, 2, 2, 3, 0],
    size: coordinates.length,
  };
}

export function polygonFillTriangulation(feature: IEncodeFeature) {
  const { coordinates } = feature;
  const flattengeo = earcut.flatten(coordinates as number[][][]);
  const { vertices, dimensions, holes } = flattengeo;
  return {
    indices: earcut(vertices, holes, dimensions),
    vertices,
    size: dimensions,
  };
}
