"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _polylineMiterUtil = require("polyline-miter-util");

var _glVec = require("gl-vec2");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function extrusions(positions, out, miters, point, normal, scale) {
  addNext(out, miters, normal, -scale);
  addNext(out, miters, normal, scale);
  positions.push.apply(positions, _toConsumableArray(point));
  positions.push.apply(positions, _toConsumableArray(point));
}

function addNext(out, miters, normal, length) {
  out.push(normal[0], normal[1], 0);
  miters.push(length);
}

function lineSegmentDistance(end, start) {
  var dx = start[0] - end[0];
  var dy = start[1] - end[1];
  var dz = start[2] - end[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function _default(points, closed, indexOffset) {
  var lineA = [0, 0];
  var lineB = [0, 0];
  var tangent = [0, 0];
  var miter = [0, 0];

  var _lastFlip = -1;

  var _started = false;
  var _normal = null;
  var tmp = (0, _glVec.create)();
  var count = indexOffset || 0;
  var miterLimit = 3;
  var out = [];
  var attrPos = [];
  var attrIndex = [];
  var miters = [];
  var attrDistance = [0, 0];

  if (closed) {
    points = points.slice();
    points.push(points[0]);
  }

  var total = points.length;

  for (var i = 1; i < total; i++) {
    var index = count;
    var last = points[i - 1];
    var cur = points[i];
    var next = i < points.length - 1 ? points[i + 1] : null;
    var d = lineSegmentDistance(cur, last) + attrDistance[attrDistance.length - 1];
    (0, _polylineMiterUtil.direction)(lineA, cur, last);

    if (!_normal) {
      _normal = [0, 0];
      (0, _polylineMiterUtil.normal)(_normal, lineA);
    }

    if (!_started) {
      _started = true;
      extrusions(attrPos, out, miters, last, _normal, 1);
    }

    attrIndex.push(index + 0, index + 2, index + 1); // no miter, simple segment

    if (!next) {
      // reset normal
      (0, _polylineMiterUtil.normal)(_normal, lineA);
      extrusions(attrPos, out, miters, cur, _normal, 1);
      attrDistance.push(d, d);
      attrIndex.push(index + 1, index + 2, index + 3);
      count += 2;
    } else {
      // get unit dir of next line
      (0, _polylineMiterUtil.direction)(lineB, next, cur); // stores tangent & miter

      var miterLen = (0, _polylineMiterUtil.computeMiter)(tangent, miter, lineA, lineB, 1); // get orientation

      var flip = (0, _glVec.dot)(tangent, _normal) < 0 ? -1 : 1;
      var bevel = Math.abs(miterLen) > miterLimit; // 处理前后两条线段重合的情况，这种情况不需要使用任何接头（miter/bevel）。
      // 理论上这种情况下 miterLen = Infinity，本应通过 isFinite(miterLen) 判断，
      // 但是 AMap 投影变换后丢失精度，只能通过一个阈值（1000）判断。

      if (Math.abs(miterLen) > 1000) {
        (0, _polylineMiterUtil.normal)(_normal, lineA);
        extrusions(attrPos, out, miters, cur, _normal, 1);
        attrDistance.push(d, d);
        var indexData = _lastFlip === 1 ? [index + 1, index + 3, index + 2] : [index, index + 2, index + 3];
        attrIndex.push.apply(attrIndex, indexData); // 避免在 Material 中使用 THREE.DoubleSide

        attrIndex.push(index + 2, index + 3, index + 4);
        count += 2;
        _lastFlip = -1;
        continue;
      }

      if (bevel) {
        miterLen = miterLimit; // next two points in our first segment

        extrusions(attrPos, out, miters, cur, _normal, 1);
        attrIndex.push(index + 1, index + 2, index + 3); // now add the bevel triangle

        attrIndex.push.apply(attrIndex, _toConsumableArray(flip === 1 ? [index + 2, index + 4, index + 5] : [index + 4, index + 5, index + 3]));
        (0, _polylineMiterUtil.normal)(tmp, lineB);
        (0, _glVec.copy)(_normal, tmp); // store normal for next round

        extrusions(attrPos, out, miters, cur, _normal, 1);
        attrDistance.push(d, d, d, d); // the miter is now the normal for our next join

        count += 4;
      } else {
        // next two points in our first segment
        extrusions(attrPos, out, miters, cur, _normal, 1);
        attrIndex.push(index + 1, index + 2, index + 3); // now add the miter triangles

        addNext(out, miters, miter, miterLen * -flip);
        attrPos.push.apply(attrPos, _toConsumableArray(cur));
        attrIndex.push(index + 2, index + 4, index + 3);
        attrIndex.push(index + 4, index + 5, index + 6);
        (0, _polylineMiterUtil.normal)(tmp, lineB);
        (0, _glVec.copy)(_normal, tmp); // store normal for next round

        extrusions(attrPos, out, miters, cur, _normal, 1);
        attrDistance.push(d, d, d, d, d); // the miter is now the normal for our next join

        count += 5;
      }

      _lastFlip = flip;
    }
  }

  return {
    normals: out,
    attrIndex: attrIndex,
    attrPos: attrPos,
    attrDistance: attrDistance,
    miters: miters
  };
}