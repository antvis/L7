import { ISceneConfig } from '../config/IConfigService';
import { ILayer } from '../layer/ILayerService';
import EventEmitter from 'eventemitter3';

export interface ISceneService extends EventEmitter {
  destroyed: boolean;
  loaded: boolean;
  // on(type: string, handle: (...args: any[]) => void): void;
  // once(type: string, handle: (...args: any[]) => void): void;
  // off(type: string, handle: (...args: any[]) => void): void;
  removeAllListeners(event?: string): this;
  init(config: ISceneConfig): void;
  initMiniScene(config: ISceneConfig): void;
  addLayer(layer: ILayer): void;
  getSceneConfig(): Partial<ISceneConfig>;
  getPointSizeRange(): Float32Array;
  render(): void;
  getSceneContainer(): HTMLDivElement;
  getMarkerContainer(): HTMLElement;
  exportPng(type?: 'png' | 'jpg'): string;
  addFontFace(fontname: string, fontpath: string): void;
  destroy(): void;
}
// scene 事件
export const SceneEventList: string[] = [
  'loaded',
  'fontloaded',
  'maploaded',
  'resize',
  'destroy',
  'dragstart',
  'dragging',
  'dragend',
  'dragcancel',
];
