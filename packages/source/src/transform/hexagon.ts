import { aProjectFlat, metersToLngLat } from '@l7/utils';
import { hexbin } from 'd3-hexbin';
const R_EARTH = 6378000;
import {
  IParseDataItem,
  IParserCfg,
  IParserData,
  ISourceCFG,
  ITransform,
} from '@l7/core';
import { statMap } from './statistics';
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
  const { size = 10 } = option;
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
      if (option.field && option.method) {
        const columns = getColumn(hex, option.field);
        hex[option.method] = statMap[option.method](columns);
      }
      return {
        [option.method]: hex[option.method],
        count: hex.length,
        coordinates: [hex.x, hex.y],
        _id: index + 1,
      };
    }),
    radius: pixlSize,
    xOffset: pixlSize,
    yOffset: pixlSize,
  };
  return result;
}
function getColumn(data: IHexBinItem<IRawData>, columnName: string) {
  return data.map((item: IRawData) => {
    return item[columnName] * 1;
  });
}
