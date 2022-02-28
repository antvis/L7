import { IEncodeFeature } from '@antv/l7-core';
import BaseLayer from '../core/BaseLayer';
import { IPointLayerStyleOptions } from '../core/interface';
import PointModels, { PointType } from './models/index';

export default class PointLayer extends BaseLayer<IPointLayerStyleOptions> {
  public type: string = 'PointLayer';
  public buildModels() {
    const modelType = this.getModelType();
    this.layerModel = new PointModels[modelType](this);
    this.models = this.layerModel.initModels();
  }
  public rebuildModels() {
    this.models = this.layerModel.buildModels();
  }

  /**
   * 在未传入数据的时候判断点图层的 shape 类型
   * @returns
   */
  public getModelTypeWillEmptyData(): PointType {
    if (this.shapeOption) {
      const { field, values } = this.shapeOption;
      const { shape2d, shape3d } = this.getLayerConfig();

      const iconMap = this.iconService.getIconMap();

      if (field && shape2d?.indexOf(field as string) !== -1) {
        return 'fill';
      }

      if (values) {
        for (const v of values) {
          if (iconMap.hasOwnProperty(values as string)) {
            return 'image';
          }
        }
      }
    }
    return 'normal';
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
      normal: {
        blend: 'additive',
      },
      simplePoint: {},
      fill: { blend: 'normal' },
      extrude: {},
      image: {},
      icon: {},
      text: {
        blend: 'normal',
      },
    };
    return defaultConfig[type];
  }

  protected getModelType(): PointType {
    // pointlayer
    //  2D、 3d、 shape、image、text、normal、
    const layerData = this.getEncodedData();
    const { shape2d, shape3d } = this.getLayerConfig();
    const iconMap = this.iconService.getIconMap();
    const item = layerData.find((fe: IEncodeFeature) => {
      return fe.hasOwnProperty('shape');
    });
    if (!item) {
      // return 'normal';
      return this.getModelTypeWillEmptyData();
    } else {
      const shape = item.shape;
      if (shape === 'dot') {
        return 'normal';
      }
      if (shape === 'simple') {
        return 'simplePoint';
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
      if (this.fontService.getGlyph(shape as string) !== '') {
        return 'icon';
      }
      return 'text';
    }
  }
}
