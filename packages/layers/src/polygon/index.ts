import type { IEncodeFeature } from '@antv/l7-core';
import BaseLayer from '../core/BaseLayer';
import type { IPolygonLayerStyleOptions } from '../core/interface';
import type { PolygonModelType } from './models/';
import PolygonModels from './models/';

export default class PolygonLayer extends BaseLayer<IPolygonLayerStyleOptions> {
  public type: string = 'PolygonLayer';
  public enableShaderEncodeStyles = [
    'opacity',
    'extrusionBase',
    // shape 为文本时
    'rotation',
    'offsets',
    'stroke',
  ];
  public declare defaultSourceConfig: {
    data: [];
    options: {
      parser: {
        type: 'geojson';
      };
    };
  };
  public async buildModels() {
    const shape = this.getModelType();
    this.layerModel = new PolygonModels[shape](this);
    await this.initLayerModels();
  }

  public getModelType(): PolygonModelType {
    const shapeAttribute = this.styleAttributeService.getLayerStyleAttribute('shape');
    const shape = shapeAttribute?.scale?.field as PolygonModelType;
    if (shape === 'fill' || !shape) {
      return 'fill';
    } else if (shape === 'extrude') {
      return 'extrude';
    } else if (shape === 'extrusion') {
      return 'extrusion';
    } else if (shape === 'water') {
      return 'water';
    } else if (shape === 'ocean') {
      return 'ocean';
    } else if (shape === 'line') {
      return 'line';
    } else {
      return this.getPointModelType();
    }
  }
  protected getPointModelType(): PolygonModelType {
    // pointlayer
    //  2D、 3d、 shape、image、text、normal、
    const layerData = this.getEncodedData();
    const { shape2d, shape3d } = this.getLayerConfig();
    const iconMap = this.iconService.getIconMap();
    const item = layerData.find((fe: IEncodeFeature) => {
      return fe.hasOwnProperty('shape');
    });
    if (!item) {
      return 'fill';
    } else {
      const shape = item.shape;
      if (shape === 'dot') {
        return 'point_normal';
      }
      if (shape2d?.indexOf(shape as string) !== -1) {
        return 'point_fill';
      }
      if (shape3d?.indexOf(shape as string) !== -1) {
        return 'point_extrude';
      }
      if (iconMap.hasOwnProperty(shape as string)) {
        return 'point_image';
      }
      return 'text';
    }
  }
}
