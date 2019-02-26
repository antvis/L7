import { hexbin } from 'd3-hexbin';
import { aProjectFlat, unProjectFlat } from '../../geo/project';
import * as statistics from './statistics';
const R_EARTH = 6378000;
export function pointToHexbin(data, option) {
  const dataArray = data.dataArray;
  const { size = 10 } = option;
  const pixlSize = size / (2 * Math.PI * R_EARTH) * (256 << 20) / 2;
  const screenPoints = dataArray.map(point => {
    const { x, y } = aProjectFlat(point.coordinates);
    return {
      ...point,
      coordinates: [ x, y ]
    };
  });

  const newHexbin = hexbin()
    .radius(pixlSize)
    .x(d => d.coordinates[0])
    .y(d => d.coordinates[1]);
  const hexbinBins = newHexbin(screenPoints);
  const result = {
    size: pixlSize
  };
  result.dataArray = hexbinBins.map((hex, index) => {
    if (option.field && option.method) {
      const columns = getColumn(hex, option.field);
      hex[option.method] = statistics[option.method](columns);
    }
    return {
      coordinates: unProjectFlat([ hex.x, hex.y ]),
      id: index + 1
    };
  });
  return result;
}
function getColumn(data, columnName) {
  return data.map(item => {
    return item[columnName];
  });
}
