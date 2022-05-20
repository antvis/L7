import BaseLayer from '../../core/BaseLayer';
import {
  ILineLayerStyleOptions,
  IPointLayerStyleOptions,
  IPolygonLayerStyleOptions,
} from '../../core/interface';
import lineFillModel from '../../line/models/tile';
import pointFillModel from '../../point/models/tile';
import polygonFillModel from '../../polygon/models/tile';

export default class VectorLayer extends BaseLayer<
  Partial<
    IPolygonLayerStyleOptions & ILineLayerStyleOptions & IPointLayerStyleOptions
  >
> {
  public type: string = this.layerType as string;
  public buildModels() {
    const model = this.getModelType();
    this.layerModel = new model(this);
    this.models = this.layerModel.initModels();
  }

  public rebuildModels() {
    this.models = this.layerModel.buildModels();
  }

  protected getModelType() {
    switch (this.layerType) {
      case 'PolygonLayer':
        return polygonFillModel;
      case 'LineLayer':
        return lineFillModel;
      case 'PointLayer':
        return pointFillModel;
      default:
        return pointFillModel;
    }
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
    return {};
  }
}
