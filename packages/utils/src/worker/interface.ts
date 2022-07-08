export enum WorkerType {
  MESH = 'mesh',
  MAPPING = 'mapping',
  FETCH = 'fetch',
}

export type IMeshType = 'PointFill';

export interface IWorkOptions {
  meshType: IMeshType;
}
