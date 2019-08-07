"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.circle = circle;
exports.triangle = triangle;
exports.diamond = diamond;
exports.square = square;
exports.hexagon = hexagon;

var polygonShape = _interopRequireWildcard(require("./polygon"));

var _path = require("./path");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

/**
 * shape circle
 * @param {enum} type  渲染类型
 * @return {object} 顶点坐标和索引坐标
 */
function circle(type) {
  var points = (0, _path.polygonPath)(30);
  return polygonShape[type]([points]);
}
/**
 * @param {enum} type  渲染类型
 * @param {boolean} extrude  是否进行高度拉伸
 * @return {object} 顶点坐标和索引坐标
 */


function triangle(type) {
  var points = (0, _path.polygonPath)(3);
  return polygonShape[type]([points]);
}
/**
 * @param {enum} type  渲染类型
 * @param {boolean} extrude  是否进行高度拉伸
 * @return {object} 顶点坐标和索引坐标
 */


function diamond(type) {
  var points = (0, _path.polygonPath)(4);
  return polygonShape[type]([points]);
}

function square(type) {
  return diamond(type);
}
/**
 * @param {enum} type  渲染类型
 * @param {boolean} extrude  是否进行高度拉伸
 * @return {object} 顶点坐标和索引坐标
 */


function hexagon(type) {
  var points = (0, _path.polygonPath)(6);
  return polygonShape[type]([points]);
}