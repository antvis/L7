import BaseLayer from '../core/BaseLayer';
import { IGeometryLayerStyleOptions } from '../core/interface';
import GeometryModels, { GeometryModelType } from './models';

export default class GeometryLayer extends BaseLayer<
  IGeometryLayerStyleOptions
> {
  public type: string = 'GeometryLayer';
  public buildModels() {
    const modelType = this.getModelType();
    this.layerModel = new GeometryModels[modelType](this);
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
      plane: {},
    };
    return defaultConfig[type];
  }

  protected getModelType(): GeometryModelType {
    return 'plane';
  }
}
