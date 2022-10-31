import BaseLayer from '../core/BaseLayer';
import { IMaskLayerStyleOptions } from '../core/interface';

import MaskModels, { MaskModelType } from './models';
export default class MaskLayer extends BaseLayer<IMaskLayerStyleOptions> {
  public type: string = 'MaskLayer';
  public defaultSourceConfig: {
    data: [];
    options: {
      parser: {
        type: 'geojson';
      };
    };
  };

  public async buildModels() {
    const shape = this.getModelType();
    this.layerModel = new MaskModels[shape](this);
    await this.initLayerModels();
  }

  public getModelType(): MaskModelType {
    return 'fill';
  }
}
