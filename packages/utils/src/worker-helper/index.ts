import { WorkerFarm } from 'web-worker-helper';
// @ts-ignore
import WorkerInlineSource from '../../dist/l7-utils.worker.js';
import { WorkerSourceMap } from '../workers';
import { getWorkerSource, registerWorkerSource } from './worker-map';

export { WorkerSourceMap };

const L7_WORKER_NAME = 'l7-worker';
const WORKER_MAX_CONCURRENCY = 3;
const WORKER_REUSE = true;

export function setL7WorkerSource(workerSource: string) {
  registerWorkerSource(L7_WORKER_NAME, workerSource);
}

function getL7WorkerSource(): string {
  const workerSource = getWorkerSource(L7_WORKER_NAME);

  if (!workerSource) {
    throw new Error(`get worker failed by workerName: ${L7_WORKER_NAME}.`);
  }

  return workerSource;
}

export async function executeWorkerTask(workerType: string, data: any) {
  const source = getL7WorkerSource();
  const workerFarm = WorkerFarm.getWorkerFarm({
    maxConcurrency: WORKER_MAX_CONCURRENCY,
    reuseWorkers: WORKER_REUSE,
  });
  const workerPool = workerFarm.getWorkerPool({ name: L7_WORKER_NAME, source });
  const job = await workerPool.startJob(L7_WORKER_NAME, (myJob, type, myData) =>
    myJob.done(myData),
  );

  job.postMessage('process', { input: { workerType, data } });

  const result = await job.result;
  return result.result;
}

setL7WorkerSource(WorkerInlineSource);
