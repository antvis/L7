import BaseLayer from '../core/BaseLayer';
import { ILineLayerStyleOptions } from '../core/interface';
import LineModels, { LineModelType } from './models';

export default class LineLayer extends BaseLayer<ILineLayerStyleOptions> {
  public type: string = 'LineLayer';

  public buildModels() {
    const shape = this.getModelType();
    this.layerModel = new LineModels[shape](this);
    this.layerModel.initModels((models) => {
      this.models = models;
      this.renderLayers();
    });
  }
  public rebuildModels() {
    this.layerModel.buildModels((models) => (this.models = models));
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
      greatcircle: { blend: 'additive' },
      vectorline: {},
      tileLine: {},
      halfLine: {},
      earthArc3d: {},
    };
    return defaultConfig[type];
  }
  protected getModelType(): LineModelType {
    if (this.layerType) {
      return this.layerType as LineModelType;
    }
    if (
      this.layerSource.parser.type === 'mvt' ||
      this.layerSource.parser.type === 'geojsonvt'
    ) {
      return 'vectorline';
    }
    const shapeAttribute = this.styleAttributeService.getLayerStyleAttribute(
      'shape',
    );
    const shape = shapeAttribute?.scale?.field as LineModelType;
    return shape || 'line';
  }
}
