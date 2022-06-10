import { IEncodeFeature } from '@antv/l7-core';
import BaseLayer from '../../core/BaseLayer';
import {
  ILineLayerStyleOptions,
  IPointLayerStyleOptions,
  IPolygonLayerStyleOptions,
} from '../../core/interface';
import lineFillModel from '../../line/models/tile';
import pointTextModel from '../../point/models/text';
import pointFillModel from '../../point/models/tile';
import polygonFillModel from '../../polygon/models/tile';

export default class VectorLayer extends BaseLayer<
  Partial<
    IPolygonLayerStyleOptions & ILineLayerStyleOptions & IPointLayerStyleOptions
  >
> {
  public isVector: boolean = true;
  public type: string = this.layerType as string;
  // Tip: 单独被 tile 瓦片的渲染链路使用（用于优化性能）
  private pickedID: number | null = null;

  public getPickID() {
    return this.pickedID;
  }

  public setPickID() {
    return this.pickedID;
  }

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
        return this.getPointModel();
      default:
        return pointFillModel;
    }
  }

  protected getPointModel() {
    const layerData = this.getEncodedData();
    const { shape2d } = this.getLayerConfig();
    const item = layerData.find((fe: IEncodeFeature) => {
      return fe.hasOwnProperty('shape');
    });
    // only support pointFill & pointText now
    if (item) {
      const shape = item.shape;
      if (shape2d?.indexOf(shape as string) !== -1) {
        return pointFillModel;
      } else {
        return pointTextModel;
      }
    } else {
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
