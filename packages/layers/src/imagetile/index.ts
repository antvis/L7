import LayerGroup from '../core/LayerGroup';
import ImageTileModels, { ImageTileModelType } from './models/index';

export default class ImageTileLayer extends LayerGroup<ITileLayerStyleOptions> {
  public type: string = 'ImageTileLayer';

  public buildModels() {
    const modelType = this.getModelType();
    this.layerModel = new ImageTileModels[modelType](this);
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
      imageTile: {},
    };
    return defaultConfig[type];
  }

  protected getModelType(): ImageTileModelType {
    return 'imageTile';
  }
}
