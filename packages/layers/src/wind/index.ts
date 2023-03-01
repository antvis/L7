import { IRenderOptions } from '@antv/l7-core';
import BaseLayer from '../core/BaseLayer';
import { IWindLayerStyleOptions } from '../core/interface';
import WindModels, { WindModelType } from './models';
export default class WindLayer extends BaseLayer<IWindLayerStyleOptions> {
  public type: string = 'WindLayer';
  public async buildModels() {
    const modelType = this.getModelType();
    this.layerModel = new WindModels[modelType](this);
    await this.initLayerModels();
  }

  public renderModels(options: Partial<IRenderOptions> = {}) {
    if (this.layerModel) {
      this.layerModel.render(options); // 独立的渲染流程
    }

    return this;
  }

  protected getDefaultConfig() {
    const type = this.getModelType();
    const defaultConfig = {
      wind: {},
    };
    return defaultConfig[type];
  }

  public getModelType(): WindModelType {
    return 'wind';
  }
}
