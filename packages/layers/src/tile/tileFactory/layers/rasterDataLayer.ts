import BaseLayer from '../../../core/BaseLayer';
import { IRasterLayerStyleOptions } from '../../../core/interface';
import RasterModel from '../../../raster/models/rasterTile';
import RasterRgbModel from '../../../raster/models/rasterRgb';

export default class RasterTiffLayer extends BaseLayer<
  Partial<IRasterLayerStyleOptions>
> {
  public type: string = this.layerType as string;
  public async buildModels() {
    const model = this.getModelType();
    this.layerModel = new model(this);
    await this.initLayerModels();
  }

  protected getModelType() {
    if(this.layerSource.parser.type === 'rasterRgb') {
      return RasterRgbModel;
    } else {
      return RasterModel;
    }
  }

  protected getDefaultConfig() {
    return {};
  }
}
