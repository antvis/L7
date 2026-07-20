import type { IParserData, ITransform } from '@antv/l7-core';
import type { IMapTransformCfg } from './types';

export function map(data: IParserData, options: ITransform) {
  const { callback } = options as IMapTransformCfg;
  if (callback) {
    data.dataArray = data.dataArray.map(callback);
  }
  return data;
}
