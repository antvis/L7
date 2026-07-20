import type { IParserData, ITransform } from '@antv/l7-core';
import type { IFilterTransformCfg } from './types';

export function filter(data: IParserData, options: ITransform) {
  const { callback } = options as IFilterTransformCfg;
  if (callback) {
    data.dataArray = data.dataArray.filter(callback);
  }
  return data;
}
