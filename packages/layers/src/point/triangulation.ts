import { IEncodeFeature } from '@l7/core';
import { vec3 } from 'gl-matrix';
import extrudePolygon, { IExtrudeGeomety } from './shape/extrude';
import { geometryShape, ShapeType2D, ShapeType3D } from './shape/Path';
interface IGeometryCache {
  [key: string]: IExtrudeGeomety;
}
const GeometryCache: IGeometryCache = {};
export function PointFillTriangulation(feature: IEncodeFeature) {
  const coordinates = feature.coordinates as number[];
  return {
    vertices: [...coordinates, ...coordinates, ...coordinates, ...coordinates],
    indices: [0, 1, 2, 2, 3, 0],
    size: coordinates.length,
  };
}

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
