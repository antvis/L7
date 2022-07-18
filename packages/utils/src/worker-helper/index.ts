import { createWorker, WorkerFarm } from 'web-worker-helper';
import { getWorkerSource, registerWorkerSource } from './worker-map';

export { createWorker };

const L7_WORKER_NAME = 'l7-worker';

export function registerL7WorkerSource(workerSource: string) {
  registerWorkerSource(L7_WORKER_NAME, workerSource);
}

function getL7WorkerSource(): string {
  const workerSource = getWorkerSource(L7_WORKER_NAME);

  if (!workerSource) {
    throw new Error(`get worker failed by workerName: ${L7_WORKER_NAME}.`);
  }

  return workerSource;
}

export async function parseL7Worker(
  workerType: string,
  data: any,
  options: Record<string, any> = { maxConcurrency: 3, reuseWorkers: true },
) {
  const source = getL7WorkerSource();
  const workerFarm = WorkerFarm.getWorkerFarm({
    maxConcurrency: options.maxConcurrency,
    reuseWorkers: options.reuseWorkers,
  });
  const workerPool = workerFarm.getWorkerPool({ name: L7_WORKER_NAME, source });
  const job = await workerPool.startJob(L7_WORKER_NAME, (myJob, type, myData) =>
    myJob.done(myData),
  );

  job.postMessage('process', { input: { workerType, data } });

  const result = await job.result;
  return result.result;
}
