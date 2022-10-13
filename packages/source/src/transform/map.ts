import { IParserData } from '@antv/l7-core';
export function map(data: IParserData, options: { [key: string]: any }) {
  const { callback } = options;
  if (callback) {
    data.dataArray = data.dataArray.map(callback);
  }
  return data;
}
