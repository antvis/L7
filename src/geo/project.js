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
  return { x: parseInt(x), y: parseInt(y) };
}
export function unProjectFlat(px) {
  const a = 0.5 / Math.PI,
    b = 0.5,
    c = -0.5 / Math.PI;
  let d = 0.5;
  const scale = 256 << 20;
  let [ x, y ] = px;
  x = ((x + 215440491) / scale - b) / a;
  y = ((y + 106744817) / scale - d) / c;
  y = (Math.atan(Math.pow(Math.E, y)) - (Math.PI / 4)) * 2;
  d = Math.PI / 180;
  const lat = y / d;
  const lng = x / d;
  return [ lng, lat ];
}
