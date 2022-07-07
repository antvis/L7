import {
  createWorker,
  WorkerFarm,
  assert,
  WorkerObject,
  WorkerOptions,
} from 'web-worker-helper';

export { createWorker, WorkerObject };

const WorkerMap = new Map<string, WorkerObject>();

export function registerWorker(workerName: string, worker: WorkerObject) {
  WorkerMap.set(workerName, worker);
}

export function getWorker(workerName: string) {
  const worker = WorkerMap.get(workerName);
  return worker;
}

function getWorkerURL(workerName: string, options: WorkerOptions = {}): string {
  const worker = getWorker(workerName);

  if (!worker) {
    throw new Error(`get worker failed by workerName: ${workerName}.`);
  }

  const workerFileName = `${worker.name}.js`;

  let url;

  if (process.env.NODE_ENV === 'development') {
    url = `${worker.module}/dist/${workerFileName}`;
  }

  if (!url) {
    const cdn = options.CDN || ' https://unpkg.com';
    url = `${cdn}/${worker.module}/dist/${workerFileName}`;
  }

  assert(url);

  return url;
}

export async function parseWorker(
  workerName: string,
  data: any,
  options: Record<string, any> = { maxConcurrency: 3, reuseWorkers: true },
) {
  const url = getWorkerURL(workerName, options);
  // const source = 'codeString';
  const workerFarm = WorkerFarm.getWorkerFarm({
    maxConcurrency: options.maxConcurrency,
    reuseWorkers: options.reuseWorkers,
  });
  const workerPool = workerFarm.getWorkerPool({ name: workerName, url });
  // const workerPool = workerFarm.getWorkerPool({ name: workerName, source });
  const job = await workerPool.startJob(workerName, (myJob, type, myData) =>
    myJob.done(myData),
  );

  job.postMessage('process', { input: data });

  const result = await job.result;
  return result.result;
}
