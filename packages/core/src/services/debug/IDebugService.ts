export type ILayerId = string;
export interface ILog {
  [key: string]: any
}

export interface IRenderInfo {
  renderUid: string;
  renderStart?: number;
  renderEnd?: number;
  renderDuration?: number;
}
export interface IDebugService {
  renderEnable: boolean;

  setEnable(flag: boolean | undefined): void;

  log(key: string, values: ILog): void;
  getLog(key: string | string[] | undefined): void;
  removeLog(key: string): void;

  generateRenderUid(): string;
  renderStart(guid: string): void;
  renderEnd(guid: string): void;

}
