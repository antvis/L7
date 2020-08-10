type Position = number[];
import { isNumber } from 'lodash';
export function calculteCentroid(
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
