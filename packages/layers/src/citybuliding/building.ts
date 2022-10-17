import BaseLayer from '../core/BaseLayer';
import CityBuildModel from './models/build';

export default class CityBuildingLayer extends BaseLayer {
  public type: string = 'CityBuildingLayer';
  public buildModels() {
    this.layerModel = new CityBuildModel(this);
    this.layerModel.initModels((models) => {
      this.dispatchModelLoad(models);
    });
  }
  public rebuildModels() {
    this.layerModel.buildModels((models) => {
      this.dispatchModelLoad(models);
    });
  }
  public setLight(t: number) {
    this.updateLayerConfig({
      time: t,
    });
  }

  protected getModelType(): string {
    return 'citybuilding';
  }
}
