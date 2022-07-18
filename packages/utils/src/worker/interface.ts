export enum WorkerType {
  MESH = 'mesh',
  MAPPING = 'mapping',
  FETCH = 'fetch',
}

export type IModelType = 'PointFill';

export interface IWorkOptions {
  modelType: IModelType;
  attributesUpdateFunctions: any;
}
