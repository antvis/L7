import Ajv from 'ajv';
import { injectable } from 'inversify';
import { IGlobalConfig, IGlobalConfigService } from './IConfigService';

const defaultGlobalConfig: Partial<IGlobalConfig> = {
  type: 'amap',
  zoom: 5,
  center: [107.622, 39.266],
  pitch: 0,
  // minZoom: 3,
  // maxZoom: 18,
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
  size: 10000,
  shape: 'circle',
  scales: {},
};

// @see https://github.com/epoberezkin/ajv#options
const ajv = new Ajv({
  allErrors: true,
  verbose: true,
});

@injectable()
export default class GlobalConfigService implements IGlobalConfigService {
  private config: Partial<IGlobalConfig> = defaultGlobalConfig;

  /**
   * 保存每个 Layer 配置项的校验器
   */
  private layerConfigValidatorCache: {
    [layerName: string]: Ajv.ValidateFunction;
  } = {};

  public getConfig() {
    return this.config;
  }

  public setAndCheckConfig(config: Partial<IGlobalConfig>) {
    this.config = {
      ...this.config,
      ...config,
    };
    // TODO: validate config with JSON schema
    // @see https://github.com/webpack/schema-utils
    return true;
  }

  public reset() {
    this.config = defaultGlobalConfig;
  }

  public registerLayerConfigSchemaValidator(layerName: string, schema: object) {
    if (!this.layerConfigValidatorCache[layerName]) {
      this.layerConfigValidatorCache[layerName] = ajv.compile(schema);
    }
  }

  public validateLayerConfig(layerName: string, data: object) {
    const validate = this.layerConfigValidatorCache[layerName];
    if (validate) {
      const valid = validate(data);
      if (!valid) {
        return {
          valid,
          errors: validate.errors,
          errorText: ajv.errorsText(validate.errors),
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
