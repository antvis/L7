import { ISceneConfig } from '../config/IConfigService';
import { ILayer } from '../layer/ILayerService';
import { IMapConfig } from '../map/IMapService';
import { IRenderConfig } from '../renderer/IRendererService';

export interface ISceneService {
  destroyed: boolean;
  loaded: boolean;
  on(type: string, handle: (...args: any[]) => void): void;
  off(type: string, handle: (...args: any[]) => void): void;
  removeAllListeners(event?: string): this;
  init(config: IMapConfig & IRenderConfig): void;
  addLayer(layer: ILayer): void;
  getSceneConfig(): Partial<ISceneConfig>;
  render(): void;
  getSceneContainer(): HTMLDivElement;
  getMarkerContainer(): HTMLElement;
  exportPng(type?: 'png' | 'jpg'): string;
  destroy(): void;
}
// scene 事件
export const SceneEventList: string[] = [
  'loaded',
  'maploaded',
  'resize',
  'destroy',
  'dragstart',
  'dragging',
  'dragend',
  'dragcancel',
];
