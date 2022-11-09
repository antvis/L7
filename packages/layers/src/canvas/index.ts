import { ILayer } from '@antv/l7-core';
import BaseLayer from '../core/BaseLayer';
import { ICanvasLayerStyleOptions } from '../core/interface';
import CanvasModels, { CanvasModelType } from './models/index';
export default class CanvasLayer extends BaseLayer<ICanvasLayerStyleOptions> {
  public type: string = 'CanvasLayer';
  public forceRender: boolean = true;
  public buildModels() {
    const modelType = this.getModelType();
    this.layerModel = new CanvasModels[modelType](this);
    this.layerModel.initModels((models) => {
      this.dispatchModelLoad(models);
    });
  }
  public rebuildModels() {
    this.layerModel.buildModels((models) => {
      this.dispatchModelLoad(models);
    });
  }

  public hide(): ILayer {
    // 清除画布
    if (this.layerModel.clearCanvas) {
      this.layerModel.clearCanvas();
    }

    this.updateLayerConfig({
      visible: false,
    });
    this.reRender();
    return this;
  }

  public renderModels() {
    if (this?.layerModel?.renderUpdate) {
      this.layerModel.renderUpdate();
    }

    this.models.forEach((model) => {
      model.draw(
        {
          uniforms: this.layerModel.getUninforms(),
        },
        false,
      );
    });
    return this;
  }

  protected getDefaultConfig() {
    const type = this.getModelType();
    const defaultConfig = {
      canvas: {},
    };
    return defaultConfig[type];
  }

  protected getModelType(): CanvasModelType {
    return 'canvas';
  }
}
