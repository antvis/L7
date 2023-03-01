// import Ajv from 'ajv';
import { injectable } from 'inversify';
import { merge } from 'lodash';
import 'reflect-metadata';
import {
  ILayerAttributesOption,
  ILayerConfig,
  MaskOperation,
} from '../layer/ILayerService';
import { IRenderConfig } from '../renderer/IRendererService';
import { IGlobalConfigService, ISceneConfig } from './IConfigService';
import WarnInfo from './warnInfo';

/**
 * 场景默认配置项
 */
const defaultSceneConfig: Partial<ISceneConfig & IRenderConfig> = {
  id: 'map',
  logoPosition: 'bottomleft',
  logoVisible: true,
  antialias: true,
  stencil: true,
  isMini: false,
  preserveDrawingBuffer: false,
  pickBufferScale: 1.0,
  fitBoundsOptions: {
    animate: false,
  },
};

/**
 * 图层基类默认样式属性
 */
const defaultLayerConfig: Partial<ILayerConfig> = {
  colors: [
    'rgb(103,0,31)',
    'rgb(178,24,43)',
    'rgb(214,96,77)',
    'rgb(244,165,130)',
    'rgb(253,219,199)',
    'rgb(247,247,247)',
    'rgb(209,229,240)',
    'rgb(146,197,222)',
    'rgb(67,147,195)',
    'rgb(33,102,172)',
    'rgb(5,48,97)',
  ],
  size: 10,
  shape: 'circle',
  scales: {},
  shape2d: [
    'circle',
    'triangle',
    'square',
    'pentagon',
    'hexagon',
    'octogon',
    'hexagram',
    'rhombus',
    'vesica',
  ],
  shape3d: ['cylinder', 'triangleColumn', 'hexagonColumn', 'squareColumn'],
  minZoom: -1,
  maxZoom: 24,
  visible: true,
  autoFit: false,
  pickingBuffer: 0,
  enablePropagation: false,
  zIndex: 0,
  blend: 'normal',
  maskLayers: [],
  enableMask: true,
  maskOperation: MaskOperation.AND,
  pickedFeatureID: -1,
  enableMultiPassRenderer: false,
  enablePicking: true,
  active: false,
  activeColor: '#2f54eb',
  enableHighlight: false,
  enableSelect: false,
  highlightColor: '#2f54eb',
  activeMix: 0,
  selectColor: 'blue',
  selectMix: 0,
  enableTAA: false,
  jitterScale: 1,
  enableLighting: false,
  animateOption: {
    enable: false,
    interval: 0.2,
    duration: 4,
    trailLength: 0.15,
  },
  forward: true, // 默认是正方向
};

// @see https://github.com/epoberezkin/ajv#options
// const ajv = new Ajv({
//   allErrors: true,
//   verbose: true,
// });

@injectable()
export default class GlobalConfigService implements IGlobalConfigService {
  /**
   * 全部场景配置项缓存
   */
  private sceneConfigCache: {
    [sceneId: string]: Partial<ISceneConfig>;
  } = {};

  /**
   * 场景配置项校验器
   */
  // private sceneConfigValidator: Ajv.ValidateFunction;

  /**
   * 地图配置项校验器
   */
  // private mapConfigValidator: Ajv.ValidateFunction;

  /**
   * 全部图层配置项缓存
   */
  private layerConfigCache: {
    [layerId: string]: Partial<ILayerConfig & ISceneConfig>;
  } = {};

  /**
   * 数据映射缓存
   */

  private layerAttributeConfigCache: {
    [layerId: string]: Partial<ILayerAttributesOption>;
  } = {};

  /**
   * 保存每一种 Layer 配置项的校验器
   */
  // private layerConfigValidatorCache: {
  //   [layerName: string]: Ajv.ValidateFunction;
  // } = {};

  public getSceneConfig(sceneId: string) {
    return this.sceneConfigCache[sceneId];
  }

  public getSceneWarninfo(id: string) {
    return WarnInfo[id];
  }

  public setSceneConfig(sceneId: string, config: Partial<ISceneConfig>) {
    this.sceneConfigCache[sceneId] = {
      ...defaultSceneConfig,
      ...config,
    };
  }

  // public validateSceneConfig(data: object) {
  //   return this.validate(this.sceneConfigValidator, data);
  // }

  // public validateMapConfig(data: object) {
  //   return this.validate(this.mapConfigValidator, data);
  // }

  public getLayerConfig<IChildLayerConfig>(
    layerId: string,
  ): Partial<ILayerConfig & ISceneConfig & IChildLayerConfig> {
    // @ts-ignore
    return this.layerConfigCache[layerId];
  }

  public setLayerConfig(
    sceneId: string,
    layerId: string,
    config: Partial<ILayerConfig>,
  ) {
    // @ts-ignore
    this.layerConfigCache[layerId] = {
      ...merge({}, this.sceneConfigCache[sceneId], defaultLayerConfig, config),
    };
  }

  public getAttributeConfig(layerId: string): Partial<ILayerAttributesOption> {
    return this.layerAttributeConfigCache[layerId];
  }

  public setAttributeConfig(
    layerId: string,
    attr: Partial<ILayerAttributesOption>,
  ) {
    // TODO
    this.layerAttributeConfigCache[layerId] = {
      ...this.layerAttributeConfigCache[layerId],
      ...attr,
    };
  }

  public clean() {
    this.sceneConfigCache = {};
    this.layerConfigCache = {};
  }

  // @postConstruct()
  // private registerSceneConfigSchemaValidator() {
  //   this.sceneConfigValidator = ajv.compile(sceneConfigSchema);
  //   this.mapConfigValidator = ajv.compile(mapConfigSchema);
  // }

  // private validate(
  //   validateFunc: Ajv.ValidateFunction | undefined,
  //   data: object,
  // ) {
  //   if (validateFunc) {
  //     const valid = validateFunc(data);
  //     if (!valid) {
  //       return {
  //         valid,
  //         errors: validateFunc.errors,
  //         errorText: ajv.errorsText(validateFunc.errors),
  //       };
  //     }
  //   }
  //   return {
  //     valid: true,
  //     errors: null,
  //     errorText: null,
  //   };
  // }
}
