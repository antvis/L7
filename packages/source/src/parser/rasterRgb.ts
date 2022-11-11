import { IParserData } from '@antv/l7-core';
import { IRasterCfg, IRasterFileData, IRasterLayerData } from '../interface';
import { bandsOperation } from '../utils/bandOperation/bands';
import { isNumberArray } from '../utils/util';

export default function rasterRgb(
  data: IRasterLayerData,
  cfg: IRasterCfg,
): IParserData {
  const { extent, min, max, width, height, format, operation, ...rest } = cfg;
  let bandData;
  if (format === undefined || isNumberArray(data)) {
    // 兼容写法 - 用户直接传入解析完的波段数据
    bandData = Array.from(data as number[]);
  } else {
    // 用户传入为解析的栅格数据 - arraybuffer
    // 将数据统一为 IRasterFileData[]
    const imageDataList = (
      Array.isArray(data) ? data : [data]
    ) as IRasterFileData[];
    bandData = bandsOperation(imageDataList, format, operation);
  }
  const resultData = {
    _id: 1,
    dataArray: [
      {
        _id: 1,
        data: bandData,
        width,
        height,
        ...rest,
        min,
        max,
        coordinates: [
          [extent[0], extent[1]],
          [extent[2], extent[3]],
        ],
      },
    ],
  };
  return resultData;
}
