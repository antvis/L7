import type { IParserData } from '@antv/l7-core';
import type { IRasterCfg } from '../../interface';
import { percentile } from '../../utils/bandOperation/operationSchema';
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
  const { extent, coordinates, width, height, ...options } = cfg;
  if (data.length < 3) {
    console.warn('RGB解析需要三个波段的数据');
  }
  const [r, g, b] = options.bands || [0, 1, 2];
  const bandsData = [data[r], data[g], data[b]];
  const rgbdata = [];
  const [low, high] = options?.countCut || [2, 98];
  const minMaxR = options?.RMinMax || percentile(bandsData[0], low, high);
  const minMaxG = options?.GMinMax || percentile(bandsData[1], low, high);
  const minMaxB = options?.BMinMax || percentile(bandsData[2], low, high);
  for (let i = 0; i < bandsData[0].length; i++) {
    rgbdata.push(Math.max(0, bandsData[0][i] - minMaxR[0]));
    rgbdata.push(Math.max(0, bandsData[1][i] - minMaxG[0]));
    rgbdata.push(Math.max(0, bandsData[2][i] - minMaxB[0]));
  }
  const imageCoord = extentToCoord(coordinates, extent!);
  const resultData = {
    _id: 1,
    dataArray: [
      {
        _id: 1,
        data: rgbdata,
        width,
        height,
        rMinMax: minMaxR,
        gMinMax: minMaxG,
        bMinMax: minMaxB,
        ...options,
        coordinates: imageCoord,
      },
    ],
  };
  return resultData;
}
