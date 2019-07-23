import earcut from 'earcut';

/**
 * 计算是否拉伸
 * @param {Array} points  点坐标数组
 * @param {boolean} extrude  是否拉伸
 * @return {object} 顶点坐标顶点索引
 */
export default function extrudePolygon(points, extrude) {
  // height += Math.random() * 100; // 解决 depth
  const p1 = points[0][0];
  const p2 = points[0][points[0].length - 1];
  const faceUv = [];
  if (p1[0] === p2[0] && p1[1] === p2[1]) {
    points[0] = points[0].slice(0, points[0].length - 1);
  }
  const n = points[0].length;
  const flattengeo = earcut.flatten(points);
  const positions = [];
  let cells = [];
  const { dimensions } = flattengeo;
  const triangles = earcut(flattengeo.vertices, flattengeo.holes, flattengeo.dimensions);
  cells = triangles;

  const pointCount = flattengeo.vertices.length / dimensions;
  const { vertices } = flattengeo;
  extrude ? full() : flat();


  function flat() {
    for (let i = 0; i < pointCount; i++) {
      positions.push([ vertices[ i * dimensions ], vertices[i * dimensions + 1 ], 0 ]);
    }
  }
  function full() {
    // 顶部纹理
    triangles.forEach(() => {
      faceUv.push(-1, -1);
    });
    // 顶部坐标

    for (let i = 0; i < pointCount; i++) {
      positions.push([ vertices[ i * dimensions ], vertices[i * dimensions + 1 ], 1 ]);
    }
    for (let i = 0; i < pointCount; i++) {
      positions.push([ vertices[ i * dimensions ], vertices[i * dimensions + 1 ], 0 ]);
    }
    for (let i = 0; i < n; i++) {
      if (i === (n - 1)) {
        cells.push(i, n, i + n);
        faceUv.push(1, 0, 0, 1, 1, 1);
        cells.push(i, 0, n);
        faceUv.push(1, 0, 0, 0, 0, 1);
      } else {
        cells.push(i + n, i, i + n + 1);
        faceUv.push(1, 1, 1, 0, 0, 1);
        cells.push(i, i + 1, i + n + 1);
        faceUv.push(1, 0, 0, 0, 0, 1);
      }
    }
  }
  points = [];
  return {
    positions,
    faceUv,
    positionsIndex: cells
  };
}

export function extrudePolygonLine(points, extrude) {
  // height += Math.random() * 100; // 解决 depth
  const p1 = points[0][0];
  const p2 = points[0][points[0].length - 1];
  if (p1[0] === p2[0] && p1[1] === p2[1]) {
    points[0] = points[0].slice(0, points[0].length - 1);
  }

  const n = points[0].length;
  const flattengeo = earcut.flatten(points);
  const positions = [];
  let cells = [];
  const triangles = earcut(flattengeo.vertices, flattengeo.holes, flattengeo.dimensions);
  cells = triangles.map(e => e);
  extrude === 0 ? flat() : full();

  function flat() {
    points[0].forEach(p => { positions.push([ p[0], p[1], 0 ]); }); // top
  }
  function full() {
    points[0].forEach(p => { positions.push([ p[0], p[1], 1 ]); }); // top
    points[0].forEach(p => { positions.push([ p[0], p[1], 0 ]); }); // bottom
    for (let i = 0; i < n; i++) {
      if (i === (n - 1)) {
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
    positions,
    positionsIndex: cells
  };
}
