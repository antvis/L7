"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fill = fill;
exports.extrude = extrude;
exports.line = line;
exports.extrudeline = extrudeline;

var _extrude = _interopRequireDefault(require("../extrude"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * 计算平面的 polygon的顶点坐标和索引
 * @param {Array} points 顶点坐标
 * @param {*} extrude 是否拉伸
 * @return {object} 顶点坐标和顶点索引
 */
function fill(points) {
  return (0, _extrude["default"])(points, false);
}
/**
 * 计算 extrude 的 polygon的顶点坐标和索引
 * @param {Array} points 顶点坐标
 * @param {*} extrude 是否拉伸
 * @return {object} 顶点坐标和顶点索引
 */


function extrude(points) {
  return (0, _extrude["default"])(points, true);
}
/**
 * 绘制多边形轮廓
 * @param {*} points 点数据组
 * @return {object} 顶点坐标和顶点索引
 */


function line(points) {
  var vertIndex = [];
  var vertCount = points[0].length - 1;

  for (var i = 0; i < vertCount; i++) {
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


function extrudeline(points) {
  var positions = [];
  points[0].forEach(function (p) {
    positions.push([p[0], p[1], 0]);
  });
  points[0].forEach(function (p) {
    positions.push([p[0], p[1], 1]);
  }); // top

  var vertIndex = [];
  var pointCount = points[0].length;
  var vertCount = pointCount - 1;

  for (var i = 0; i < vertCount; i++) {
    vertIndex.push(i, i + 1);
    vertIndex.push(i + pointCount, i + 1 + pointCount);
    vertIndex.push(i, i + pointCount);
  }

  vertIndex.push(vertCount, 0);
  vertIndex.push(vertCount, vertCount + pointCount);
  vertIndex.push(vertCount + pointCount, pointCount);
  var newPositions = [];
  vertIndex.forEach(function (index) {
    newPositions.push(positions[index]);
  });
  return newPositions;
}