import { createWorker, getWorkerURL, WorkerFarm } from 'web-worker-helper';

export { createWorker };

export async function parseWorker(
  workerName: string,
  data: any,
  options: Record<string, any> = { maxConcurrency: 3, reuseWorkers: true },
) {
  // const url = getWorkerURL(workerName, options);
  const source = 'codeString';
  const workerFarm = WorkerFarm.getWorkerFarm({
    maxConcurrency: options.maxConcurrency,
    reuseWorkers: options.reuseWorkers,
  });
  // const workerPool = workerFarm.getWorkerPool({ name: workerName, url });
  const workerPool = workerFarm.getWorkerPool({ name: workerName, source });
  const job = await workerPool.startJob(workerName, (myJob, type, myData) =>
    myJob.done(myData),
  );

  job.postMessage('process', { input: data });

  const result = await job.result;
  return result.result;
}
