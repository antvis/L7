import {
  IGlobalConfigService,
  ILayer,
  ILayerPlugin,
  ILayerStyleAttribute,
  IParseDataItem,
  IStyleScale,
  lazyInject,
  StyleScaleType,
  TYPES,
} from '@l7/core';
import { isString } from 'lodash';
import ScaleController from '../core/ScaleController';
import { rgb2arr } from '../utils/color';

export default class DataEncodePlugin implements ILayerPlugin {
  @lazyInject(TYPES.IGlobalConfigService)
  private readonly configService: IGlobalConfigService;

  private scaleController: ScaleController;

  private scaleCache: {
    [fieldName: string]: IStyleScale;
  } = {};

  public apply(layer: ILayer) {
    layer.hooks.init.tap('DataEncodePlugin', () => {
      const source = layer.getSource();
      const dataArray = source && source.data && source.data.dataArray;
      if (!dataArray) {
        return;
      }

      this.scaleController = new ScaleController(
        this.configService.getConfig().scales || {},
      );

      // create scales by source data & config
      Object.keys(layer.styleAttributes).forEach((attributeName) => {
        const attribute = layer.styleAttributes[attributeName];
        const scales: any[] = [];
        attribute.names.forEach((field: string) => {
          scales.push(this.getOrCreateScale(attribute, field, dataArray));
        });
        attribute.setScales(scales);
      });
      // mapping with source data
      layer.setEncodedData(this.mapping(layer.styleAttributes, dataArray));
    });

    // TODO: remapping before render
    // layer.hooks.beforeRender.tap()
  }

  private getOrCreateScale(
    attribute: ILayerStyleAttribute,
    field: string,
    data: any[],
  ): IStyleScale {
    let scale = this.scaleCache[field as string];
    if (!scale) {
      scale = this.scaleController.createScale(field as string, data);
      if (scale.type === StyleScaleType.VARIABLE) {
        scale.scale.range(attribute.values);
      }
      this.scaleCache[field as string] = scale;
    }
    return {
      ...scale,
      scale: scale.scale.copy(), // 存在相同字段映射不同通道的情况
    };
  }
  private mapping(
    attributes: {
      [attributeName: string]: ILayerStyleAttribute;
    },
    data: IParseDataItem[],
  ): Array<{ [key: string]: unknown }> {
    return data.map((record: IParseDataItem) => {
      const encodeRecord: { [key: string]: unknown } = {
        id: record._id,
        coordinates: record.coordinates,
      };
      // TODO: 数据过滤
      Object.keys(attributes).forEach((attributeName: string) => {
        const attribute = attributes[attributeName];
        // const { type } = attribute; // TODO: 支持常量 或变量
        // if (type === StyleScaleType.CONSTANT) {
        //   return;
        // }
        let values = this.getAttrValue(attribute, record);
        if (attributeName === 'color') {
          values = values.map((c: unknown) => {
            return rgb2arr(c as string);
          });
        }
        encodeRecord[attributeName] =
          Array.isArray(values) && values.length === 1 ? values[0] : values;
      });
      return encodeRecord;
    });
  }

  private getAttrValue(
    attribute: ILayerStyleAttribute,
    record: { [key: string]: unknown },
  ) {
    const scales = attribute.scales || [];
    const params: unknown[] = [];

    scales.forEach((scale) => {
      const { field, type } = scale;
      if (type === StyleScaleType.CONSTANT) {
        params.push(scale.field);
      } else {
        params.push(record[field]);
      }
    });

    return attribute.mapping ? attribute.mapping(...params) : [];
  }
}
