export type ILayerId = string;
export interface ILog {
  [key: string]: any
}
export interface IDebugService {

  log(key: string, values: ILog): void;
  getLog(key: string | string[] | undefined): void;
  removeLog(key: string): void;
  registerContextLost(): void;
  lostContext(): void;
}
