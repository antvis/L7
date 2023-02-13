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

  log(key: string, values: ILog): void;
  getLog(key: string | string[] | undefined): void;
  removeLog(key: string): void;
  registerContextLost(): void;
  lostContext(): void;

  generateRenderUid(): string;
  renderStart(guid: string): void;
  renderEnd(guid: string): void;

}
