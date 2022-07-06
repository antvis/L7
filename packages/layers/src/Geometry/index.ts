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
      sprite: {},
      billboard: {},
    };
    return defaultConfig[type];
  }

  protected getModelType(): GeometryModelType {
    const shapeAttribute = this.styleAttributeService.getLayerStyleAttribute(
      'shape',
    );
    const shape = shapeAttribute?.scale?.field as GeometryModelType;
    if (shape === 'plane') {
      return 'plane';
    } else if (shape === 'sprite') {
      return 'sprite';
    } else if (shape === 'billboard') {
      return 'billboard';
    } else {
      return 'plane';
    }
  }
}
