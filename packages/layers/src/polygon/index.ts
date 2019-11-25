import { IEncodeFeature } from '@antv/l7-core';
import BaseLayer from '../core/BaseLayer';
import PolygonModels, { PolygonModelType } from './models/';

interface IPolygonLayerStyleOptions {
  opacity: number;
}

export default class PolygonLayer extends BaseLayer<IPolygonLayerStyleOptions> {
  public name: string = 'PolygonLayer';

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

  protected renderModels() {
    this.models.forEach((model) =>
      model.draw({
        uniforms: this.layerModel.getUninforms(),
      }),
    );
    return this;
  }

  protected buildModels() {
    const shape = this.getModelType();
    this.layerModel = new PolygonModels[shape](this);
    this.models = this.layerModel.buildModels();
  }

  private getModelType(): PolygonModelType {
    const shapeAttribute = this.styleAttributeService.getLayerStyleAttribute(
      'shape',
    );
    const shape = shapeAttribute?.scale?.field as PolygonModelType;
    return shape || 'fill';
  }
}
