import { ILayer } from '../layer/ILayerService';
import { IMapConfig } from '../map/IMapService';
import { IRenderConfig } from '../renderer/IRendererService';

export interface ISceneService {
  on(type: string, hander: (...args: any[]) => void): void;
  off(type: string, hander: (...args: any[]) => void): void;
  removeAllListeners(event?: string): this;
  init(config: IMapConfig & IRenderConfig): void;
  addLayer(layer: ILayer): void;
  render(): void;
  getSceneContainer(): HTMLDivElement;
  exportPng(): string;
  destroy(): void;
}
// scene 事件
export const SceneEventList = ['loaded', 'maploaded', 'resize', 'destroy'];
