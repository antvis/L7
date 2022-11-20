const gl = {
  BACK: 1029,
  FRONT: 1028,
};
export function getCullFace(mapVersion: string | undefined): number {
  // 'GAODE1.x' = 'GAODE1.x',
  // 'GAODE2.x' = 'GAODE2.x',
  // 'MAPBOX' = 'MAPBOX',
  // 'DEFAULT' = 'DEFAULTMAP',
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
    case 'DEBAULT':
      return gl.FRONT;
      break;
    default:
      return gl.FRONT;
  }
}
