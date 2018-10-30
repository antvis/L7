import { Vector3 } from '../../core/three';
/**
 * shape meshLine
 * @param {array} geo  坐标点
 * @param {object} props  属性数据
 * @param {int} index  原始数据ndex
 * @return {object} 顶点坐标，索引坐标
 */
export function meshLine(geo, props, index) {
  const dataLength = geo.length;
  const width = props.size[0] * 50 || 100;
  const dem = props.size[1] || 0;
  const posArray = [];
  const indexArray = [];
  const points = [];
  for (let i = 0; i < dataLength; i++) {
    let previous = (i === 0) ? geo[0] : geo[i - 1];
    let next = (i === dataLength - 1) ? geo[dataLength - 1] : geo[i + 1];
    let current = geo[i];
    previous = [ previous[0], previous[1], 0 ];
    next = [ next[0], next[1], 0 ];
    current = [ current[0], current[1], 0 ];

    let dir = null;
    if (i === 0 || i === dataLength - 1) {
      dir = new Vector3(1, 1, 1);
    } else {
      const dir1 = new Vector3();
      const dir2 = new Vector3();
      dir = new Vector3();
      dir1.subVectors(new Vector3(...current), new Vector3(...previous)).normalize();
      dir2.subVectors(new Vector3(...next), new Vector3(...current)).normalize();
      dir.addVectors(dir1, dir2).normalize();
    }
    let normal = [ -dir.y, dir.x, 0 ];
    normal = [ normal[0] * width, normal[1] * width, 0 ];
    const n1 = [ normal[0], normal[1], 0 ];
    const n2 = [ -normal[0], -normal[1], 0 ];
    const p1 = new Vector3();
    const p2 = new Vector3();
    p1.addVectors(new Vector3(...current), new Vector3(...n1));
    p2.addVectors(new Vector3(...current), new Vector3(...n2));
    points.push([ p1.x, p1.y, dem ], [ p2.x, p2.y, dem ]);
  }// end of for
  for (let i = 0; i < points.length - 2; i += 2) {
    const ct = i;
    const cb = i + 1;
    const nt = i + 2;
    const nb = i + 3;
    posArray.push(points[ct], points[cb], points[nt]);
    posArray.push(points[nt], points[cb], points[nb]);
    indexArray.push(index, index, index);
    indexArray.push(index, index, index);
  }
  return { positions: posArray, indexes: indexArray };
}

/**
 * shape arc
 * @param {array} geo  坐标点
 * @param {int} index  原始数据index
 * @return {object} 顶点坐标，起始点坐标，索引坐标
 */

export function arc(geo, index) {
  const segNum = 50;
  const posArray = [];
  const instanceArray = [];
  const defaultInstance = [ geo[0][0], geo[0][1], geo[1][0], geo[1][1] ];
  const indexArray = [];
  for (let i = 1; i < segNum; i++) {
    posArray.push([ i - 1, i - 1, i - 1 ]);
    posArray.push([ i, i, i ]);
    indexArray.push(index);
    indexArray.push(index);
    instanceArray.push(defaultInstance);
    instanceArray.push(defaultInstance);
  }
  return { positions: posArray, indexes: indexArray, instances: instanceArray };
}

/**
 * shape defaultLine
 * @param {array} geo  坐标点
 * @param {int} index  原始数据index
 * @return {object} 顶点坐标,索引坐标
 */
export function defaultLine(geo) {
  const indexArray = [];
  const positions = [];
  geo.slice(0, geo.length - 1).forEach((coor, index) => {

    positions.push(coor, geo[index + 1]);
    indexArray.push(index, index);
  });

  return { positions, indexes: indexArray };
}
