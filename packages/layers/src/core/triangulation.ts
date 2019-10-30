import { IEncodeFeature } from '@l7/core';
import { vec3 } from 'gl-matrix';
import getNormals from '../utils/polylineNormal';
import extrudePolygon, { fillPolygon, IExtrudeGeomety } from './shape/extrude';
import {
  geometryShape,
  IPosition,
  ShapeType2D,
  ShapeType3D,
} from './shape/Path';
interface IGeometryCache {
  [key: string]: IExtrudeGeomety;
}
const GeometryCache: IGeometryCache = {};
/**
 * 计算2D 填充点图顶点
 * @param feature 映射feature
 */
export function PointFillTriangulation(feature: IEncodeFeature) {
  const coordinates = feature.coordinates as number[];
  return {
    vertices: [...coordinates, ...coordinates, ...coordinates, ...coordinates],
    indices: [0, 1, 2, 2, 3, 0],
    size: coordinates.length,
  };
}

/**
 * 计算3D 拉伸点图
 * @param feature 映射feature
 */
export function PointExtrudeTriangulation(feature: IEncodeFeature) {
  const { shape } = feature;
  const { positions, index } = getGeometry(shape as ShapeType3D);
  return {
    vertices: positions,
    indices: index,
    normals: Array.from(computeVertexNormals(positions, index)),
    size: 3,
  };
}

/**
 * 计算图片标注
 * @param feature 映射feature
 */
export function PointImageTriangulation(feature: IEncodeFeature) {
  const coordinates = feature.coordinates as number[];
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
  const line = getNormals(coordinates as number[][], false, 0);
  return {
    vertices: line.attrPos, // [ x,y,z, distance, miter ]
    indices: line.attrIndex,
    normals: line.normals,
    size: 5,
  };
}

export function PolygonExtrudeTriangulation(feature: IEncodeFeature) {
  const coordinates = feature.coordinates as IPosition[][];
  const { positions, index } = extrudePolygon(coordinates);

  return {
    vertices: positions, // [ x, y, z ]
    indices: index,
    normals: Array.from(computeVertexNormals(positions, index)),
    size: 3,
  };
}

export function HeatmapGridTriangulation(feature: IEncodeFeature) {
  const { shape } = feature;

  const { positions, index } = getHeatmapGeometry(shape as
    | ShapeType2D
    | ShapeType3D);
  return {
    vertices: positions, // [ x, y, z ]
    indices: index,
    normals: Array.from(computeVertexNormals(positions, index)),
    size: 3,
  };
}

/**
 * 图片图层顶点构造
 * @param feature 数据
 */
export function RasterImageTriangulation(feature: IEncodeFeature) {
  const coordinates = feature.coordinates as IPosition[];
  // [ x, y, z. uv.x, uv.y]
  const positions: number[] = [
    ...coordinates[0],
    0,
    0,
    1,
    coordinates[1][0],
    coordinates[0][1],
    0,
    1,
    1,
    ...coordinates[1],
    0,
    1,
    0,
    ...coordinates[0],
    0,
    0,
    1,
    ...coordinates[1],
    0,
    1,
    0,
    coordinates[0][0],
    coordinates[1][1],
    0,
    0,
    0,
  ];
  const indexs = [0, 1, 2, 3, 4, 5];
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
export function LineArcTriangulation(feature: IEncodeFeature, segNum = 30) {
  const coordinates = feature.coordinates as IPosition[];
  const positions = [];
  const indexArray = [];
  for (let i = 0; i < segNum; i++) {
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
    if (i !== segNum - 1) {
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
 * 点图层3d geomerty
 * @param shape 3D形状
 */
function getGeometry(shape: ShapeType3D): IExtrudeGeomety {
  if (GeometryCache && GeometryCache[shape]) {
    return GeometryCache[shape];
  }
  const path = geometryShape[shape]
    ? geometryShape[shape]()
    : geometryShape.cylinder();
  const geometry = extrudePolygon([path]);
  GeometryCache[shape] = geometry;
  return geometry;
}

function computeVertexNormals(
  positions: number[],
  indexArray: number[],
  dim: number = 3,
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
    const [ax, ay] = [positions[vA], positions[vA + 1]];
    const pA = vec3.fromValues(ax, ay, positions[vA + 2]);
    const [bx, by] = [positions[vB], positions[vB + 1]];
    const pB = vec3.fromValues(bx, by, positions[vB + 2]);
    const [cx, cy] = [positions[vC], positions[vC + 1]];
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

function checkIsClosed(points: number[][][]) {
  const p1 = points[0][0];
  const p2 = points[0][points[0].length - 1];
  return p1[0] === p2[0] && p1[1] === p2[1];
}

function getHeatmapGeometry(shape: ShapeType2D | ShapeType3D): IExtrudeGeomety {
  const path = geometryShape[shape]
    ? geometryShape[shape]()
    : geometryShape.circle();
  // const geometry = ShapeType2D[str as ShapeType2D]
  //   ? fillPolygon([path])
  //   : extrudePolygon([path]);
  const geometry = fillPolygon([path]);
  return geometry;
}
