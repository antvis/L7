import { IEncodeFeature } from '@antv/l7-core';
import BaseLayer from '../core/BaseLayer';
import CityBuildModel from './models/build';

export default class CityBuildingLayer extends BaseLayer {
  public type: string = 'PolygonLayer';
  public buildModels() {
    this.layerModel = new CityBuildModel(this);
    this.models = this.layerModel.initModels();
  }
  public rebuildModels() {
    this.models = this.layerModel.buildModels();
  }
  public setLight(t: number) {
    this.updateLayerConfig({
      time: t,
    });
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

  protected getModelType(): string {
    return 'citybuilding';
  }
}
