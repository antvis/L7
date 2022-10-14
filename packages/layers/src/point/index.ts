import { IEncodeFeature } from '@antv/l7-core';
import BaseLayer from '../core/BaseLayer';
import { IPointLayerStyleOptions } from '../core/interface';
import PointModels, { PointType } from './models/index';
import { isVectorTile } from '../tile/utils';

export default class PointLayer extends BaseLayer<IPointLayerStyleOptions> {
  public type: string = 'PointLayer';
  public defaultSourceConfig = {
    data: [],
    options: {
      parser: {
        type: 'json',
        x: 'lng',
        y: 'lat',
      },
    },
  };

  public buildModels() {
    const modelType = this.getModelType();
    this.layerModel = new PointModels[modelType](this);
    this.layerModel.initModels((models) => {
      this.dispatchModelLoad(models);
    });
  }
  public rebuildModels() {
    this.layerModel.buildModels((models) => {
      this.dispatchModelLoad(models);
    });
  }

  /**
   * 在未传入数据的时候判断点图层的 shape 类型
   * @returns
   */
  public getModelTypeWillEmptyData(): PointType {
    if (this.shapeOption) {
      const { field, values } = this.shapeOption;
      const { shape2d } = this.getLayerConfig();

      const iconMap = this.iconService.getIconMap();

      if (field && shape2d?.indexOf(field as string) !== -1) {
        return 'fill';
      }

      if (values && values instanceof Array) {
        for (const v of values) {
          if (typeof v === 'string' && iconMap.hasOwnProperty(v as string)) {
            return 'image';
          }
        }
      }
    }
    return 'normal';
  }

  protected getDefaultConfig() {
    const type = this.getModelType();
    const defaultConfig = {
      fillImage: {},
      normal: {
        blend: 'additive',
      },
      radar: {},
      simplePoint: {},
      fill: { blend: 'normal' },
      extrude: {},
      image: {},
      text: {
        blend: 'normal',
      },
      vectorPoint: {},
      tile: {},
      tileText: {},
      earthFill: {},
      earthExtrude: {},
    };
    return defaultConfig[type];
  }

  protected getModelType(): PointType {
    const parserType = this.layerSource.getParserType();
    if (isVectorTile(parserType)) {
      return 'vectorPoint';
    }
    //  2D、 3d、 shape、image、text、normal、
    const layerData = this.getEncodedData();
    const { shape2d, shape3d } = this.getLayerConfig();
    const iconMap = this.iconService.getIconMap();
    const item = layerData.find((fe: IEncodeFeature) => {
      return fe.hasOwnProperty('shape');
    });

    if (!item) {
      return this.getModelTypeWillEmptyData();
    } else {
      const shape = item.shape;
      if (shape === 'dot') {
        return 'normal';
      }
      if (shape === 'simple') {
        return 'simplePoint';
      }
      if (shape === 'radar') {
        return 'radar';
      }
      if (this.layerType === 'fillImage') {
        return 'fillImage';
      }
      if (shape2d?.indexOf(shape as string) !== -1) {
        if (this.mapService.version === 'GLOBEL') {
          return 'earthFill';
        } else {
          return 'fill';
        }
      }
      if (shape3d?.indexOf(shape as string) !== -1) {
        if (this.mapService.version === 'GLOBEL') {
          return 'earthExtrude';
        } else {
          return 'extrude';
        }
      }
      if (iconMap.hasOwnProperty(shape as string)) {
        return 'image';
      }
      return 'text';
    }
  }
}
