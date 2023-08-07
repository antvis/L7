import { lngLatToMeters } from '@antv/l7-utils';
import earcut from 'earcut';
import { vec3 } from 'gl-matrix';
import { IPath } from './Path';
export interface IExtrudeGeomety {
  positions: number[];
  index: number[];
  normals?: number[];
}
/**
 * 拉伸多边形顶点，返回拉伸后的顶点信息
 * @param paths 路径数据组
 * @param extrude 是否拉伸
 */
export default function extrudePolygon(path: IPath[]): IExtrudeGeomety {
  const p1 = path[0][0];
  const p2 = path[0][path[0].length - 1];
  if (p1[0] === p2[0] && p1[1] === p2[1]) {
    path[0] = path[0].slice(0, path[0].length - 1);
  }

  const n = path[0].length;
  const flattengeo = earcut.flatten(path);
  const { vertices, dimensions } = flattengeo;
  const positions = [];
  const indexArray = [];
  // 设置顶部z值
  for (let j = 0; j < vertices.length / dimensions; j++) {
    if (dimensions === 2) {
      positions.push(vertices[j * 2], vertices[j * 2 + 1], 1);
    } else {
      positions.push(vertices[j * 3], vertices[j * 3 + 1], 1);
    }
  }
  const triangles = earcut(
    flattengeo.vertices,
    flattengeo.holes,
    flattengeo.dimensions,
  );
  indexArray.push(...triangles);
  for (let i = 0; i < n; i++) {
    const prePoint = flattengeo.vertices.slice(
      i * dimensions,
      (i + 1) * dimensions,
    );
    let nextPoint = flattengeo.vertices.slice(
      (i + 1) * dimensions,
      (i + 2) * dimensions,
    );
    if (nextPoint.length === 0) {
      nextPoint = flattengeo.vertices.slice(0, dimensions);
    }
    const indexOffset = positions.length / 3;
    positions.push(
      prePoint[0],
      prePoint[1],
      1,
      nextPoint[0],
      nextPoint[1],
      1,
      prePoint[0],
      prePoint[1],
      0,
      nextPoint[0],
      nextPoint[1],
      0,
    );
    indexArray.push(...[0, 2, 1, 2, 3, 1].map((v) => v + indexOffset));
  }
  return {
    positions,
    index: indexArray,
  };
}
export function fillPolygon(points: IPath[]) {
  const flattengeo = earcut.flatten(points);
  const triangles = earcut(
    flattengeo.vertices,
    flattengeo.holes,
    flattengeo.dimensions,
  );
  return {
    positions: flattengeo.vertices,
    index: triangles,
  };
}

export function extrude_PolygonNormal(
  path: IPath[],
  needFlat = false, // 是否需要转成平面坐标
): IExtrudeGeomety {
  const p1 = path[0][0];
  const p2 = path[0][path[0].length - 1];
  if (p1[0] === p2[0] && p1[1] === p2[1]) {
    path[0] = path[0].slice(0, path[0].length - 1);
  }
  const n = path[0].length;
  const flattengeo = earcut.flatten(path);
  const { vertices, dimensions } = flattengeo;
  const positions = [];
  const indexArray = [];
  const normals = [];
  // 设置顶部z值 position uv
  for (let j = 0; j < vertices.length / dimensions; j++) {
    positions.push(
      vertices[j * dimensions], // x
      vertices[j * dimensions + 1], // y
      1, // z
      -1, // 顶部uv
      -1, // 顶部uv
    );
    normals.push(0, 0, 1);
  }
  const triangles = earcut(
    flattengeo.vertices,
    flattengeo.holes,
    flattengeo.dimensions,
  );
  indexArray.push(...triangles);
  // 设置侧面
  for (let i = 0; i < n; i++) {
    const prePoint = flattengeo.vertices.slice(
      i * dimensions,
      (i + 1) * dimensions,
    );
    let nextPoint = flattengeo.vertices.slice(
      (i + 1) * dimensions,
      (i + 2) * dimensions,
    );
    if (nextPoint.length === 0) {
      nextPoint = flattengeo.vertices.slice(0, dimensions);
    }
    const indexOffset = positions.length / 5;
    // 侧面四顶点
    positions.push(
      prePoint[0],
      prePoint[1],
      1,
      0,
      0,
      nextPoint[0],
      nextPoint[1],
      1,
      0.1, // 侧面 低uv
      0, // 侧面低 uv
      prePoint[0],
      prePoint[1],
      0,
      0,
      0.8,
      nextPoint[0],
      nextPoint[1],
      0,
      0.1,
      0.8,
    );
    const normal = computeVertexNormals(
      [nextPoint[0], nextPoint[1], 1],
      [prePoint[0], prePoint[1], 0],
      [prePoint[0], prePoint[1], 1],
      needFlat,
    );
    normals.push(...normal, ...normal, ...normal, ...normal);
    indexArray.push(...[1, 2, 0, 3, 2, 1].map((v) => v + indexOffset));
  }
  return {
    positions,
    index: indexArray,
    normals,
  };
}
function computeVertexNormals(
  p1: [number, number, number],
  p2: [number, number, number],
  p3: [number, number, number],
  needFlat: boolean = false,
) {
  const cb = vec3.create();
  const ab = vec3.create();
  const normal = vec3.create();

  if (needFlat) {
    p1 = lngLatToMeters(p1) as [number, number, number];
    p2 = lngLatToMeters(p2) as [number, number, number];
    p3 = lngLatToMeters(p3) as [number, number, number];
  }
  const pA = vec3.fromValues(...p1);
  const pB = vec3.fromValues(...p2);
  const pC = vec3.fromValues(...p3);
  vec3.sub(cb, pC, pB);
  vec3.sub(ab, pA, pB);
  vec3.cross(normal, cb, ab);
  const newNormal = vec3.create();
  vec3.normalize(newNormal, normal);

  return newNormal;
}
