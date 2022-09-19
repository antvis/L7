import BaseLayer from '../core/BaseLayer';
import { IWindLayerStyleOptions } from '../core/interface';
import WindModels, { WindModelType } from './models';
export default class WindLayer extends BaseLayer<IWindLayerStyleOptions> {
  public type: string = 'WindLayer';
  public buildModels() {
    const modelType = this.getModelType();
    this.layerModel = new WindModels[modelType](this);
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
