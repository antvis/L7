import BaseLayer from '../core/BaseLayer';
import { IImageLayerStyleOptions } from '../core/interface';
import ImageModels, { ImageModelType } from './models/index';
export default class ImageLayer extends BaseLayer<IImageLayerStyleOptions> {
  public type: string = 'ImageLayer';
  public buildModels() {
    const modelType = this.getModelType();
    this.layerModel = new ImageModels[modelType](this);
    this.layerModel.initModels((models) => {
      this.models = models;
      this.renderLayers();
    });
  }
  public rebuildModels() {
    this.layerModel.buildModels((models) => (this.models = models));
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
      image: {},
      dataImage: {},
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
    } else {
      return 'image';
    }
  }
}
