import { IEncodeFeature } from '@antv/l7-core';
import BaseLayer from '../core/BaseLayer';
import CityBuildModel from './models/build';

export default class CityBuildingLayer extends BaseLayer {
  public type: string = 'PolygonLayer';

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
    this.layerModel = new CityBuildModel(this);
    this.models = this.layerModel.buildModels();
  }

  protected getModelType(): string {
    return 'citybuilding';
  }
}
