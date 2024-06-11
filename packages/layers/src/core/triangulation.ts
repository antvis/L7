import type { IEncodeFeature } from '@antv/l7-core';
import {
  aProjectFlat,
  calculateCentroid,
  calculatePointsCenterAndRadius,
  lngLatToMeters,
} from '@antv/l7-utils';
import earcut from 'earcut';
// @ts-ignore
import { vec3 } from 'gl-matrix';
import {
  EARTH_RADIUS,
  EARTH_RADIUS_OUTER,
  EARTH_SEGMENTS,
  lglt2xyz,
  primitiveSphere,
} from '../earth/utils';
import ExtrudePolyline from '../utils/extrude_polyline';
import type { IPosition, ShapeType2D, ShapeType3D } from './shape/Path';
import { geometryShape } from './shape/Path';
import type { IExtrudeGeomety } from './shape/extrude';
import extrudePolygon, { extrude_PolygonNormal, fillPolygon } from './shape/extrude';
import { getPolygonSurfaceIndices } from './utils';

type IShape = ShapeType2D & ShapeType3D;
interface IGeometryCache {
  [key: string]: IExtrudeGeomety;
}
const GeometryCache: IGeometryCache = {};

/**
 * 计算2D 填充点图顶点
 * @param feature 映射feature
 */

export function PointFillTriangulation(feature: IEncodeFeature) {
  const coordinates = calculateCentroid(feature.coordinates);
  return {
    vertices: [...coordinates, ...coordinates, ...coordinates, ...coordinates],
    indices: [0, 1, 2, 2, 3, 0],
    size: coordinates.length,
  };
}
/**
 * 计算2D 填充点图顶点 (地球模式)
 * @param feature 映射feature
 */
export function GlobelPointFillTriangulation(feature: IEncodeFeature) {
  const coordinates = calculateCentroid(feature.coordinates);
  const xyz = lglt2xyz(coordinates as [number, number]);
  return {
    vertices: [...xyz, ...xyz, ...xyz, ...xyz],
    indices: [0, 1, 2, 2, 3, 0],
    size: xyz.length,
  };
}

/**
 * 计算3D 拉伸点图
 * @param feature 映射feature
 */
export function PointExtrudeTriangulation(feature: IEncodeFeature) {
  const { shape } = feature;
  const { positions, index, normals } = getGeometry(shape as ShapeType3D, false);
  return {
    vertices: positions,
    indices: index,
    normals,
    size: 5,
  };
}

/**
 * 计算图片标注
 * @param feature 映射feature
 */
export function PointImageTriangulation(feature: IEncodeFeature) {
  const coordinates = calculateCentroid(feature.coordinates);
  return {
    vertices: [...coordinates],
    indices: [0],
    size: coordinates.length,
  };
}

/**
 * 线三角化
 * @param feature 映射feature
 */
export function LineTriangulation(feature: IEncodeFeature) {
  const { coordinates } = feature;
  // let path = coordinates as number[][][] | number[][];
  // if (!Array.isArray(path[0][0])) {
  //   path = [coordinates] as number[][][];
  // }

  const line = new ExtrudePolyline({
    dash: true,
    join: 'bevel',
  });

  let path = coordinates as number[][][] | number[][];
  if (path[0] && !Array.isArray(path[0][0])) {
    path = [coordinates] as number[][][];
  }
  path.forEach((item: any) => {
    line.extrude(item as number[][]);
  });

  const linebuffer = line.complex;
  return {
    vertices: linebuffer.positions, // [ x,y,z, distance, miter,total ]
    indices: linebuffer.indices,
    normals: linebuffer.normals,
    indexes: linebuffer.indexes,
    size: 6,
  };
}

