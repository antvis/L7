const gl = {
  BACK: 1029,
  FRONT: 1028,
};
export function getCullFace(mapVersion: string | undefined): number {
  // 'GAODE' = 'GAODE',
  // 'MAPBOX' = 'MAPBOX',
  // 'DEFAULT' = 'DEFAULTMAP',
  // 'SIMPLE' = 'SIMPLE',
  // 'GLOBEL' = 'GLOBEL',
  switch (mapVersion) {
    case 'GAODE':
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
