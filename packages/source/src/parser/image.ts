import { IParserData } from '../interface';

interface IImageCfg {
  extent: [number, number, number, number];
}
export default function image(data: string | [], cfg: IImageCfg): IParserData {
  const { extent } = cfg;

  const resultData: IParserData = {
    images: loadData(data),
    _id: 1,
    dataArray: [
      {
        _id: 0,
        coordinates: [[extent[0], extent[1]], [extent[2], extent[3]]],
      },
    ],
  };
  return resultData;
}
function loadData(data: string | string[]): Promise<Response | Response[]> {
  const url = data;
  if (typeof url === 'string') {
    const imageRequest = new Request(url);
    return fetch(imageRequest);
  } else {
    const fetchs = url.map((item: string) => {
      const imageRequest = new Request(item);
      return fetch(imageRequest);
    });
    return Promise.all(fetchs);
  }
}
