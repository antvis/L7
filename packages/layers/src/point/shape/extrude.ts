import earcut from 'earcut';
import { IPath } from '../../core/shape/Path';
export interface IExtrudeGeomety {
  positions: number[];
  index: number[];
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
  const positions = [];
  const indexArray = [];
  const normals = [];
  // 设置顶部z值
  for (let j = 0; j < flattengeo.vertices.length / 3; j++) {
    flattengeo.vertices[j * 3 + 2] = 1;
    normals.push(0, 0, 1);
  }
  positions.push(...flattengeo.vertices);
  const triangles = earcut(
    flattengeo.vertices,
    flattengeo.holes,
    flattengeo.dimensions,
  );
  indexArray.push(...triangles);
  for (let i = 0; i < n; i++) {
    const prePoint = flattengeo.vertices.slice(i * 3, i * 3 + 3);
    let nextPoint = flattengeo.vertices.slice(i * 3 + 3, i * 3 + 6);
    if (nextPoint.length === 0) {
      nextPoint = flattengeo.vertices.slice(0, 3);
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
    indexArray.push(...[1, 2, 0, 3, 2, 1].map((v) => v + indexOffset));
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
