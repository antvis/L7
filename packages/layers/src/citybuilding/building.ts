import BaseLayer from '../core/BaseLayer';
import CityBuildModel from './models/build';

export default class CityBuildingLayer extends BaseLayer {
  public type: string = 'CityBuildingLayer';
  public async buildModels() {
    this.layerModel = new CityBuildModel(this);
    await this.initLayerModels();
  }

  public setLight(t: number) {
    this.updateLayerConfig({
      time: t,
    });
  }

  public getModelType(): string {
    return 'citybuilding';
  }
}
