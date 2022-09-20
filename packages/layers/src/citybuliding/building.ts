import BaseLayer from '../core/BaseLayer';
import CityBuildModel from './models/build';

export default class CityBuildingLayer extends BaseLayer {
  public type: string = 'CityBuildingLayer';

  public async buildModels() {
    await this.initModel(new CityBuildModel(this));
  }
  public async rebuildModels() {
    await this.buildModels();
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
