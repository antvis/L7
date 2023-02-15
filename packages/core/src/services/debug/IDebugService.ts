export type ILayerId = string;
export interface ILog {
  [key: string]: any;
}

export const enum IDebugLog {
  MapInitStart = 'mapInitStart',
  LayerInitStart = 'layerInitStart',
  LayerInitEnd = 'layerInitEnd',
  SourceInitStart = 'sourceInitStart',
  SourceInitEnd = 'sourceInitEnd',
  ScaleInitStart = 'scaleInitStart',
  ScaleInitEnd = 'scaleInitEnd',
  MappingStart = 'mappingStart',
  MappingEnd = 'mappingEnd',
  BuildModelStart = 'buildModelStart',
  BuildModelEnd = 'buildModelEnd',
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
  getLog(key?: string | string[]): ILog[] | ILog | undefined;
  removeLog(key: string): void;

  generateRenderUid(): string;
  renderStart(guid: string): void;
  renderEnd(guid: string): void;
}
