import BaseLayer from '../../../core/BaseLayer';
import { IBaseLayerStyleOptions } from '../../../core/interface';

export default class TileDebugLayer extends BaseLayer<IBaseLayerStyleOptions> {
  public type: string = 'TileDebugLayer';
  public zIndex: number = 10000;
  public defaultSourceConfig = {
    data: [],
    options: {
      parser: {
        type: 'testTile',
      },
    },
  };
  public async buildModels() {
    return;
  }
}
