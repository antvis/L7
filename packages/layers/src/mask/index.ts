import BaseLayer from '../core/BaseLayer';
import type { IMaskLayerStyleOptions } from '../core/interface';

import type { MaskModelType } from './models';
import MaskModels from './models';
export default class MaskLayer extends BaseLayer<IMaskLayerStyleOptions> {
  public type: string = 'MaskLayer';
  public declare defaultSourceConfig: {
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
