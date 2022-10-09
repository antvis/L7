import BaseLayer from '../core/BaseLayer';
import { IBaseLayerStyleOptions } from '../core/interface';
import TileModel from './models/tileModel';

export default class TileDebugLayer extends BaseLayer<IBaseLayerStyleOptions> {
  public type: string = 'TileDebugLayer';
  public defaultSourceConfig = {
    data: [],
    options: {
      parser: {
        type: 'testTile',
        cancelExtent: true,
      },
    },
  };
  public buildModels() {
    this.layerModel = new TileModel(this);
    this.layerModel.initModels((models) => {
      this.dispatchModelLoad(models);
    });
  }
}
