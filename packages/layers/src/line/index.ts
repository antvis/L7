import type { IParseDataItem } from '@antv/l7-core';
import BaseLayer from '../core/BaseLayer';
import type { ILineLayerStyleOptions } from '../core/interface';
import type { LineModelType } from './models';
import LineModels from './models';

export default class LineLayer extends BaseLayer<ILineLayerStyleOptions> {
  public type: string = 'LineLayer';
  public enableShaderEncodeStyles = ['stroke', 'offsets', 'opacity', 'thetaOffset']; //注意顺序 4+2+1+1
  public arrowInsertCount: number = 0;
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

  public async buildModels() {
    const shape = this.getModelType();
    this.layerModel = new LineModels[shape](this);
    await this.initLayerModels();
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
      tileLine: {},
      earthArc3d: {},
      flowline: {},
      arrow: {},
    };
    return defaultConfig[type];
  }
  public getModelType(): LineModelType {
    if (this.layerType) {
      return this.layerType as LineModelType;
    }

    const shapeAttribute = this.styleAttributeService.getLayerStyleAttribute('shape');
    const shape = shapeAttribute?.scale?.field as LineModelType;
    return shape || 'line';
  }

  public processData(filterData: IParseDataItem[]) {
    // simple line 在接受 multiPolygon 的数据进行绘制的时候需要对数据进行拆解
    if (this.getModelType() !== 'simple') {
      return filterData;
    }
    const dataArray: IParseDataItem[] = [];
    filterData.map((data) => {
      if (
        Array.isArray(data.coordinates) &&
        Array.isArray(data.coordinates[0]) &&
        Array.isArray(data.coordinates[0][0])
      ) {
        const object = { ...data };
        data.coordinates.map((d) => {
          dataArray.push({
            ...object,
            coordinates: d,
          });
        });
      } else {
        dataArray.push(data);
      }
    });
    return dataArray;
  }
}
