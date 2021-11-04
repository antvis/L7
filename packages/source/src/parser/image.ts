import { IParserData } from '@antv/l7-core';
import { getImage } from '@antv/l7-utils';
interface IImageCfg {
  extent: [number, number, number, number];
}
export default function image(
  data: string | string[],
  cfg: IImageCfg,
): IParserData {
  // TODO: 为 extent 赋默认值
  const { extent = [121.168, 30.2828, 121.384, 30.4219] } = cfg;
  const images = new Promise((resolve) => {
    loadData(data, (res: any) => {
      resolve(res);
    });
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
function loadData(data: string | string[], done: any) {
  const url = data;
  const imageDatas: HTMLImageElement[] = [];
  if (typeof url === 'string') {
    getImage({ url }, (err: string, img: HTMLImageElement) => {
      imageDatas.push(img);
      done(imageDatas);
    });
  } else {
    const imageCount = url.length;
    let imageindex = 0;
    url.forEach((item) => {
      getImage({ url: item }, (err: any, img: HTMLImageElement) => {
        imageindex++;
        imageDatas.push(img);
        if (imageindex === imageCount) {
          done(imageDatas);
        }
      });
    });
  }
  return image;
}
