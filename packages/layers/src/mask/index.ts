import BaseLayer from '../core/BaseLayer';
import { IMaskLayerStyleOptions } from '../core/interface';
import MaskModels, { MaskModelType } from './models';

export default class MaskLayer extends BaseLayer<IMaskLayerStyleOptions> {
  public type: string = 'MaskLayer';
  public defaultSourceConfig: {
    data: [],
    options: {
      parser: {
        type: 'geojson',        
      },
    },
  }
  public buildModels() {
    const shape = this.getModelType();
    this.layerModel = new MaskModels[shape](this);
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

  protected getModelType(): MaskModelType {
    return 'fill';
  }
}
