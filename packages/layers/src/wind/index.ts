import BaseLayer from '../core/BaseLayer';
import { IWindLayerStyleOptions } from '../core/interface';
import WindModels, { WindModelType } from './models';
export default class WindLayer extends BaseLayer<IWindLayerStyleOptions> {
  public type: string = 'WindLayer';

  public async buildModels() {
    const shape = this.getModelType();
    await this.initModel(new WindModels[shape](this));
  }
  public async rebuildModels() {
    await this.buildModels();
  }

  public renderModels() {
    if (this.layerModel) {
      this.layerModel.render(); // 独立的渲染流程
    }

    return this;
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
      wind: {},
    };
    return defaultConfig[type];
  }

  protected getModelType(): WindModelType {
    return 'wind';
  }
}
