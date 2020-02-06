import {
  IEncodeFeature,
  IGlobalConfigService,
  ILayer,
  ILayerPlugin,
  ILogService,
  IParseDataItem,
  IStyleAttribute,
  IStyleAttributeService,
  TYPES,
} from '@antv/l7-core';
import { rgb2arr } from '@antv/l7-utils';
import { inject, injectable } from 'inversify';

@injectable()
export default class DataMappingPlugin implements ILayerPlugin {
  @inject(TYPES.IGlobalConfigService)
  private readonly configService: IGlobalConfigService;

  @inject(TYPES.ILogService)
  private readonly logger: ILogService;

  public apply(
    layer: ILayer,
    {
      styleAttributeService,
    }: { styleAttributeService: IStyleAttributeService },
  ) {
    layer.hooks.init.tap('DataMappingPlugin', () => {
      this.generateMaping(layer, { styleAttributeService });
    });

    layer.hooks.beforeRenderData.tap('DataMappingPlugin', (flag) => {
      if (flag || layer.dataState.dataMappingNeedUpdate) {
        layer.dataState.dataMappingNeedUpdate = false;
        this.generateMaping(layer, { styleAttributeService });
        return true;
      }
      return false;
    });

    // remapping before render
    layer.hooks.beforeRender.tap('DataMappingPlugin', () => {
      const attributes = styleAttributeService.getLayerStyleAttributes() || [];
      const { dataArray } = layer.getSource().data;
      const attributesToRemapping = attributes.filter(
        (attribute) => attribute.needRemapping,
      );
      if (attributesToRemapping.length) {
        layer.setEncodedData(this.mapping(attributesToRemapping, dataArray));
        this.logger.debug('remapping finished');
      }
    });
  }
  private generateMaping(
    layer: ILayer,
    {
      styleAttributeService,
    }: { styleAttributeService: IStyleAttributeService },
  ) {
    const attributes = styleAttributeService.getLayerStyleAttributes() || [];
    const filter = styleAttributeService.getLayerStyleAttribute('filter');
    const { dataArray } = layer.getSource().data;
    let filterData = dataArray;
    // 数据过滤完 在执行数据映射
    if (filter?.scale) {
      filterData = dataArray.filter((record: IParseDataItem) => {
        return this.applyAttributeMapping(filter, record)[0];
      });
    }

    // TODO: FIXME
    if (!filterData) {
      return;
    }
    // mapping with source data
    layer.setEncodedData(this.mapping(attributes, filterData));
  }

  private mapping(
    attributes: IStyleAttribute[],
    data: IParseDataItem[],
  ): IEncodeFeature[] {
    return data.map((record: IParseDataItem) => {
      const encodeRecord: IEncodeFeature = {
        id: record._id,
        coordinates: record.coordinates,
      };
      attributes
        .filter((attribute) => attribute.scale !== undefined)
        .forEach((attribute: IStyleAttribute) => {
          let values = this.applyAttributeMapping(attribute, record);
          attribute.needRemapping = false;

          // TODO: 支持每个属性配置 postprocess
          if (attribute.name === 'color') {
            values = values.map((c: unknown) => {
              return rgb2arr(c as string);
            });
          }
          // @ts-ignore
          encodeRecord[attribute.name] =
            Array.isArray(values) && values.length === 1 ? values[0] : values;
        });
      return encodeRecord;
    }) as IEncodeFeature[];
  }

  private applyAttributeMapping(
    attribute: IStyleAttribute,
    record: { [key: string]: unknown },
  ) {
    if (!attribute.scale) {
      return [];
    }
    const scalers = attribute?.scale?.scalers || [];
    const params: unknown[] = [];

    scalers.forEach(({ field }) => {
      if (
        record.hasOwnProperty(field) ||
        attribute.scale?.type === 'variable'
      ) {
        // TODO:多字段，常量
        params.push(record[field]);
      }
    });
    return attribute.mapping ? attribute.mapping(params) : [];
  }
}
