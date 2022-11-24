import BaseLayer from '../../../core/BaseLayer';
import { IRasterLayerStyleOptions } from '../../../core/interface';
import RasterModel from '../../../raster/models/rasterTile';
import RasterRgbModel from '../../../raster/models/rasterRgb';

export default class RasterTiffLayer extends BaseLayer<
  Partial<IRasterLayerStyleOptions>
> {
  public type: string = 'RasterLayer';
  public async buildModels() {
    const model = this.getModel();
    this.layerModel = new model(this);
    await this.initLayerModels();
  }

  public getModel() {
    const type = this.getModelType();
    return type === 'rasterRgb' ?  RasterRgbModel :RasterModel;
  }
  public  getModelType():string {
    return this.layerSource.parser.type === 'rasterRgb' ? 'rasterRgb' : 'raster'

  }

  protected getDefaultConfig() {
    return {};
  }
}