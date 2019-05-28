import getNormals from '../../util/polyline-normals';
import flatten from '@antv/util/lib/flatten';

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
export function Line(path, props, positionsIndex, lengthPerDashSegment = 200) {
  if (path.length === 1) path = path[0];// 面坐标转线坐标
  const positions = [];
  const pickingIds = [];
  const normal = [];
  const miter = [];
  const colors = [];
  const dashArray = [];

  const { normals, attrIndex, attrPos } = getNormals(path, false, positionsIndex);

  let attrDistance = [];
  const sizes = [];
  const { size, color, id } = props;
  attrPos.forEach((point, pointIndex) => {
    colors.push(...color);
    pickingIds.push(id);
    sizes.push(size[0]);
    point[2] = size[1] || 0;
    positions.push(...point);

    if (pointIndex === 0 || pointIndex === 1) {
      attrDistance.push(0);
    } else if (pointIndex % 2 === 0) {
      attrDistance.push(attrDistance[pointIndex - 2]
        + lineSegmentDistance(attrPos[pointIndex - 2], attrPos[pointIndex]));
    } else {
      attrDistance.push(attrDistance[pointIndex - 1]);
    }
  });

  const totalLength = attrDistance[attrDistance.length - 1];
  const ratio = lengthPerDashSegment / totalLength;
  normals.forEach(n => {
    const norm = n[0];
    const m = n[1];
    normal.push(norm[0], norm[1], 0);
    miter.push(m);
    dashArray.push(ratio);
  });

  attrDistance = attrDistance.map(d => {
    return d / totalLength;
  });
  return {
    positions,
    normal,
    indexArray: flatten(attrIndex),
    miter,
    colors,
    sizes,
    pickingIds,
    attrDistance,
    dashArray
  };

}
function lineSegmentDistance(end, start) {
  const dx = start[0] - end[0];
  const dy = start[1] - end[1];
  const dz = start[2] - end[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
