export function aProjectFlat(lnglat) {
  const maxs = 85.0511287798;
  const lat = Math.max(Math.min(maxs, lnglat[1]), -maxs);
  const scale = 256 << 20;
  let d = Math.PI / 180;
  let x = lnglat[0] * d;
  let y = lat * d;
  y = Math.log(Math.tan((Math.PI / 4) + (y / 2)));

  const a = 0.5 / Math.PI,
    b = 0.5,
    c = -0.5 / Math.PI;
  d = 0.5;
  x = scale * (a * x + b) - 215440491;
  y = scale * (c * y + d) - 106744817;
  return { x, y };
}

