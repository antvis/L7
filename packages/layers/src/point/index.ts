import { IEncodeFeature } from '@antv/l7-core';
import BaseLayer from '../core/BaseLayer';
import PointModels, { PointType } from './models/index';
interface IPointLayerStyleOptions {
  opacity: number;
  strokeWidth: number;
  strokeColor: string;
}
export default class PointLayer extends BaseLayer<IPointLayerStyleOptions> {
  public type: string = 'PointLayer';
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
  protected renderModels() {
    if (this.layerModelNeedUpdate) {
      this.models = this.layerModel.buildModels();
      this.layerModelNeedUpdate = false;
    }
    this.models.forEach((model) => {
      model.draw({
        uniforms: this.layerModel.getUninforms(),
      });
    });
    return this;
  }

  protected buildModels() {
    const modelType = this.getModelType();
    this.layerModel = new PointModels[modelType](this);
    this.models = this.layerModel.buildModels();
  }

  private getModelType(): PointType {
    // pointlayer
    //  2D、 3d、 shape、image、text、normal、
    const layerData = this.getEncodedData();
    const { shape2d, shape3d } = this.getLayerConfig();
    const iconMap = this.iconService.getIconMap();
    const item = layerData.find((fe: IEncodeFeature) => {
      return fe.hasOwnProperty('shape');
    });
    if (!item) {
      return 'normal';
    } else {
      const shape = item.shape;
      if (shape === 'dot') {
        return 'normal';
      }
      if (shape2d?.indexOf(shape as string) !== -1) {
        return 'fill';
      }
      if (shape3d?.indexOf(shape as string) !== -1) {
        return 'extrude';
      }
      if (iconMap.hasOwnProperty(shape as string)) {
        return 'image';
      }
      return 'text';
    }
  }

  private updateData() {
    // const bounds = this.mapService.getBounds();
    // console.log(bounds);
  }
}
