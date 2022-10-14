import BaseLayer from '../core/BaseLayer';
import { IRasterLayerStyleOptions } from '../core/interface';
import RasterModels, { RasterModelType } from './models/index';
export default class RaterLayer extends BaseLayer<IRasterLayerStyleOptions> {
  public type: string = 'RasterLayer';
  public buildModels() {
    const modelType = this.getModelType();
    this.layerModel = new RasterModels[modelType](this);
    this.layerModel.initModels((models) => {
      this.dispatchModelLoad(models);
    });
  }
  public rebuildModels() {
    this.layerModel.buildModels((models) => {
      this.dispatchModelLoad(models);
    });
  }

  protected getDefaultConfig() {
    const type = this.getModelType();
    const defaultConfig = {
      raster: {},
      rasterRgb: {},
      raster3d: {},
      rasterTile: {},
    };
    return defaultConfig[type];
  }

  protected getModelType(): RasterModelType {
    // 根据 source 的类型判断 model type
    const parserType = this.layerSource.getParserType();
    switch (parserType) {
      case 'raster':
        return 'raster';
      case 'rasterRgb':
        return 'rasterRgb';
      case 'rasterTile':
        return 'rasterTile';
      default:
        return 'raster';
    }
  }
}
