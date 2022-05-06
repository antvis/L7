import BaseLayer from '../core/BaseLayer';
import { IMaskLayerStyleOptions } from '../core/interface';
import MaskModels, { MaskModelType } from './models';

export default class MaskLayer extends BaseLayer<IMaskLayerStyleOptions> {
  public type: string = 'MaskLayer';
  public buildModels() {
    const shape = this.getModelType();
    this.layerModel = new MaskModels[shape](this);
    this.models = this.layerModel.initModels();
  }
  public rebuildModels() {
    this.models = this.layerModel.buildModels();
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

  protected getModelType(): MaskModelType {
    return 'fill';
  }
}
