import BaseLayer from '../core/BaseLayer';
import { ILineLayerStyleOptions } from '../core/interface';
import LineModels, { LineModelType } from './models';
import { isVectorTile } from '../tile/utils';

export default class LineLayer extends BaseLayer<ILineLayerStyleOptions> {
  public type: string = 'LineLayer';
  public defaultSourceConfig = {
    data: [
      {
        lng1: 100,
        lat1: 30.0,
        lng2: 130,
        lat2: 30,
      },
    ],
    options: {
      parser: {
        type: 'json',
        x: 'lng1',
        y: 'lat1',
        x1: 'lng2',
        y1: 'lat2',
      },
    },
  };

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
    const parserType = this.layerSource.getParserType();
    if (isVectorTile(parserType)) {
      return 'vectorline';
    }

    const shapeAttribute = this.styleAttributeService.getLayerStyleAttribute(
      'shape',
    );
    const shape = shapeAttribute?.scale?.field as LineModelType;
    return shape || 'line';
  }
}
