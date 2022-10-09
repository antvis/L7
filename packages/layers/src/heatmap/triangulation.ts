export function heatMap3DTriangulation(width: number, height: number) {
  const indices = [];
  const vertices = [];
  const uvs = [];
  const gridX1 = width + 1;
  const gridY1 = height + 1;
  const widthHalf = width / 2;
  const heightHalf = height / 2;
  for (let iy = 0; iy < gridY1; iy++) {
    const y = iy - heightHalf;
    for (let ix = 0; ix < gridX1; ix++) {
      const x = ix - widthHalf;
      vertices.push(x / widthHalf, -y / heightHalf, 0);
      uvs.push(ix / width);
      uvs.push(1 - iy / height);
    }
  }
  for (let iy = 0; iy < height; iy++) {
    for (let ix = 0; ix < width; ix++) {
      const a = ix + gridX1 * iy;
      const b = ix + gridX1 * (iy + 1);
      const c = ix + 1 + gridX1 * (iy + 1);
      const d = ix + 1 + gridX1 * iy;
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }
  return {
    vertices,
    indices,
    uvs,
  };
}
