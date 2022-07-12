import BaseLayer from '../core/BaseLayer';
import { ILineLayerStyleOptions } from '../core/interface';
import LineModels, { LineModelType } from './models';

export default class LineLayer extends BaseLayer<ILineLayerStyleOptions> {
  public type: string = 'LineLayer';

  public buildModels() {
    const shape = this.getModelType();
    this.layerModel = new LineModels[shape](this);
    this.models = this.layerModel.initModels();
  }
  public rebuildModels() {
    this.models = this.layerModel.buildModels();
  }

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
      linearline: {},
      simple: {},
      wall: {},
      arc3d: { blend: 'additive' },
      arc: { blend: 'additive' },
      arcmini: { blend: 'additive' },
      greatcircle: { blend: 'additive' },
      vectorline: {},
      tileLine: {},
      halfLine: {},
    };
    return defaultConfig[type];
  }
  protected getModelType(): LineModelType {
    if (this.layerSource.parser.type === 'mvt') {
      return 'vectorline';
    }
    const shapeAttribute = this.styleAttributeService.getLayerStyleAttribute(
      'shape',
    );
    const shape = shapeAttribute?.scale?.field as LineModelType;
    return shape || 'line';
  }
}
