import { IEncodeFeature } from '@antv/l7-core';
import { createWorker } from '@antv/l7-utils';
import { LineTriangulation } from '../core/triangulation';

// eslint-disable-next-line no-unused-vars
createWorker(async (data: IEncodeFeature, options?: Record<string, any>) => {
  const result = LineTriangulation(data);
  return result;
});
