import {
  IGlobalConfigService,
  ILayer,
  ILayerPlugin,
  ILayerStyleAttribute,
  IParseDataItem,
  lazyInject,
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
    [fieldName: string]: {
      field: string;
      scale: any;
    };
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
        const fields = this.parseFields(attribute.field || '');
        const scales: any[] = [];
        fields.forEach((field: string) => {
          scales.push(this.getOrCreateScale(attribute, dataArray));
        });
        attribute.scales = scales;
      });

      // mapping with source data
      layer.setEncodedData(this.mapping(layer.styleAttributes, dataArray));
    });

    // TODO: remapping before render
    // layer.hooks.beforeRender.tap()
  }

  private getOrCreateScale(attribute: ILayerStyleAttribute, data: any[]) {
    const { field } = attribute;
    let scale = this.scaleCache[field as string];
    if (!scale) {
      scale = this.scaleController.createScale(field as string, data);
      scale.scale.range(attribute.values);
      this.scaleCache[field as string] = scale;
    }
    // scale: scale.scale.copy(),
    return this.scaleCache[field as string];
  }

  /**
   * @example
   * 'w*h' => ['w', 'h']
   * 'w' => ['w']
   */
  private parseFields(field: string[] | string): string[] {
    if (Array.isArray(field)) {
      return field;
    }
    if (isString(field)) {
      return field.split('*');
    }
    return [field];
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
      // TODO 数据过滤
      Object.keys(attributes).forEach((attributeName: string) => {
        const attribute = attributes[attributeName];
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

    scales.forEach(({ field }) => {
      if (record[field]) {
        params.push(record[field]);
      }
    });

    return attribute.mapping ? attribute.mapping(...params) : [];
  }
}
