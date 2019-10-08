import { ILayerGlobalConfig } from '../layer/ILayerService';
import { IMapConfig } from '../map/IMapService';
import { IRenderConfig } from '../renderer/IRendererService';

export type IGlobalConfig = IMapConfig & IRenderConfig & ILayerGlobalConfig;

export interface IGlobalConfigService {
  getConfig(): Partial<IGlobalConfig>;
  setAndCheckConfig(config: Partial<IGlobalConfig>): boolean;
  reset(): void;
}
