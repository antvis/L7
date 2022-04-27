import { IRasterTileLayerStyleOptions } from '../core/interface';
import LayerGroup from '../core/LayerGroup';
import RasterTileModel from './models/raste-tile';

export default class RasterTileLayer extends LayerGroup<
  IRasterTileLayerStyleOptions
> {
  public type: string = 'RasterTileLayer';

  public buildModels() {
    this.layerModel = new RasterTileModel(this);
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
    const defaultConfig = {};
    return defaultConfig;
  }

  protected getModelType() {
    return 'rasterTile';
  }
}
