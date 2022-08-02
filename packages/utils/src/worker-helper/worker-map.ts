const WorkerSourceMap = new Map<string, string>();

export function registerWorkerSource(workerName: string, workerSource: string) {
  WorkerSourceMap.set(workerName, workerSource);
}

export function getWorkerSource(workerName: string) {
  const workerSource = WorkerSourceMap.get(workerName);
  return workerSource;
}
