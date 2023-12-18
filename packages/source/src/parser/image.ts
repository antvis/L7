import type { IParserData } from '@antv/l7-core';
import type { RequestParameters} from '@antv/l7-utils';
import { getImage, isImageBitmap } from '@antv/l7-utils';
interface IImageCfg {
  extent: [number, number, number, number];
  requestParameters?: Omit<RequestParameters, 'url'>;
}
export default function image(
  data: string | string[] | HTMLImageElement | ImageBitmap,
  cfg: IImageCfg,
): IParserData {
  // 为 extent 赋默认值
  const {
    extent = [121.168, 30.2828, 121.384, 30.4219],
    requestParameters = {},
  } = cfg;
  const images = new Promise((resolve) => {
    if (data instanceof HTMLImageElement || isImageBitmap(data)) {
      resolve([data]);
    } else {
      loadData(data, requestParameters, (res: any) => {
        resolve(res);
      });
    }
  });
  const resultData: IParserData = {
    originData: data,
    images,
    _id: 1,
    dataArray: [
      {
        _id: 0,
        coordinates: [
          [extent[0], extent[1]],
          [extent[2], extent[3]],
        ],
      },
    ],
  };
  return resultData;
}

function loadData(
  url: string | string[],
  requestParameters: Omit<RequestParameters, 'url'>,
  done: any,
) {
  const imageDatas: Array<HTMLImageElement | ImageBitmap> = [];
  if (typeof url === 'string') {
    getImage({ ...requestParameters, url }, (err, img) => {
      if (img) {
        imageDatas.push(img);
        done(imageDatas);
      }
    });
  } else {
    const imageCount = url.length;
    let imageindex = 0;
    url.forEach((item) => {
      getImage({ ...requestParameters, url: item }, (err, img) => {
        imageindex++;
        if (img) {
          imageDatas.push(img);
        }
        if (imageindex === imageCount) {
          done(imageDatas);
        }
      });
    });
  }
  return image;
}
