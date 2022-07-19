import { createWorker } from '@antv/l7-utils/src/worker-helper';
import { lineTriangulation } from './line-triangulation';
import { pointFillWorker } from './pointFill';

const workerTypes: Record<string, (data: any) => Promise<any>> = {
  pointFill: pointFillWorker,
  'line-triangulation': lineTriangulation,
};

async function worker({ workerType, data }: { workerType: string; data: any }) {
  if (workerTypes[workerType]) {
    return workerTypes[workerType](data);
  }

  return Promise.reject(
    new Error(`Worker with type "${workerType}" non-existent.`),
  );
}

export default createWorker(worker);
