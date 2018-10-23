const CommonUtil = require('./common');
const mat3 = require('gl-matrix/src/gl-matrix/mat3');
const vec3 = require('gl-matrix/src/gl-matrix/vec3');
const vec2 = require('gl-matrix/src/gl-matrix/vec2');

vec2.angle = function(v1, v2) {
  const theta = vec2.dot(v1, v2) / (vec2.length(v1) * vec2.length(v2));
  return Math.acos(CommonUtil.clamp(theta, -1, 1));
};
/**
 * 向量 v1 到 向量 v2 夹角的方向
 * @param  {Array} v1 向量
 * @param  {Array} v2 向量
 * @return {Boolean} >= 0 顺时针 < 0 逆时针
 */
vec2.direction = function(v1, v2) {
  return v1[0] * v2[1] - v2[0] * v1[1];
};
vec2.angleTo = function(v1, v2, direct) {
  const angle = vec2.angle(v1, v2);
  const angleLargeThanPI = vec2.direction(v1, v2) >= 0;
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
vec2.vertical = function(out, v, flag) {
  if (flag) {
    out[0] = v[1];
    out[1] = -1 * v[0];
  } else {
    out[0] = -1 * v[1];
    out[1] = v[0];
  }

  return out;
};

mat3.translate = function(out, a, v) {
  const transMat = new Array(9);
  mat3.fromTranslation(transMat, v);
  return mat3.multiply(out, transMat, a);
};

mat3.rotate = function(out, a, rad) {
  const rotateMat = new Array(9);
  mat3.fromRotation(rotateMat, rad);
  return mat3.multiply(out, rotateMat, a);
};

mat3.scale = function(out, a, v) {
  const scaleMat = new Array(9);
  mat3.fromScaling(scaleMat, v);
  return mat3.multiply(out, scaleMat, a);
};

module.exports = {
  mat3,
  vec2,
  vec3,
  transform(m, ts) {
    m = CommonUtil.clone(m);
    CommonUtil.each(ts, t => {
      switch (t[0]) {
        case 't':
          mat3.translate(m, m, [ t[1], t[2] ]);
          break;
        case 's':
          mat3.scale(m, m, [ t[1], t[2] ]);
          break;
        case 'r':
          mat3.rotate(m, m, t[1]);
          break;
        case 'm':
          mat3.multiply(m, m, t[1]);
          break;
        default:
          return false;
      }
    });
    return m;
  }
};
