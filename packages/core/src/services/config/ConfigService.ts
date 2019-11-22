import Ajv from 'ajv';
import { injectable, postConstruct } from 'inversify';
import { ILayerConfig } from '../layer/ILayerService';
import { IGlobalConfigService, ISceneConfig } from './IConfigService';
import sceneConfigSchema from './sceneConfigSchema';

/**
 * 场景默认配置项
 */
const defaultSceneConfig: Partial<ISceneConfig> = {
  type: 'amap',
  zoom: 5,
  center: [107.622, 39.266],
  pitch: 0,
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
  minZoom: 0,
  maxZoom: 20,
  visible: true,
  zIndex: 0,
  enableMultiPassRenderer: true,
  enablePicking: false,
  enableHighlight: false,
  highlightColor: 'red',
  enableTAA: false,
  jitterScale: 1,
  enableLighting: false,
};

// @see https://github.com/epoberezkin/ajv#options
const ajv = new Ajv({
  allErrors: true,
  verbose: true,
});

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
  private sceneConfigValidator: Ajv.ValidateFunction;

  /**
   * 全部图层配置项缓存
   */
  private layerConfigCache: {
    [layerId: string]: Partial<ILayerConfig & ISceneConfig>;
  } = {};

  /**
   * 保存每一种 Layer 配置项的校验器
   */
  private layerConfigValidatorCache: {
    [layerName: string]: Ajv.ValidateFunction;
  } = {};

  public getSceneConfig(sceneId: string) {
    return this.sceneConfigCache[sceneId];
  }

  public setSceneConfig(sceneId: string, config: Partial<ISceneConfig>) {
    this.sceneConfigCache[sceneId] = {
      ...defaultSceneConfig,
      ...config,
    };
  }

  public validateSceneConfig(data: object) {
    return this.validate(this.sceneConfigValidator, data);
  }

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
      ...this.sceneConfigCache[sceneId],
      ...defaultLayerConfig,
      ...config,
    };
  }

  public registerLayerConfigSchemaValidator(layerName: string, schema: object) {
    if (!this.layerConfigValidatorCache[layerName]) {
      this.layerConfigValidatorCache[layerName] = ajv.compile(schema);
    }
  }

  public validateLayerConfig(layerName: string, data: object) {
    return this.validate(this.layerConfigValidatorCache[layerName], data);
  }

  public clean() {
    this.sceneConfigCache = {};
    this.layerConfigCache = {};
  }

  @postConstruct()
  private registerSceneConfigSchemaValidator() {
    this.sceneConfigValidator = ajv.compile(sceneConfigSchema);
  }

  private validate(
    validateFunc: Ajv.ValidateFunction | undefined,
    data: object,
  ) {
    if (validateFunc) {
      const valid = validateFunc(data);
      if (!valid) {
        return {
          valid,
          errors: validateFunc.errors,
          errorText: ajv.errorsText(validateFunc.errors),
        };
      }
    }
    return {
      valid: true,
      errors: null,
      errorText: null,
    };
  }
}
