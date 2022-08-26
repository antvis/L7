import BaseLayer from '../core/BaseLayer';
import { IBaseLayerStyleOptions } from '../core/interface';
import TileModel from './models/tileModel';

export default class TileTestLayer extends BaseLayer<IBaseLayerStyleOptions> {
  public type: string = 'TileTestLayer';
  public buildModels() {
    this.layerModel = new TileModel(this);
    this.layerModel.initModels((models) => {
      this.models = models;
      this.renderLayers();
    });
  }
}
