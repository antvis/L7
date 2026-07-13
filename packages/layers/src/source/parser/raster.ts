import type { IParserData } from '@antv/l7-core';
import type { IRasterCfg, IRasterFileData, IRasterLayerData } from '../interface';
import { bandsOperation } from '../utils/bandOperation/bands';
import { extentToCoord, isNumberArray } from '../utils/util';
export default function raster(data: IRasterLayerData, cfg: IRasterCfg): IParserData {
  const {
    extent = [121.168, 30.2828, 121.384, 30.4219],
    coordinates,
    width,
    height,
    min,
    max,
    format,
    operation,
  } = cfg;
  let bandData;
  let rasterWidth;
  let rasterHeight;
  if (format === undefined || isNumberArray(data)) {
    // 兼容写法 - 用户直接传入解析完的波段数据
    bandData = Array.from(data as number[]);
    rasterWidth = width;
    rasterHeight = height;
  } else {
    // 用户传入为解析的栅格数据 - arraybuffer
    // 将数据统一为 IRasterFileData[]
    const imageDataList = (Array.isArray(data) ? data : [data]) as IRasterFileData[];
    bandData = bandsOperation(imageDataList, format, operation);
  }

  const imageCoord = extentToCoord(coordinates, extent);

  const resultData = {
    _id: 1,
    dataArray: [
      {
        _id: 1,
        data: bandData,
        width: rasterWidth,
        height: rasterHeight,
        min,
        max,
        coordinates: imageCoord,
      },
    ],
  };
  return resultData;
}
