// import type { ILayerConfig } from '@antv/l7-core';
import BaseLayer from '../core/BaseLayer';
import type { ICanvasLayerOptions } from '../core/interface';
import type { CanvasModelType } from './models';
import { CanvasModel } from './models';

export default class CanvasLayer extends BaseLayer<ICanvasLayerOptions> {
  public type: string = 'CanvasLayer';
  public declare layerModel: CanvasModel;

  protected getDefaultConfig(): Partial<ICanvasLayerOptions> {
    return {
      zIndex: 3,
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

  public draw(draw: ICanvasLayerOptions['draw']) {
    this.updateLayerConfig({
      draw,
    });
    this.render();
    return this;
  }

  public getLayerConfig() {
    const config = {
      ...this.getDefaultConfig(),
      ...super.getLayerConfig(),
    } as any;
    if (config.zIndex < 3) {
      config.zIndex = 3;
    }
    return config as any;
  }

  public render() {
    this.layerModel?.renderCanvas();
    return this;
  }

  public getCanvas() {
    return this.layerModel?.canvas;
  }

  public show() {
    const canvas = this.getCanvas();
    if (canvas) {
      canvas.style.display = 'unset';
    }
    return this;
  }

  public hide() {
    const canvas = this.getCanvas();
    if (canvas) {
      canvas.style.display = 'none';
    }
    return this;
  }

  public destroy() {
    this.layerModel.removeCanvas();
    super.destroy();
  }
}
