import { IParserData, IRasterCfg } from '@l7/core';
export default function raster(data: number[], cfg: IRasterCfg): IParserData {
  const { extent, width, height, min, max } = cfg;
  const resultData = {
    _id: 1,
    dataArray: [
      {
        _id: 1,
        data: Array.from(data),
        width,
        height,
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
