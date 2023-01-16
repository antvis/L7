import BaseLayer from '../core/BaseLayer';
import { IPointLayerStyleOptions } from '../core/interface';
import {
  TYPES,
  IRendererService,
} from '@antv/l7-core';


export default class PointLayer extends BaseLayer<IPointLayerStyleOptions> {
  public type: string = 'PointLayer';

  public async buildModels() {
    this.rendererService =  this.getContainer().get<IRendererService>(TYPES.IRendererService);
    const { createModel } = this.rendererService;
    const model = createModel();

    this.models = [model];
  }
}
