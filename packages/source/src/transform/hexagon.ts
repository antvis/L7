import { aProjectFlat, Satistics } from '@antv/l7-utils';
import { hexbin } from 'd3-hexbin';
const R_EARTH = 6378000;
import {
  IParseDataItem,
  IParserData,
  ISourceCFG,
  ITransform,
} from '@antv/l7-core';
interface IHexBinItem<T> extends Array<T> {
  x: number;
  y: number;
  [key: string]: any;
}
interface IRawData {
  coordinates: [number, number];
  [key: string]: any;
}
export function pointToHexbin(data: IParserData, option: ITransform) {
  const dataArray = data.dataArray;
  const { size = 10, method = 'sum' } = option;
  const pixlSize = ((size / (2 * Math.PI * R_EARTH)) * (256 << 20)) / 2;
  const screenPoints: IRawData[] = dataArray.map((point: IParseDataItem) => {
    const [x, y] = aProjectFlat(point.coordinates);
    return {
      ...point,
      coordinates: [x, y],
    };
  });

  const newHexbin = hexbin<IRawData>()
    .radius(pixlSize)
    .x((d: IRawData) => d.coordinates[0])
    .y((d: IRawData) => d.coordinates[1]);
  const hexbinBins = newHexbin(screenPoints);
  const result: IParserData = {
    dataArray: hexbinBins.map((hex: IHexBinItem<IRawData>, index: number) => {
      if (option.field && method) {
        const columns = Satistics.getColumn(hex, option.field);
        hex[method] = Satistics.statMap[method](columns);
      }
      return {
        [option.method]: hex[method],
        count: hex.length,
        rawData: hex,
        coordinates: [hex.x, hex.y],
        _id: index,
      };
    }),
    radius: pixlSize,
    xOffset: pixlSize,
    yOffset: pixlSize,
    type: 'hexagon',
  };
  return result;
}
