import type { ILegend } from '@antv/l7-core';
import BaseLayer from '../core/BaseLayer';
import type { IRasterLayerStyleOptions } from '../core/interface';
import { rampColor2legend } from '../utils/rampcolor_legend';
import type { RasterModelType } from './models/index';
import RasterModels from './models/index';

export default class RasterLayer extends BaseLayer<IRasterLayerStyleOptions> {
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
      case 'raster' || 'ndi':
        return 'raster';
      case 'rasterRgb':
        return 'rasterRgb';
      case 'rgb':
        return 'rasterRgb';
      case 'image':
        return 'rasterTerrainRgb';
      default:
        return 'raster';
    }
  }
  public getLegend(name: string): ILegend {
    if (name !== 'color')
      return {
        type: undefined,
        field: undefined,
        items: [],
      };
    const rampColors = this.getLayerConfig().rampColors;
    return rampColor2legend(rampColors, name);
  }
}
