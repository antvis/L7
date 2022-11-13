import BaseLayer from '../core/BaseLayer';
import { IRasterLayerStyleOptions } from '../core/interface';
import RasterModels, { RasterModelType } from './models/index';
export default class RaterLayer extends BaseLayer<IRasterLayerStyleOptions> {
  public type: string = 'RasterLayer';
  public async buildModels() {
    const modelType = this.getModelType();
    this.layerModel = new RasterModels[modelType](this);
    await this.initLayerModels();
  }

  protected getDefaultConfig() {
    const type = this.getModelType();
    const defaultConfig = {
      raster: {},
      rasterRgb: {},
      raster3d: {},
      rasterTerrainRgb: {},
    };
    return defaultConfig[type];
  }

  public getModelType(): RasterModelType {
    // 根据 source 的类型判断 model type
    const parserType = this.layerSource.getParserType();
    switch (parserType) {
      case 'raster':
        return 'raster';
      case 'rasterRgb':
        return 'rasterRgb';
      case 'image':
        return 'rasterTerrainRgb';
      default:
        return 'raster';
    }
  }
}
