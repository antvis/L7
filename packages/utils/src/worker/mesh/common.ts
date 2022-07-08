export const encodePickingColor = `
var enablePicking = false;
function encodePickingColor( featureIdx ){
  return [
    (featureIdx + 1) & 255,
    ((featureIdx + 1) >> 8) & 255,
    (((featureIdx + 1) >> 8) >> 8) & 255,
  ];
}
`;

export const utils = `
function isNumber(n) {
  return typeof n === 'number';
}

function calculateCentroid(coord) {
  if (isNumber(coord[0])) {
    return coord;
  } else if (isNumber(coord[0][0])) {
    throw new Error('当前数据不支持标注');
  } else if (isNumber(coord[0][0][0])) {
    var coords = coord;
    let xSum = 0;
    let ySum = 0;
    let len = 0;
    coords.forEach((coor) => {
      coor.forEach((pos) => {
        xSum += pos[0];
        ySum += pos[1];
        len++;
      });
    });
    return [xSum / len, ySum / len, 0];
  } else {
    throw new Error('当前数据不支持标注');
  }
}
`;
