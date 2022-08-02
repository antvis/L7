import BaseLayer from '../core/BaseLayer';
import { ICanvasLayerStyleOptions } from '../core/interface';
import CanvasModels, { CanvasModelType } from './models/index';
export default class CanvasLayer extends BaseLayer<ICanvasLayerStyleOptions> {
  public type: string = 'CanvasLayer';
  public buildModels() {
    const modelType = this.getModelType();
    this.layerModel = new CanvasModels[modelType](this);
    this.layerModel.initModels((models) => {
      this.models = models;
      this.renderLayers();
    });
  }
  public rebuildModels() {
    this.layerModel.buildModels((models) => (this.models = models));
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
      canvas: {},
    };
    return defaultConfig[type];
  }

  protected getModelType(): CanvasModelType {
    return 'canvas';
  }
}
