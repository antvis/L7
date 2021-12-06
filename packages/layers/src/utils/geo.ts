type Position = number[];
import { isNumber } from 'lodash';
export function calculateCentroid(
  coord: Position | Position[] | Position[][],
): Position {
  // let pos = coord as Position;
  if (isNumber(coord[0])) {
    return coord as Position;
  } else if (isNumber(coord[0][0])) {
    throw new Error('当前数据不支持标注');
  } else if (isNumber(coord[0][0][0])) {
    const coords = coord as Position[][];
    let xSum = 0;
    let ySum = 0;
    let len = 0;
    coords.forEach((coor: Position[]) => {
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

/**
 * 计算
 * @param points
 * @returns
 */
export function calculatePointsCenterAndRadius(points: number[]) {
  let maxX = points[0];
  let maxY = points[1];
  let minX = points[0];
  let minY = points[1];
  let xCount = 0;
  let yCount = 0;
  let pCount = 0;

  for (let i = 0; i < points.length; i += 2) {
    const x = points[i];
    const y = points[i + 1];
    if (x && y) {
      maxX = Math.max(x, maxX);
      maxY = Math.max(y, maxY);
      minX = Math.min(x, minX);
      minY = Math.min(y, minY);
      xCount += x;
      yCount += y;
      pCount++;
    }
  }
  return {
    center: [xCount / pCount, yCount / pCount],
    radius: Math.sqrt(Math.pow(maxX - minX, 2) + Math.pow(maxY - minY, 2)) / 2,
  };
}
