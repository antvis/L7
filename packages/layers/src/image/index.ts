import BaseLayer from '../core/BaseLayer';
import { IImageLayerStyleOptions } from '../core/interface';
import ImageModels, { ImageModelType } from './models/index';
export default class ImageLayer extends BaseLayer<IImageLayerStyleOptions> {
  public type: string = 'ImageLayer';
  public async buildModels() {
    const modelType = this.getModelType();
    await this.initModel(new ImageModels[modelType](this));
  }
  public async rebuildModels() {
    await this.buildModels();
  }
  protected getDefaultConfig() {
    const type = this.getModelType();
    const defaultConfig = {
      image: {},
      dataImage: {},
      tileDataImage: {},
    };
    return defaultConfig[type];
  }

  protected getModelType(): ImageModelType {
    const shapeAttribute = this.styleAttributeService.getLayerStyleAttribute(
      'shape',
    );
    const shape = shapeAttribute?.scale?.field as ImageModelType;
    if (shape === 'dataImage') {
      return 'dataImage';
    } else if (shape === 'image') {
      return 'image';
    } else if (shape === 'tileDataImage') {
      return 'tileDataImage';
    } else {
      return 'image';
    }
  }
}
