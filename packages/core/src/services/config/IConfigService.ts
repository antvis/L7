// import Ajv from 'ajv';
import { PositionName } from '../component/IControlService';
import { ILayerAttributesOption, ILayerConfig } from '../layer/ILayerService';
import { IMapWrapper } from '../map/IMapService';
import { IRenderConfig } from '../renderer/IRendererService';
export interface ISceneConfig extends IRenderConfig {
  id: string | HTMLDivElement;
  canvas?: HTMLCanvasElement;
  gl?: any;
  hasBaseMap?: boolean;
  map: IMapWrapper;
  logoPosition?: PositionName;
  logoVisible?: boolean;
  isMini?: boolean; // 是否是小程序场景
  animate?: boolean;
  fitBoundsOptions?: unknown;
  pickBufferScale?: number;
  // TODO: 场景是否支持 stencil mask
  stencil?: boolean;
  debug?: boolean;
}

export interface IGlobalConfigService {
  /**
   * 获取场景配置项
   * @param sceneId 场景 ID
   */
  getSceneConfig(sceneId: string): Partial<ISceneConfig>;
  setSceneConfig(sceneId: string, config: Partial<ISceneConfig>): void;

  /**
   * 校验用户传入的场景配置项
   * @param data 场景配置项
   */
  // validateSceneConfig(data: object): IValidateResult;

  /**
   * 校验用户传入的地图配置项
   * @param data 地图配置项
   */
  // validateMapConfig(data: object): IValidateResult;

  /**
   * 获取图层配置项
   * @param layerId 图层 ID
   */
  getLayerConfig<IChildLayerConfig>(
    layerId: string,
  ): Partial<ILayerConfig & ISceneConfig & IChildLayerConfig>;
  /**
   * 获取警告信息
   * @param key
   */
  getSceneWarninfo(layerId: string): string;

  /**
   * 设置图层配置项，继承所属场景配置项
   * @param sceneId 场景 ID
   * @param layerId 图层 ID
   * @param config 图层配置项
   */
  setLayerConfig(
    sceneId: string,
    layerId: string,
    config: Partial<ILayerConfig>,
  ): void;
  /**
   * 获取数据映射
   */
  getAttributeConfig(layerId: string): Partial<ILayerAttributesOption>;

  /**
   * 设置数据映射
   * @param layerId sh
   * @param attr
   */
  setAttributeConfig(
    layerId: string,
    attr: Partial<ILayerAttributesOption>,
  ): void;

  /**
   * 清除场景和图层配置项 Cache，但是需要保留校验器
   */
  clean(): void;
}
