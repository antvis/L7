
import * as polygonShape from './polygon';
/**
 * shape circle
 * @param {enum} type  渲染类型
 * @return {object} 顶点坐标和索引坐标
 */
export function circle(type) {
  const points = polygonPoint(30);
  return polygonShape[type]([ points ]);
}
/**
 * @param {enum} type  渲染类型
 * @param {boolean} extrude  是否进行高度拉伸
 * @return {object} 顶点坐标和索引坐标
 */
export function triangle(type) {
  const points = polygonPoint(3);
  return polygonShape[type]([ points ]);
}

/**
 * @param {enum} type  渲染类型
 * @param {boolean} extrude  是否进行高度拉伸
 * @return {object} 顶点坐标和索引坐标
 */
export function diamond(type) {
  const points = polygonPoint(4);
  return polygonShape[type]([ points ]);
}

/**
 * @param {enum} type  渲染类型
 * @param {boolean} extrude  是否进行高度拉伸
 * @return {object} 顶点坐标和索引坐标
 */
export function hexagon(type) {
  const points = polygonPoint(6);
  return polygonShape[type]([ points ]);
}
/**
 * 规则多边形
 * @param {*} pointCount 顶点个数
 * @param {*} extrude  是否拔高
 * @return {Array} 顶点坐标
 */
function polygonPoint(pointCount) {
  const step = Math.PI * 2 / pointCount;
  const line = [];
  for (let i = 0; i < pointCount; i++) {
    line.push(step * i);
  }
  // debugger
  const points = line.map(t => {
    const x = Math.sin(t + Math.PI / 4),
      y = Math.cos(t + Math.PI / 4);
    return [ x, y, 0 ];
  });
  return points;
}
