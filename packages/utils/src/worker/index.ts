import { IWorkOptions, WorkerType } from './interface';
import getMeshTask from './mesh';

function WorkFactory(myTask: any) {
  const blob = new Blob([myTask]);
  return new Worker(window.URL.createObjectURL(blob));
}

function getWorker(type: WorkerType, options?: IWorkOptions) {
  switch (type) {
    case WorkerType.MESH:
      return WorkFactory(getMeshTask(options as IWorkOptions));
    case WorkerType.MAPPING:
      return '';
    case WorkerType.FETCH:
      return '';
  }
}

export { getWorker, WorkerType, IWorkOptions };