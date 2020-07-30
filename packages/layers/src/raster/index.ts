import { IColorRamp } from '@antv/l7-utils';
import BaseLayer from '../core/BaseLayer';
import RasterModels, { RasterModelType } from './models/index';
interface IRasterLayerStyleOptions {
  opacity: number;
  domain: [number, number];
  noDataValue: number;
  clampLow: boolean;
  clampHigh: boolean;
  rampColors: IColorRamp;
}
export default class RaterLayer extends BaseLayer<IRasterLayerStyleOptions> {
  public type: string = 'RasterLayer';
  public buildModels() {
    const modelType = this.getModelType();
    this.layerModel = new RasterModels[modelType](this);
    this.models = this.layerModel.initModels();
  }
  public rebuildModels() {
    this.models = this.layerModel.buildModels();
  }
  protected getConfigSchema() {
    return {
      properties: {
        opacity: {
          type: 'number',
          minimum: 0,
          maximum: 1,
        },
      },
    };
  }
  protected getDefaultConfig() {
    const type = this.getModelType();
    const defaultConfig = {
      raster: {},
      raster3d: {},
    };
    return defaultConfig[type];
  }

  protected getModelType(): RasterModelType {
    return 'raster';
  }
}