export function FlowLineFillTriangulation(feature: IEncodeFeature) {
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
      -3, // mapbox 为正
      ...coord, // 1
      1,
      1,
      -3, // mapbox 为正
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
      -3, // mapbox 为正
      ...coord, // 1
      1,
      1,
      -3,
      // // mapbox 为正
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

export function SimpleLineTriangulation(feature: IEncodeFeature) {
  const { coordinates } = feature;
  const pos: any[] = [];
  if (!Array.isArray(coordinates[0])) {
    return {
      vertices: [],
      indices: [],
      normals: [],
      size: 6,
      count: 0,
    };
  }
  const { results, totalDistance } = getSimpleLineVertices(coordinates as IPosition[]);
  results.map((point) => {
    pos.push(point[0], point[1], point[2], point[3], 0, totalDistance);
  });

  return {
    vertices: pos,
    indices: [],
    normals: [],
    size: 6,
    count: results.length,
  };
}

export function TileSimpleLineTriangulation(feature: IEncodeFeature) {
  const { coordinates } = feature;
  const pos: any[] = [];
  if (!Array.isArray(coordinates[0])) {
    return {
      vertices: [],
      indices: [],
      size: 4,
      count: 0,
    };
  }
  const { results } = getTileSimpleLineVertices(coordinates as IPosition[]);
  results.map((point) => {
    pos.push(point[0], point[1], point[2], point[3]);
  });

  return {
    vertices: pos,
    indices: [],
    size: 4,
    count: results.length,
  };
}

function lineSegmentDistance(b1: number[], a1: number[]) {
  const dx = a1[0] - b1[0];
  const dy = a1[1] - b1[1];
  return Math.sqrt(dx * dx + dy * dy);
}

function pushDis(point: number[], n?: number) {
  if (point.length < 3) {
    point.push(0);
  }
  if (n !== undefined) {
    point.push(n);
  }
  return point;
}

function getSimpleLineVertices(coordinates: number[][]) {
  let points = coordinates;
  if (Array.isArray(points) && Array.isArray(points[0]) && Array.isArray(points[0][0])) {
    // @ts-ignore
    points = coordinates.flat();
  }
  //修改计算距离的方式,与普通线的计算方式保持一致 edit by huyang 20231214
  let distance = 0;
  if (points.length < 2) {
    return {
      results: points,
      totalDistance: 0,
    };
  } else {
    const results: number[][] = [];
    const point = pushDis(points[0], distance);
    results.push(point);

    for (let i = 1; i < points.length - 1; i++) {
      const subDistance = lineSegmentDistance(aProjectFlat(points[i - 1]), aProjectFlat(points[i]));
      distance += subDistance;

      const mulPoint = pushDis(points[i], distance);
      results.push(mulPoint);
      results.push(mulPoint);
    }
    const pointDistance = lineSegmentDistance(
      aProjectFlat(points[points.length - 2]),
      aProjectFlat(points[points.length - 1]),
    );
    distance += pointDistance;

    results.push(pushDis(points[points.length - 1], distance));
    return {
      results,
      totalDistance: distance,
    };
  }
}

function getTileSimpleLineVertices(points: number[][]) {
  if (points.length < 2) {
    return {
      results: points,
    };
  } else {
    const results: number[][] = [];
    const point = pushDis(points[0]);
    results.push(point);

    for (let i = 1; i < points.length - 1; i++) {
      const mulPoint = pushDis(points[i]);
      results.push(mulPoint);
      results.push(mulPoint);
    }
    results.push(pushDis(points[points.length - 1]));
    return {
      results,
    };
  }
}

export function polygonTriangulation(feature: IEncodeFeature) {
  const { coordinates } = feature;
  const flattengeo = earcut.flatten(coordinates as number[][][]);
  const { vertices, dimensions, holes } = flattengeo;

  const indices = getPolygonSurfaceIndices(vertices, holes, dimensions);

  return {
    indices,
    vertices,
    size: dimensions,
  };
}

// 构建几何图形（带有中心点和大小）
export function polygonTriangulationWithCenter(feature: IEncodeFeature) {
  const { indices, vertices, size } = polygonTriangulation(feature);

  return {
    indices: indices,
    vertices: getVerticesWithCenter(vertices),
    size: size + 4,
  };
}

function getVerticesWithCenter(vertices: number[]) {
  const verticesWithCenter = [];
  const { center, radius } = calculatePointsCenterAndRadius(vertices);
  for (let i = 0; i < vertices.length; i += 2) {
    const lng = vertices[i];
    const lat = vertices[i + 1];
    verticesWithCenter.push(lng, lat, 0, ...center, radius);
  }
  return verticesWithCenter;
}

export function PolygonExtrudeTriangulation(feature: IEncodeFeature) {
  const coordinates = feature.coordinates as IPosition[][];
  const { positions, index, normals } = extrude_PolygonNormal(coordinates, true);
  return {
    vertices: positions, // [ x, y, z, uv.x,uv.y ]
    indices: index,
    normals,
    size: 5,
  };
}

export function HeatmapGridTriangulation(feature: IEncodeFeature) {
  const { shape } = feature;
  const { positions, index } = getHeatmapGeometry(shape as IShape);
  return {
    vertices: positions, // [ x, y, z ] 多边形顶点
    indices: index,
    size: 3,
  };
}

/**
 * 图片图层顶点构造
 * @param feature 数据
 */
export function RasterImageTriangulation(feature: IEncodeFeature) {
  const coordinates = feature.coordinates as [number, number][];
  // [ x, y, z. uv.x, uv.y]
  const positions: number[] = [
    ...coordinates[0],
    0,
    0,
    0,
    ...coordinates[1],
    0,
    1,
    0,
    ...coordinates[2],
    0,
    1,
    1,
    ...coordinates[3],
    0,
    0,
    1,
  ];
  const indexs = [0, 1, 2, 0, 2, 3];
  return {
    vertices: positions,
    indices: indexs,
    size: 5,
  };
}

/**
 *  计算3D弧线顶点
 * @param feature 映射数据
 * @param segNum 弧线线段数
 */
export function LineArcTriangulation(feature: IEncodeFeature, styleOption?: unknown) {
  // @ts-ignore
  const { segmentNumber = 30 } = styleOption;
  const coordinates = feature.coordinates as IPosition[];
  const positions = [];
  const indexArray = [];
  for (let i = 0; i < segmentNumber; i++) {
    // 上线两个顶点
    // [ x, y, z, sx,sy, tx,ty]
    positions.push(
      i,
      1,
      i,
      coordinates[0][0],
      coordinates[0][1],
      coordinates[1][0],
      coordinates[1][1],
      i,
      -1,
      i,
      coordinates[0][0],
      coordinates[0][1],
      coordinates[1][0],
      coordinates[1][1],
    );

    if (i !== segmentNumber - 1) {
      indexArray.push(
        ...[0, 1, 2, 1, 3, 2].map((v) => {
          return i * 2 + v;
        }),
      );
    }
  }
  return {
    vertices: positions,
    indices: indexArray,
    size: 7,
  };
}

/**
 * 构建热力图密度图的顶点
 * @param feature
 * @returns
 */
export function HeatmapTriangulation(feature: IEncodeFeature) {
  const coordinates = feature.coordinates as number[];
  if (coordinates.length === 2) {
    coordinates.push(0);
  }
  const dir = addDir(-1, 1);
  const dir1 = addDir(1, 1);
  const dir2 = addDir(-1, -1);
  const dir3 = addDir(1, -1);
  // [x,y,z, dirx ,diry, weight]
  const positions = [
    ...coordinates,
    ...dir,
    ...coordinates,
    ...dir2,
    ...coordinates,
    ...dir3,
    ...coordinates,
    ...dir1,
  ];
  const indexArray = [0, 1, 2, 3, 0, 2];
  return {
    vertices: positions,
    indices: indexArray,
    size: 5,
  };
}

/**
 * 点图层3d geomerty
 * @param shape 3D形状
 */
function getGeometry(shape: ShapeType3D, needFlat = false): IExtrudeGeomety {
  if (GeometryCache && GeometryCache[shape]) {
    return GeometryCache[shape];
  }
  const path = geometryShape[shape] ? geometryShape[shape]() : geometryShape.cylinder();
  const geometry = extrude_PolygonNormal([path], needFlat);
  GeometryCache[shape] = geometry;
  return geometry;
}

export function computeVertexNormals(
  positions: number[],
  indexArray: number[],
  dim: number = 3,
  needFlat: boolean = false,
) {
  const normals = new Float32Array((positions.length / dim) * 3);
  let vA: number;
  let vB: number;
  let vC: number;
  const cb = vec3.create();
  const ab = vec3.create();
  const normal = vec3.create();
  for (let i = 0, li = indexArray.length; i < li; i += 3) {
    vA = indexArray[i + 0] * 3;
    vB = indexArray[i + 1] * 3;
    vC = indexArray[i + 2] * 3;
    let p1 = [positions[vA], positions[vA + 1]];
    let p2 = [positions[vB], positions[vB + 1]];
    let p3 = [positions[vC], positions[vC + 1]];
    if (needFlat) {
      p1 = lngLatToMeters(p1);
      p2 = lngLatToMeters(p2);
      p3 = lngLatToMeters(p3);
    }
    const [ax, ay] = p1;
    const pA = vec3.fromValues(ax, ay, positions[vA + 2]);
    const [bx, by] = p2;
    const pB = vec3.fromValues(bx, by, positions[vB + 2]);
    const [cx, cy] = p3;
    const pC = vec3.fromValues(cx, cy, positions[vC + 2]);
    vec3.sub(cb, pC, pB);
    vec3.sub(ab, pA, pB);
    vec3.cross(normal, cb, ab);
    normals[vA] += cb[0];
    normals[vA + 1] += cb[1];
    normals[vA + 2] += cb[2];
    normals[vB] += cb[0];
    normals[vB + 1] += cb[1];
    normals[vB + 2] += cb[2];
    normals[vC] += cb[0];
    normals[vC + 1] += cb[1];
    normals[vC + 2] += cb[2];
  }
  normalizeNormals(normals);
  return normals;
}

function normalizeNormals(normals: Float32Array) {
  for (let i = 0, li = normals.length; i < li; i += 3) {
    const normal = vec3.fromValues(normals[i], normals[i + 1], normals[i + 2]);
    const newNormal = vec3.create();
    vec3.normalize(newNormal, normal);
    normals.set(newNormal, i);
  }
}

export function checkIsClosed(points: number[][][]) {
  const p1 = points[0][0];
  const p2 = points[0][points[0].length - 1];
  return p1[0] === p2[0] && p1[1] === p2[1];
}

function getHeatmapGeometry(shape: ShapeType2D | ShapeType3D): IExtrudeGeomety {
  const shape3d = ['cylinder', 'triangleColumn', 'hexagonColumn', 'squareColumn'];
  const path = geometryShape[shape] ? geometryShape[shape]() : geometryShape.circle();
  const geometry = shape3d.indexOf(shape) === -1 ? fillPolygon([path]) : extrudePolygon([path]);
  // const geometry = fillPolygon([path]);
  return geometry;
}
// 热力图计算范围
function addDir(dirX: number, dirY: number) {
  const x = (dirX + 1) / 2;
  const y = (dirY + 1) / 2;
  return [x, y];
}

/**
 * 构建地球三角网格
 * @returns
 */
export function earthTriangulation() {
  const earthmesh = primitiveSphere(EARTH_RADIUS, { segments: EARTH_SEGMENTS });
  const { positionsArr, indicesArr, normalArr } = earthmesh;
  return {
    vertices: positionsArr,
    indices: indicesArr,
    size: 5,
    normals: normalArr,
  };
}

export function earthOuterTriangulation() {
  const earthmesh = primitiveSphere(EARTH_RADIUS + EARTH_RADIUS_OUTER, {
    segments: EARTH_SEGMENTS,
  });
  const { positionsArr, indicesArr, normalArr } = earthmesh;
  return {
    vertices: positionsArr,
    indices: indicesArr,
    size: 5,
    normals: normalArr,
  };
}
