const gl = {
  BACK: 1029,
  FRONT: 1028,
};
export function getCullFace(mapVersion: string | undefined): number {
  // 'GAODE1.x' = 'GAODE1.x',
  // 'GAODE2.x' = 'GAODE2.x',
  // 'MAPBOX' = 'MAPBOX',
  // 'L7MAP' = 'L7MAP',
  // 'SIMPLE' = 'SIMPLE',
  // 'GLOBEL' = 'GLOBEL',
  switch (mapVersion) {
    case 'GAODE1.x':
      return gl.BACK;
      break;
    case 'GAODE2.x':
      return gl.BACK;
      break;
    case 'MAPBOX':
      return gl.FRONT;
      break;
    case 'SIMPLE':
      return gl.FRONT;
      break;
    case 'GLOBEL':
      return gl.BACK;
      break;
    case 'L7MAP':
      return gl.FRONT;
      break;
    default:
      return gl.FRONT;
  }
}
