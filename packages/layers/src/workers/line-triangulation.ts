import { IEncodeFeature } from '@antv/l7-core';
import { LineTriangulation } from '../core/triangulation';

export const lineTriangulation = async (data: IEncodeFeature) => {
  const result = LineTriangulation(data);
  return result;
};
