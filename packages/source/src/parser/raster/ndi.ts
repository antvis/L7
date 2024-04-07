import type { IParserData } from '@antv/l7-core';
import type { IRasterCfg } from '../../interface';
import { extentToCoord } from '../../utils/util';

/**
 * @description: 栅格数据解析
 */
export type RasterDataType =
  | Uint8Array
  | Int8Array
  | Uint16Array
  | Int16Array
  | Uint32Array
  | Int32Array
  | Float32Array
  | Float64Array;

export interface IRGBParseCfg extends IRasterCfg {
  bands?: [number, number, number];
  countCut?: [number, number];
  RMinMax?: [number, number];
  GMinMax?: [number, number];
  BMinMax?: [number, number];
}

export default function rasterRgb(data: RasterDataType[], cfg: IRGBParseCfg): IParserData {
  const {
    extent = [121.168, 30.2828, 121.384, 30.4219],
    coordinates,
    width,
    height,
    ...options
  } = cfg;
  if (data.length < 2) {
    console.warn('RGB解析需要2个波段的数据');
  }
  const [n, d] = options.bands || [0, 1];
  const bandsData = [data[n], data[d]];
  const ndidata = [];

  for (let i = 0; i < bandsData[0].length; i++) {
    ndidata.push((bandsData[1][i] - bandsData[0][i]) / (bandsData[1][i] + bandsData[0][i]));
  }

  const imageCoord = extentToCoord(coordinates, extent);
  const resultData = {
    _id: 1,
    dataArray: [
      {
        _id: 1,
        data: ndidata,
        width,
        height,
        ...options,
        coordinates: imageCoord,
      },
    ],
  };
  return resultData;
}
