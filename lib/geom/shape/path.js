"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cylinder = exports.circle = circle;
exports.squareColumn = exports.square = square;
exports.triangleColumn = exports.triangle = triangle;
exports.hexagonColumn = exports.hexagon = hexagon;
exports.polygonPath = polygonPath;

/**
 * @author lzxue
 * @email lzx199065@gmail.com
 * @create date 2018-11-28 11:01:33
 * @modify date 2018-11-28 11:01:33
 * @desc 点,线,面 coordinates
*/
function circle() {
  return polygonPath(30);
}

function square() {
  return polygonPath(4);
}

function triangle() {
  return polygonPath(3);
}

function hexagon() {
  return polygonPath(6, 1);
}

function polygonPath(pointCount) {
  var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var step = Math.PI * 2 / pointCount;
  var line = [];

  for (var i = 0; i < pointCount; i++) {
    line.push(step * i + start * Math.PI / 12);
  }

  var path = line.map(function (t) {
    var x = Math.sin(t + Math.PI / 4),
        y = Math.cos(t + Math.PI / 4);
    return [x, y, 0];
  });
  path.push(path[0]);
  return path;
}