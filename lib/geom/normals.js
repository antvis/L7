"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vertexNormals = vertexNormals;
exports.faceNormals = faceNormals;
var DEFAULT_NORMALS_EPSILON = 1e-6;
var DEFAULT_FACE_EPSILON = 1e-6;
/**
 * Estimate the vertex normals of a mesh
 * @param {*} faces 索引坐标
 * @param {*} positions 顶点
 * @param {*} specifiedEpsilon 参数
 * @return {*} normals
 */

function vertexNormals(faces, positions, specifiedEpsilon) {
  var N = positions.length;
  var normals = new Array(N);
  var epsilon = specifiedEpsilon === void 0 ? DEFAULT_NORMALS_EPSILON : specifiedEpsilon; // Initialize normal array

  for (var i = 0; i < N; ++i) {
    normals[i] = [0.0, 0.0, 0.0];
  } // Walk over all the faces and add per-vertex contribution to normal weights


  for (var _i = 0; _i < faces.length / 3; ++_i) {
    var f = [faces[_i * 3], faces[_i * 3 + 1], faces[_i * 3 + 2]];
    var p = 0;
    var c = f[f.length - 1];
    var n = f[0];

    for (var j = 0; j < f.length; ++j) {
      // Shift indices back
      p = c;
      c = n;
      n = f[(j + 1) % f.length];
      var v0 = positions[p];
      var v1 = positions[c];
      var v2 = positions[n]; // Compute infineteismal arcs

      var d01 = new Array(3);
      var m01 = 0.0;
      var d21 = new Array(3);
      var m21 = 0.0;

      for (var k = 0; k < 3; ++k) {
        d01[k] = v0[k] - v1[k];
        m01 += d01[k] * d01[k];
        d21[k] = v2[k] - v1[k];
        m21 += d21[k] * d21[k];
      } //  Accumulate values in normal


      if (m01 * m21 > epsilon) {
        var norm = normals[c];
        var w = 1.0 / Math.sqrt(m01 * m21);

        for (var _k = 0; _k < 3; ++_k) {
          var u = (_k + 1) % 3;
          var v = (_k + 2) % 3;
          norm[_k] += w * (d21[u] * d01[v] - d21[v] * d01[u]);
        }
      }
    }
  } //  Scale all normals to unit length


  for (var _i2 = 0; _i2 < N; ++_i2) {
    var _norm = normals[_i2];
    var m = 0.0;

    for (var _k2 = 0; _k2 < 3; ++_k2) {
      m += _norm[_k2] * _norm[_k2];
    }

    if (m > epsilon) {
      var _w = 1.0 / Math.sqrt(m);

      for (var _k3 = 0; _k3 < 3; ++_k3) {
        _norm[_k3] *= _w;
      }
    } else {
      for (var _k4 = 0; _k4 < 3; ++_k4) {
        _norm[_k4] = 0.0;
      }
    }
  } //  Return the resulting set of patches


  return normals;
} //  Compute face normals of a mesh


function faceNormals(faces, positions, specifiedEpsilon) {
  var N = faces.length / 3;
  var normals = new Array(N);
  var epsilon = specifiedEpsilon === void 0 ? DEFAULT_FACE_EPSILON : specifiedEpsilon;

  for (var i = 0; i < N; ++i) {
    var pos = [positions[faces[i * 3]], positions[faces[i * 3 + 1]], positions[faces[i * 3 + 2]]];
    var d01 = new Array(3);
    var d21 = new Array(3);

    for (var j = 0; j < 3; ++j) {
      d01[j] = pos[1][j] - pos[0][j];
      d21[j] = pos[2][j] - pos[0][j];
    }

    var n = new Array(3);
    var l = 0.0;

    for (var _j = 0; _j < 3; ++_j) {
      var u = (_j + 1) % 3;
      var v = (_j + 2) % 3;
      n[_j] = d01[u] * d21[v] - d01[v] * d21[u];
      l += n[_j] * n[_j];
    }

    if (l > epsilon) {
      l = 1.0 / Math.sqrt(l);
    } else {
      l = 0.0;
    }

    for (var _j2 = 0; _j2 < 3; ++_j2) {
      n[_j2] *= l;
    }

    normals[i] = n;
  }

  return normals;
}