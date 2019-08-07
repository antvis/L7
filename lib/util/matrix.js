"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _common = _interopRequireDefault(require("./common"));

var _mat = _interopRequireDefault(require("gl-matrix/src/gl-matrix/mat3"));

var _vec = _interopRequireDefault(require("gl-matrix/src/gl-matrix/vec3"));

var _vec2 = _interopRequireDefault(require("gl-matrix/src/gl-matrix/vec2"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vec2.default.angle = function (v1, v2) {
  var theta = _vec2.default.dot(v1, v2) / (_vec2.default.length(v1) * _vec2.default.length(v2));

  return Math.acos(_common.default.clamp(theta, -1, 1));
};
/**
 * 向量 v1 到 向量 v2 夹角的方向
 * @param  {Array} v1 向量
 * @param  {Array} v2 向量
 * @return {Boolean} >= 0 顺时针 < 0 逆时针
 */


_vec2.default.direction = function (v1, v2) {
  return v1[0] * v2[1] - v2[0] * v1[1];
};

_vec2.default.angleTo = function (v1, v2, direct) {
  var angle = _vec2.default.angle(v1, v2);

  var angleLargeThanPI = _vec2.default.direction(v1, v2) >= 0;

  if (direct) {
    if (angleLargeThanPI) {
      return Math.PI * 2 - angle;
    }

    return angle;
  }

  if (angleLargeThanPI) {
    return angle;
  }

  return Math.PI * 2 - angle;
};

_vec2.default.vertical = function (out, v, flag) {
  if (flag) {
    out[0] = v[1];
    out[1] = -1 * v[0];
  } else {
    out[0] = -1 * v[1];
    out[1] = v[0];
  }

  return out;
};

_mat.default.translate = function (out, a, v) {
  var transMat = new Array(9);

  _mat.default.fromTranslation(transMat, v);

  return _mat.default.multiply(out, transMat, a);
};

_mat.default.rotate = function (out, a, rad) {
  var rotateMat = new Array(9);

  _mat.default.fromRotation(rotateMat, rad);

  return _mat.default.multiply(out, rotateMat, a);
};

_mat.default.scale = function (out, a, v) {
  var scaleMat = new Array(9);

  _mat.default.fromScaling(scaleMat, v);

  return _mat.default.multiply(out, scaleMat, a);
};

var _default = {
  mat3: _mat.default,
  vec2: _vec2.default,
  vec3: _vec.default,
  transform: function transform(m, ts) {
    m = _common.default.clone(m);

    _common.default.each(ts, function (t) {
      switch (t[0]) {
        case 't':
          _mat.default.translate(m, m, [t[1], t[2]]);

          break;

        case 's':
          _mat.default.scale(m, m, [t[1], t[2]]);

          break;

        case 'r':
          _mat.default.rotate(m, m, t[1]);

          break;

        case 'm':
          _mat.default.multiply(m, m, t[1]);

          break;

        default:
          return false;
      }
    });

    return m;
  }
};
exports.default = _default;