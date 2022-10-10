import { createWorker } from 'web-worker-helper';
import { lineModel } from './lineModel';
import { pointFillModel } from './pointFillModel';
import { polygonFillModel } from './polygonFillModel';

// current support worker
export const WorkerSourceMap = {
  pointFill: pointFillModel,
  line: lineModel,
  polygonFill: polygonFillModel,
};

const workerTypes: Record<string, (data: any) => Promise<any>> = {
  ...WorkerSourceMap,
};

async function worker({ workerType, data }: { workerType: string; data: any }) {
  if (workerTypes[workerType]) {
    return workerTypes[workerType](data);
  }

  return Promise.reject(
    new Error(`Worker with type "${workerType}" non-existent.`),
  );
}

createWorker(worker);

// export default createWorker(worker);
export { createWorker, worker };
