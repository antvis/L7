import { ILayer } from '../layer/ILayerService';
import { IMapConfig } from '../map/IMapService';
import { IRenderConfig } from '../renderer/IRendererService';

export interface ISceneService {
  init(config: IMapConfig & IRenderConfig): void;
  addLayer(layer: ILayer): void;
  render(): void;
  destroy(): void;
}
