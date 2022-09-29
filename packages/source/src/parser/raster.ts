import { IParserData } from '@antv/l7-core';
import { IRasterLayerData, IRasterCfg, IRasterFileData } from '../interface';
import {
  isNumberArray,
  isRasterFileDataArray,
  bandsOperation,
} from '../utils/bandOperation/bands';

export default function raster(
  data: IRasterLayerData,
  cfg: IRasterCfg,
): IParserData {
  const { extent, width, height, min, max, format, operation } = cfg;
  let bandData, rasterWidth, rasterHeight;
  if (format === undefined || isNumberArray(data)) {
    // 兼容写法
    bandData = Array.from(data as number[]);
    rasterWidth = width;
    rasterHeight = height;
  } else {
    const imageDataList = (isRasterFileDataArray(data)
      ? data
      : [data]) as IRasterFileData[];
    bandData = bandsOperation(imageDataList, format, operation);
  }

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
        coordinates: [
          [extent[0], extent[1]],
          [extent[2], extent[3]],
        ],
      },
    ],
  };
  return resultData;
}
