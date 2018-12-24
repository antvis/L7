import { Vector3 } from '../../core/three';
import getNormal from 'polyline-normals';
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

export function arc(geo, props, positionsIndex) {
  const segNum = 50;
  const posArray = [];
  const instanceArray = [];
  const sizes = [];
  const colors = [];
  const { size, color } = props;
  const defaultInstance = [ geo[0][0], geo[0][1], geo[1][0], geo[1][1] ];
  const indexArray = [];
  let c = 0;
  let index = positionsIndex;
  for (let i = 0; i < segNum; i++) {
    posArray.push(i, 1, i);
    posArray.push(i, -1, i);
    instanceArray.push(...defaultInstance);
    instanceArray.push(...defaultInstance);
    sizes.push(size, size);
    colors.push(...color);
    colors.push(...color);
    if (i !== segNum - 1) {
      indexArray[c++] = index + 0;
      indexArray[c++] = index + 1;
      indexArray[c++] = index + 2;
      indexArray[c++] = index + 1;
      indexArray[c++] = index + 3;
      indexArray[c++] = index + 2;
    }
    index += 2;

  }
  return {
    positions: posArray,
    indexArray,
    instances: instanceArray,
    colors,
    sizes
  };
}

/**
 * shape defaultLine
 * @param {array} geo  坐标点
 * @param {int} index  原始数据index
 * @return {object} 顶点坐标,索引坐标
 */
export function defaultLine(geo, index) {
  const indexArray = [];
  const positions = [];
  geo.slice(0, geo.length - 1).forEach((coor, i) => {

    positions.push(coor, geo[i + 1]);
    indexArray.push(index, index);
  });

  return { positions, indexes: indexArray };
}
// mesh line
export function Line(path, props, positionsIndex) {
  if (path.length === 1) path = path[0];// 面坐标转线坐标
  const positions = [];
  const pickingIds = [];
  const normal = [];
  const miter = [];
  const colors = [];
  const indexArray = [];
  const normals = getNormal(path);
  let attrDistance = [];
  const sizes = [];
  let c = 0;
  let index = positionsIndex;
  const { size, color, id } = props;
  path.forEach((point, pointIndex, list) => {
    const i = index;
    colors.push(...color);
    colors.push(...color);
    pickingIds.push(id);
    pickingIds.push(id);
    sizes.push(size[0]);
    sizes.push(size[0]);
    if (pointIndex !== list.length - 1) {
      indexArray[c++] = i + 0;
      indexArray[c++] = i + 3;
      indexArray[c++] = i + 1;
      indexArray[c++] = i + 0;
      indexArray[c++] = i + 2;
      indexArray[c++] = i + 3;
    }
    point[2] = size[1];
    positions.push(...point);
    positions.push(...point);

    if(pointIndex===0){
      attrDistance.push(0, 0); 
    } else{
      const d  = attrDistance[pointIndex * 2-1] + lineSegmentDistance(path[pointIndex-1],path[pointIndex]);
      attrDistance.push(d,d);
    }

    index += 2;
  });
  normals.forEach(n => {
    const norm = n[0];
    const m = n[1];
    normal.push(norm[0], norm[1], 0);
    normal.push(norm[0], norm[1], 0);
    miter.push(-m);
    miter.push(m);
  });
  attrDistance = attrDistance.map((d)=>{
    return d / attrDistance[attrDistance.length-1];
  })
  return {
    positions,
    normal,
    indexArray,
    miter,
    colors,
    sizes,
    pickingIds,
    attrDistance
  };

}
function lineSegmentDistance(end,start) {
    const dx = start[0] - end[0];
    const dy = start[1] - end[1];
    const dz = start[2] - end[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
