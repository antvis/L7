import BaseLayer from '../core/BaseLayer';
import { ILineLayerStyleOptions } from '../core/interface';
import LineModels, { LineModelType } from './models';

export default class LineLayer extends BaseLayer<ILineLayerStyleOptions> {
  public type: string = 'LineLayer';

  private animateStartTime: number = 0;

  protected getConfigSchema() {
    return {
      properties: {
        opacity: {
          type: 'number',
          minimum: 0,
          maximum: 1,
        },
      },
    };
  }
  protected getDefaultConfig() {
    const type = this.getModelType();
    const defaultConfig = {
      line: {},
      arc3d: { blend: 'additive' },
      arc: { blend: 'additive' },
      greatcircle: { blend: 'additive' },
    };
    return defaultConfig[type];
  }
  protected renderModels() {
    this.models.forEach((model) =>
      model.draw({
        uniforms: this.layerModel.getUninforms(),
      }),
    );
    return this;
  }

  protected buildModels() {
    const shape = this.getModelType();
    this.layerModel = new LineModels[shape](this);
    this.models = this.layerModel.buildModels();
  }
  protected getModelType(): LineModelType {
    const shapeAttribute = this.styleAttributeService.getLayerStyleAttribute(
      'shape',
    );
    const shape = shapeAttribute?.scale?.field as LineModelType;
    return shape || 'line';
  }
  // 拆分的动画插件
  private initAnimate() {
    const { enable } = this.animateOptions;
    if (enable) {
      this.layerService.startAnimate();
      this.animateStartTime = this.layerService.clock.getElapsedTime();
    }
  }
}
