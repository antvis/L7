export type ILayerId = string;
export interface ILog {
  [key: string]: any
}
export interface IDebugService {

  log(key: string, values: ILog): void;
  // getLog(key: string | RegExp, key2?: string): ILog[];
  getLog(key: string | string[] | undefined): void;

  registerContextLost(): void;
  lostContext(): void;
}
