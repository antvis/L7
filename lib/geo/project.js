"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aProjectFlat = aProjectFlat;
exports.unProjectFlat = unProjectFlat;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function aProjectFlat(lnglat) {
  var maxs = 85.0511287798;
  var lat = Math.max(Math.min(maxs, lnglat[1]), -maxs);
  var scale = 256 << 20;
  var d = Math.PI / 180;
  var x = lnglat[0] * d;
  var y = lat * d;
  y = Math.log(Math.tan(Math.PI / 4 + y / 2));
  var a = 0.5 / Math.PI,
      b = 0.5,
      c = -0.5 / Math.PI;
  d = 0.5;
  x = scale * (a * x + b) - 215440491;
  y = scale * (c * y + d) - 106744817;
  return {
    x: parseInt(x),
    y: parseInt(y)
  };
}

function unProjectFlat(px) {
  var a = 0.5 / Math.PI,
      b = 0.5,
      c = -0.5 / Math.PI;
  var d = 0.5;
  var scale = 256 << 20;

  var _px = _slicedToArray(px, 2),
      x = _px[0],
      y = _px[1];

  x = ((x + 215440491) / scale - b) / a;
  y = ((y + 106744817) / scale - d) / c;
  y = (Math.atan(Math.pow(Math.E, y)) - Math.PI / 4) * 2;
  d = Math.PI / 180;
  var lat = y / d;
  var lng = x / d;
  return [lng, lat];
}