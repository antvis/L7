import BaseLayer from '../core/BaseLayer';
import CityBuildModel from './models/build';

export default class CityBuildingLayer extends BaseLayer {
  public type: string = 'CityBuildingLayer';
  public buildModels() {
    this.layerModel = new CityBuildModel(this);
    this.layerModel.initModels((models) => {
      this.models = models;
      this.emit('modelLoaded', null);
      this.layerService.throttleRenderLayers();
    });
  }
  public rebuildModels() {
    this.layerModel.buildModels((models) => {
      this.models = models;
      this.emit('modelLoaded', null);
    });
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
