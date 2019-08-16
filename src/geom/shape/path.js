/**
 * @author lzxue
 * @email lzx199065@gmail.com
 * @create date 2018-11-28 11:01:33
 * @modify date 2018-11-28 11:01:33
 * @desc 点,线,面 coordinates
*/

function circle() {
  return polygonPath(30);
}
function square() {
  return polygonPath(4);
}
function triangle() {
  return polygonPath(3);
}
function hexagon() {
  return polygonPath(6, 1);
}
export {
  circle,
  square,
  triangle,
  hexagon,
  circle as cylinder,
  triangle as triangleColumn,
  hexagon as hexagonColumn,
  square as squareColumn
};

export function polygonPath(pointCount, start = 0) {
  const step = Math.PI * 2 / pointCount;
  const line = [];
  for (let i = 0; i < pointCount; i++) {
    line.push(step * i + start * Math.PI / 12);
  }
  const path = line.map(t => {
    const x = Math.sin(t + Math.PI / 4),
      y = Math.cos(t + Math.PI / 4);
    return [ x, y, 0 ];
  });
  path.push(path[0]);
  return path;
}
