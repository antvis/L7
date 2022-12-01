import BaseLayer from '../core/BaseLayer';
import { IPointLayerStyleOptions } from '../core/interface';
import FillModel from './models/fill';

export default class PointLayer extends BaseLayer<IPointLayerStyleOptions> {
  public type: string = 'PointLayer';

  public async buildModels() {
    const model = new FillModel(this);
    this.models = model.initModels();
  }
}
