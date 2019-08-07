import * as polygonShape from './polygon';
import { polygonPath } from './path';
/**
 * shape circle
 * @param {enum} type  渲染类型
 * @return {object} 顶点坐标和索引坐标
 */
export function circle(type) {
  const points = polygonPath(30);
  return polygonShape[type]([ points ]);
}
/**
 * @param {enum} type  渲染类型
 * @param {boolean} extrude  是否进行高度拉伸
 * @return {object} 顶点坐标和索引坐标
 */
export function triangle(type) {
  const points = polygonPath(3);
  return polygonShape[type]([ points ]);
}

/**
 * @param {enum} type  渲染类型
 * @param {boolean} extrude  是否进行高度拉伸
 * @return {object} 顶点坐标和索引坐标
 */
export function diamond(type) {
  const points = polygonPath(4);
  return polygonShape[type]([ points ]);
}

export function square(type) {
  return diamond(type);
}

/**
 * @param {enum} type  渲染类型
 * @param {boolean} extrude  是否进行高度拉伸
 * @return {object} 顶点坐标和索引坐标
 */
export function hexagon(type) {
  const points = polygonPath(6);
  return polygonShape[type]([ points ]);
}
