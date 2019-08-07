"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arc = arc;
exports.defaultLine = defaultLine;
exports.Line = Line;

var _polylineNormals = _interopRequireDefault(require("../../util/polyline-normals"));

var _flatten = _interopRequireDefault(require("@antv/util/lib/flatten"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/**
 * shape arc
 * @param {array} geo  坐标点
 * @param {int} index  原始数据index
 * @return {object} 顶点坐标，起始点坐标，索引坐标
 */
function arc(geo, props, positionsIndex) {
  var segNum = 30;
  var posArray = [];
  var instanceArray = [];
  var sizes = [];
  var colors = [];
  var pickingIds = [];
  var size = props.size,
      color = props.color,
      id = props.id;
  var defaultInstance = [geo[0][0], geo[0][1], geo[1][0], geo[1][1]];
  var indexArray = [];
  var c = 0;
  var index = positionsIndex;

  for (var i = 0; i < segNum; i++) {
    posArray.push(i, 1, i);
    posArray.push(i, -1, i);
    instanceArray.push.apply(instanceArray, defaultInstance);
    instanceArray.push.apply(instanceArray, defaultInstance);
    sizes.push(size, size);
    colors.push.apply(colors, _toConsumableArray(color));
    colors.push.apply(colors, _toConsumableArray(color));
    pickingIds.push(id);
    pickingIds.push(id);

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
    pickingIds: pickingIds,
    positions: posArray,
    indexArray: indexArray,
    instances: instanceArray,
    colors: colors,
    sizes: sizes
  };
}
/**
 * shape defaultLine
 * @param {array} geo  坐标点
 * @param {int} index  原始数据index
 * @return {object} 顶点坐标,索引坐标
 */


function defaultLine(geo, index) {
  var indexArray = [];
  var positions = [];
  geo.slice(0, geo.length - 1).forEach(function (coor, i) {
    positions.push(coor, geo[i + 1]);
    indexArray.push(index, index);
  });
  return {
    positions: positions,
    indexes: indexArray
  };
} // mesh line


function Line(path, props, positionsIndex) {
  var lengthPerDashSegment = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 200;
  var textureCoord = arguments.length > 4 ? arguments[4] : undefined;

  if (Array.isArray(path[0][0])) {
    path = path[0]; // 面坐标转线坐标
  }

  var positions = [];
  var pickingIds = [];
  var normal = [];
  var miter = [];
  var colors = [];
  var dashArray = [];
  var textureCoordArray = [];

  var _getNormals = (0, _polylineNormals["default"])(path, false, positionsIndex),
      normals = _getNormals.normals,
      attrIndex = _getNormals.attrIndex,
      attrPos = _getNormals.attrPos,
      attrDistance = _getNormals.attrDistance;

  var sizes = [];
  var totalDistances = [];
  var size = props.size,
      color = props.color,
      id = props.id;
  !Array.isArray(size) && (size = [size]);
  var totalLength = attrDistance[attrDistance.length - 1];
  attrPos.forEach(function (point) {
    colors.push.apply(colors, _toConsumableArray(color));
    pickingIds.push(id);
    sizes.push(size[0]);
    point[2] = size[1] || 0;
    positions.push.apply(positions, _toConsumableArray(point));
    textureCoordArray.push(textureCoord.x, textureCoord.y);
    totalDistances.push(totalLength);
  });
  var ratio = lengthPerDashSegment / totalLength;
  normals.forEach(function (n) {
    var norm = n[0];
    var m = n[1];
    normal.push(norm[0], norm[1], 0);
    miter.push(m);
    dashArray.push(ratio);
  });
  return {
    positions: positions,
    normal: normal,
    indexArray: (0, _flatten["default"])(attrIndex),
    miter: miter,
    colors: colors,
    sizes: sizes,
    pickingIds: pickingIds,
    attrDistance: attrDistance,
    dashArray: dashArray,
    textureCoordArray: textureCoordArray,
    totalDistances: totalDistances
  };
}