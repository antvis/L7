"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = extrudePolygon;
exports.extrudePolygonLine = extrudePolygonLine;
exports.fillPolygon = fillPolygon;
exports.extrude_Polygon = extrude_Polygon;

var _earcut = _interopRequireDefault(require("earcut"));

var THREE = _interopRequireWildcard(require("../core/three"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/**
 * 计算是否拉伸
 * @param {Array} points  点坐标数组
 * @param {boolean} extrude  是否拉伸
 * @return {object} 顶点坐标顶点索引
 */
function extrudePolygon(points, extrude) {
  // height += Math.random() * 100; // 解决 depth
  var p1 = points[0][0];
  var p2 = points[0][points[0].length - 1];
  var faceUv = [];

  if (p1[0] === p2[0] && p1[1] === p2[1]) {
    points[0] = points[0].slice(0, points[0].length - 1);
  }

  var n = points[0].length;

  var flattengeo = _earcut["default"].flatten(points);

  var positions = [];
  var cells = [];
  var dimensions = flattengeo.dimensions;
  var triangles = (0, _earcut["default"])(flattengeo.vertices, flattengeo.holes, flattengeo.dimensions);
  cells = triangles;
  var pointCount = flattengeo.vertices.length / dimensions;
  var vertices = flattengeo.vertices;
  extrude ? full() : flat();

  function flat() {
    for (var i = 0; i < pointCount; i++) {
      positions.push([vertices[i * dimensions], vertices[i * dimensions + 1], 0]);
    }
  }

  function full() {
    // 顶部纹理
    triangles.forEach(function () {
      faceUv.push(-1, -1);
    }); // 顶部坐标

    for (var i = 0; i < pointCount; i++) {
      positions.push([vertices[i * dimensions], vertices[i * dimensions + 1], 1]);
    }

    for (var _i = 0; _i < pointCount; _i++) {
      positions.push([vertices[_i * dimensions], vertices[_i * dimensions + 1], 0]);
    }

    for (var _i2 = 0; _i2 < n; _i2++) {
      if (_i2 === n - 1) {
        cells.push(_i2, n, _i2 + n);
        faceUv.push(1, 0, 0, 1, 1, 1);
        cells.push(_i2, 0, n);
        faceUv.push(1, 0, 0, 0, 0, 1);
      } else {
        cells.push(_i2 + n, _i2, _i2 + n + 1);
        faceUv.push(1, 1, 1, 0, 0, 1);
        cells.push(_i2, _i2 + 1, _i2 + n + 1);
        faceUv.push(1, 0, 0, 0, 0, 1);
      }
    }
  }

  points = [];
  return {
    positions: positions,
    faceUv: faceUv,
    positionsIndex: cells
  };
}

function extrudePolygonLine(points, extrude) {
  // height += Math.random() * 100; // 解决 depth
  var p1 = points[0][0];
  var p2 = points[0][points[0].length - 1];

  if (p1[0] === p2[0] && p1[1] === p2[1]) {
    points[0] = points[0].slice(0, points[0].length - 1);
  }

  var n = points[0].length;

  var flattengeo = _earcut["default"].flatten(points);

  var positions = [];
  var cells = [];
  var triangles = (0, _earcut["default"])(flattengeo.vertices, flattengeo.holes, flattengeo.dimensions);
  cells = triangles.map(function (e) {
    return e;
  });
  extrude === 0 ? flat() : full();

  function flat() {
    points[0].forEach(function (p) {
      positions.push([p[0], p[1], 0]);
    }); // top
  }

  function full() {
    points[0].forEach(function (p) {
      positions.push([p[0], p[1], 1]);
    }); // top

    points[0].forEach(function (p) {
      positions.push([p[0], p[1], 0]);
    }); // bottom

    for (var i = 0; i < n; i++) {
      if (i === n - 1) {
        cells.push(i + n, n, i);
        cells.push(0, i, n);
      } else {
        cells.push(i + n, i + n + 1, i);
        cells.push(i + 1, i, i + n + 1);
      }
    }
  }

  points = [];
  return {
    positions: positions,
    positionsIndex: cells
  };
}

function fillPolygon(points) {
  var flattengeo = _earcut["default"].flatten(points);

  var triangles = (0, _earcut["default"])(flattengeo.vertices, flattengeo.holes, flattengeo.dimensions);
  return {
    positions: flattengeo.vertices,
    indexArray: triangles
  };
}

function extrude_Polygon(points) {
  var p1 = points[0][0];
  var p2 = points[0][points[0].length - 1];

  if (p1[0] === p2[0] && p1[1] === p2[1]) {
    points[0] = points[0].slice(0, points[0].length - 1);
  }

  var n = points[0].length;

  var flattengeo = _earcut["default"].flatten(points);

  var positions = [];
  var indexArray = [];
  var normals = []; // 设置顶部z值

  for (var j = 0; j < flattengeo.vertices.length / 3; j++) {
    flattengeo.vertices[j * 3 + 2] = 1;
    normals.push(0, 0, 1);
  }

  positions.push.apply(positions, _toConsumableArray(flattengeo.vertices));
  var triangles = (0, _earcut["default"])(flattengeo.vertices, flattengeo.holes, flattengeo.dimensions);
  indexArray.push.apply(indexArray, _toConsumableArray(triangles));

  var _loop = function _loop(i) {
    var prePoint = flattengeo.vertices.slice(i * 3, i * 3 + 3);
    var nextPoint = flattengeo.vertices.slice(i * 3 + 3, i * 3 + 6);
    nextPoint.length === 0 && (nextPoint = flattengeo.vertices.slice(0, 3));
    var indexOffset = positions.length / 3;
    positions.push(prePoint[0], prePoint[1], 1, nextPoint[0], nextPoint[1], 1, prePoint[0], prePoint[1], 0, nextPoint[0], nextPoint[1], 0);
    var normal = computeNormal([nextPoint[0], nextPoint[1], 1], [prePoint[0], prePoint[1], 0], [prePoint[0], prePoint[1], 1]);
    normals.push.apply(normals, _toConsumableArray(normal).concat(_toConsumableArray(normal), _toConsumableArray(normal), _toConsumableArray(normal)));
    indexArray.push.apply(indexArray, _toConsumableArray([1, 2, 0, 3, 2, 1].map(function (v) {
      return v + indexOffset;
    })));
  };

  for (var i = 0; i < n; i++) {
    _loop(i);
  }

  return {
    positions: positions,
    indexArray: indexArray,
    normals: normals
  };
}

function computeNormal(v1, v2, v3) {
  var pA = new THREE.Vector3();
  var pB = new THREE.Vector3();
  var pC = new THREE.Vector3();
  var cb = new THREE.Vector3();
  var ab = new THREE.Vector3();
  pA.set.apply(pA, _toConsumableArray(v1));
  pB.set.apply(pB, _toConsumableArray(v2));
  pC.set.apply(pC, _toConsumableArray(v3));
  cb.subVectors(pC, pB);
  ab.subVectors(pA, pB);
  cb.cross(ab);
  cb.normalize();
  var x = cb.x,
      y = cb.y,
      z = cb.z;
  return [x, y, z];
}