import BaseLayer from '../core/BaseLayer';
import type { IImageLayerStyleOptions } from '../core/interface';
import type { ImageModelType } from './models/index';
import ImageModels from './models/index';
export default class ImageLayer extends BaseLayer<IImageLayerStyleOptions> {
  public type: string = 'ImageLayer';
  public async buildModels() {
    const modelType = this.getModelType();
    this.layerModel = new ImageModels[modelType](this);
    await this.initLayerModels();
  }

  protected getDefaultConfig() {
    const type = this.getModelType();
    const defaultConfig = {
      image: {},
    };
    return defaultConfig[type];
  }

  public getModelType(): ImageModelType {
    return 'image';
  }
}
