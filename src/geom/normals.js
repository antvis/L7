const DEFAULT_NORMALS_EPSILON = 1e-6;
const DEFAULT_FACE_EPSILON = 1e-6;

/**
 * Estimate the vertex normals of a mesh
 * @param {*} faces 索引坐标
 * @param {*} positions 顶点
 * @param {*} specifiedEpsilon 参数
 * @return {*} normals
 */
export function vertexNormals(faces, positions, specifiedEpsilon) {

  const N = positions.length;
  const normals = new Array(N);
  const epsilon = specifiedEpsilon === void (0) ? DEFAULT_NORMALS_EPSILON : specifiedEpsilon;

  // Initialize normal array
  for (let i = 0; i < N; ++i) {
    normals[i] = [ 0.0, 0.0, 0.0 ];
  }

  // Walk over all the faces and add per-vertex contribution to normal weights
  for (let i = 0; i < faces.length / 3; ++i) {
    const f = [ faces[i * 3], faces[i * 3 + 1], faces[i * 3 + 2] ];
    let p = 0;
    let c = f[f.length - 1];
    let n = f[0];
    for (let j = 0; j < f.length; ++j) {
      // Shift indices back
      p = c;
      c = n;
      n = f[(j + 1) % f.length];

      const v0 = positions[p];
      const v1 = positions[c];
      const v2 = positions[n];

      // Compute infineteismal arcs
      const d01 = new Array(3);
      let m01 = 0.0;
      const d21 = new Array(3);
      let m21 = 0.0;
      for (let k = 0; k < 3; ++k) {
        d01[k] = v0[k] - v1[k];
        m01 += d01[k] * d01[k];
        d21[k] = v2[k] - v1[k];
        m21 += d21[k] * d21[k];
      }

      //  Accumulate values in normal
      if (m01 * m21 > epsilon) {
        const norm = normals[c];
        const w = 1.0 / Math.sqrt(m01 * m21);
        for (let k = 0; k < 3; ++k) {
          const u = (k + 1) % 3;
          const v = (k + 2) % 3;
          norm[k] += w * (d21[u] * d01[v] - d21[v] * d01[u]);
        }
      }
    }
  }

  //  Scale all normals to unit length
  for (let i = 0; i < N; ++i) {
    const norm = normals[i];
    let m = 0.0;
    for (let k = 0; k < 3; ++k) {
      m += norm[k] * norm[k];
    }
    if (m > epsilon) {
      const w = 1.0 / Math.sqrt(m);
      for (let k = 0; k < 3; ++k) {
        norm[k] *= w;
      }
    } else {
      for (let k = 0; k < 3; ++k) {
        norm[k] = 0.0;
      }
    }
  }

  //  Return the resulting set of patches
  return normals;
}

//  Compute face normals of a mesh

export function faceNormals(faces, positions, specifiedEpsilon) {

  const N = faces.length / 3;
  const normals = new Array(N);
  const epsilon = specifiedEpsilon === void (0) ? DEFAULT_FACE_EPSILON : specifiedEpsilon;

  for (let i = 0; i < N; ++i) {
    const pos = [ positions[faces[i * 3]], positions[faces[i * 3 + 1]], positions[faces[i * 3 + 2]] ];
    const d01 = new Array(3);
    const d21 = new Array(3);
    for (let j = 0; j < 3; ++j) {
      d01[j] = pos[1][j] - pos[0][j];
      d21[j] = pos[2][j] - pos[0][j];
    }

    const n = new Array(3);
    let l = 0.0;
    for (let j = 0; j < 3; ++j) {
      const u = (j + 1) % 3;
      const v = (j + 2) % 3;
      n[j] = d01[u] * d21[v] - d01[v] * d21[u];
      l += n[j] * n[j];
    }
    if (l > epsilon) {
      l = 1.0 / Math.sqrt(l);
    } else {
      l = 0.0;
    }
    for (let j = 0; j < 3; ++j) {
      n[j] *= l;
    }
    normals[i] = n;
  }
  return normals;
}
