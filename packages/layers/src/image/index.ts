import BaseLayer from '../core/BaseLayer';
import ImageModels, { ImageModelType } from './models/index';
interface IImageLayerStyleOptions {
  opacity: number;
}
export default class ImageLayer extends BaseLayer<IImageLayerStyleOptions> {
  public type: string = 'ImageLayer';
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
      image: {},
    };
    return defaultConfig[type];
  }
  protected buildModels() {
    const modelType = this.getModelType();
    this.layerModel = new ImageModels[modelType](this);
    this.models = this.layerModel.buildModels();
  }

  protected getModelType(): ImageModelType {
    return 'image';
  }
}
