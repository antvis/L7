import type { IParserData } from '@antv/l7-core';
import type { IImageCfg } from '../interface';
import { ImageLoader } from '../loader/image-loader';
import { extentToCoord } from '../utils/util';
export default function image(
  data: string | string[] | HTMLImageElement | ImageBitmap,
  cfg: IImageCfg,
): IParserData {
  // 为 extent 赋默认值
  const {
    extent = [121.168, 30.2828, 121.384, 30.4219],
    coordinates,
    requestParameters = {},
  } = cfg;

  // 取数下沉 loader（阶段 3.3）；parser 不再 import getImage（满足 PLAN 3.3
  // 「image.ts parser 不再自己 getImage() fetch」）。images Promise 字段形状
  // 不变，消费方 `await source.data.images` 零改动
  const images = new ImageLoader(data, requestParameters).load();

  const imageCoord = extentToCoord(coordinates, extent);

  const resultData: IParserData = {
    originData: data,
    images,
    _id: 1,
    dataArray: [
      {
        _id: 0,
        coordinates: imageCoord,
      },
    ],
  };
  return resultData;
}
