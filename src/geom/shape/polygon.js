import extrudePolygon from '../extrude';
/**
 * 计算平面的 polygon的顶点坐标和索引
 * @param {Array} points 顶点坐标
 * @param {*} extrude 是否拉伸
 * @return {object} 顶点坐标和顶点索引
 */
export function fill(points) {
  return extrudePolygon(points, false);
}

/**
 * 计算 extrude 的 polygon的顶点坐标和索引
 * @param {Array} points 顶点坐标
 * @param {*} extrude 是否拉伸
 * @return {object} 顶点坐标和顶点索引
 */
export function extrude(points) {
  return extrudePolygon(points, true);
}
/**
 * 绘制多边形轮廓
 * @param {*} points 点数据组
 * @return {object} 顶点坐标和顶点索引
 */
export function line(points) {
  const vertIndex = [];
  const vertCount = points[0].length - 1;
  for (let i = 0; i < vertCount; i++) {
    vertIndex.push(i, i + 1);
  }
  vertIndex.push(vertCount, 0);
  return {
    positions: points[0],
    positionsIndex: vertIndex
  };
}
/**
 * 绘制3D多边形轮廓
 * @param {*} points 点数据组
 * @return {object} 顶点坐标和顶点索引
 */
export function extrudeline(points) {
  const positions = [];
  points[0].forEach(p => { positions.push([ p[0], p[1], 0 ]); });
  points[0].forEach(p => { positions.push([ p[0], p[1], 1 ]); }); // top
  const vertIndex = [];
  const pointCount = points[0].length;
  const vertCount = pointCount - 1;
  for (let i = 0; i < vertCount; i++) {
    vertIndex.push(i, i + 1);
    vertIndex.push(i + pointCount, i + 1 + pointCount);
    vertIndex.push(i, i + pointCount);
  }
  vertIndex.push(vertCount, 0);
  vertIndex.push(vertCount, vertCount + pointCount);
  vertIndex.push(vertCount + pointCount, pointCount);
  const newPositions = [];
  vertIndex.forEach(index => {
    newPositions.push(positions[index]);
  });
  return newPositions;
}
