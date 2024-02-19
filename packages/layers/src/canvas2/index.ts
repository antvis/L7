// import type { ILayerConfig } from '@antv/l7-core';
import BaseLayer from '../core/BaseLayer';
import type { ICanvasLayer2Options } from '../core/interface';
import type { CanvasModelType } from './models';
import { CanvasModel } from './models';

export default class CanvasLayer2 extends BaseLayer<ICanvasLayer2Options> {
  public type: string = 'CanvasLayer';

  protected getDefaultConfig(): Partial<ICanvasLayer2Options> {
    return {
      zIndex: 0,
      contextType: 'canvas2d',
      trigger: 'change',
    };
  }

  public async buildModels() {
    this.layerModel = new CanvasModel(this);
    await this.initLayerModels();
  }

  public getModelType(): CanvasModelType {
    return this.getLayerConfig().contextType || 'canvas2d';
  }

  public getLayerConfig() {
    return {
      ...super.getLayerConfig(),
      ...this.getDefaultConfig(),
    } as any;
  }

  // public destroy() {
  //   super.destroy();
  //   this.layerModel.clearModels();
  // }
}
