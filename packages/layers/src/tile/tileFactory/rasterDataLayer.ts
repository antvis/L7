import BaseLayer from '../../core/BaseLayer';
import { IRasterLayerStyleOptions } from '../../core/interface';
import RasterModel from '../../raster/models/raster';

export default class RasterTiffLayer extends BaseLayer<
  Partial<IRasterLayerStyleOptions>
> {
  public type: string = this.layerType as string;
  public async buildModels() {
    const model = this.getModelType();
    await this.initModel(new model(this))

  }
  public async rebuildModels() {
    await this.buildModels();
  }

  protected getModelType() {
    return RasterModel;
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
    return {};
  }
}
