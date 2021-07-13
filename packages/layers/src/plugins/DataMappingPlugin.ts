import {
  IEncodeFeature,
  IFontService,
  IGlobalConfigService,
  ILayer,
  ILayerPlugin,
  ILngLat,
  ILogService,
  IMapService,
  IParseDataItem,
  IStyleAttribute,
  IStyleAttributeService,
  TYPES,
} from '@antv/l7-core';
import { rgb2arr, unProjectFlat } from '@antv/l7-utils';
import { inject, injectable } from 'inversify';
import { cloneDeep } from 'lodash';

@injectable()
export default class DataMappingPlugin implements ILayerPlugin {
  @inject(TYPES.IGlobalConfigService)
  private readonly configService: IGlobalConfigService;

  @inject(TYPES.ILogService)
  private readonly logger: ILogService;

  @inject(TYPES.IMapService)
  private readonly mapService: IMapService;

  @inject(TYPES.IFontService)
  private readonly fontService: IFontService;

  public apply(
    layer: ILayer,
    {
      styleAttributeService,
    }: { styleAttributeService: IStyleAttributeService },
  ) {
    layer.hooks.init.tap('DataMappingPlugin', () => {
      // 初始化重新生成 map
      this.generateMaping(layer, { styleAttributeService });
    });

    layer.hooks.beforeRenderData.tap('DataMappingPlugin', () => {
      layer.dataState.dataMappingNeedUpdate = false;
      this.generateMaping(layer, { styleAttributeService });
      return true;
    });

    // remapping before render
    layer.hooks.beforeRender.tap('DataMappingPlugin', () => {
      if (layer.layerModelNeedUpdate) {
        return;
      }
      const attributes = styleAttributeService.getLayerStyleAttributes() || [];
      const filter = styleAttributeService.getLayerStyleAttribute('filter');
      const { dataArray } = layer.getSource().data;
      const attributesToRemapping = attributes.filter(
        (attribute) => attribute.needRemapping, // 如果filter变化
      );
      let filterData = dataArray;
      // 数据过滤完 再执行数据映射
      if (filter?.needRemapping && filter?.scale) {
        filterData = dataArray.filter((record: IParseDataItem) => {
          return this.applyAttributeMapping(filter, record)[0];
        });
      }
      if (attributesToRemapping.length) {
        // 过滤数据
        if (filter?.needRemapping) {
          layer.setEncodedData(this.mapping(attributes, filterData));
          filter.needRemapping = false;
        } else {
          layer.setEncodedData(
            this.mapping(
              attributesToRemapping,
              filterData,
              layer.getEncodedData(),
            ),
          );
        }
        this.logger.debug('remapping finished');
        // 处理文本更新
        layer.emit('remapping', null);
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
    // 数据过滤完 再执行数据映射
    if (filter?.scale) {
      filterData = dataArray.filter((record: IParseDataItem) => {
        return this.applyAttributeMapping(filter, record)[0];
      });
    }
    layer.setEncodedData(this.mapping(attributes, filterData));
  }

  private mapping(
    attributes: IStyleAttribute[],
    data: IParseDataItem[],
    predata?: IEncodeFeature[],
  ): IEncodeFeature[] {
    // console.log('data', data)
    const mappedData = data.map((record: IParseDataItem, i) => {
      const preRecord = predata ? predata[i] : {};
      const encodeRecord: IEncodeFeature = {
        id: record._id,
        coordinates: record.coordinates,
        ...preRecord,
      };
      // console.log('attributes', attributes)
      attributes
        .filter((attribute) => attribute.scale !== undefined)
        .forEach((attribute: IStyleAttribute) => {
          // console.log('attribute', attribute)
          // console.log('record', record)
          let values = this.applyAttributeMapping(attribute, record);
          // console.log('values', values)
          attribute.needRemapping = false;

          // TODO: 支持每个属性配置 postprocess
          if (attribute.name === 'color') {
            // console.log('attribute', attribute)
            values = values.map((c: unknown) => {
              return rgb2arr(c as string);
            });
          }
          // @ts-ignore
          encodeRecord[attribute.name] =
            Array.isArray(values) && values.length === 1 ? values[0] : values;

          // 增加对 layer/text/iconfont unicode 映射的解析
          if (attribute.name === 'shape') {
            encodeRecord.shape = this.fontService.getIconFontKey(
              encodeRecord[attribute.name] as string,
            );
          }
        });
      return encodeRecord;
    }) as IEncodeFeature[];
    // console.log('mappedData', mappedData)

    // 根据地图的类型判断是否需要对点位数据进行处理, 若是高德2.0则需要对坐标进行相对偏移
    if (mappedData.length > 0 && this.mapService.version === 'GAODE2.x') {
      if (typeof mappedData[0].coordinates[0] === 'number') {
        // 单个的点数据
        // @ts-ignore
        mappedData.map((d) => {
          d.version = 'GAODE2.x';
          // @ts-ignore
          d.originCoordinates = cloneDeep(d.coordinates); // 为了兼容高德1.x 需要保存一份原始的经纬度坐标数据（许多上层逻辑依赖经纬度数据）
          // @ts-ignore
          d.coordinates = this.mapService.lngLatToCoord(d.coordinates);
          // d.coordinates = this.mapService.lngLatToCoord(unProjectFlat(d.coordinates));
        });
      } else {
        // 连续的线、面数据
        // @ts-ignore
        mappedData.map((d) => {
          d.version = 'GAODE2.x';
          // @ts-ignore
          d.originCoordinates = cloneDeep(d.coordinates); // 为了兼容高德1.x 需要保存一份原始的经纬度坐标数据（许多上层逻辑依赖经纬度数据）
          // @ts-ignore
          d.coordinates = this.mapService.lngLatToCoords(d.coordinates);
        });
      }
    }
    // console.log('mappedData', mappedData)
    return mappedData;
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
    // console.log('params', params)
    // console.log('attribute', attribute)
    // console.log('mapping',attribute.mapping ? attribute.mapping(params) : [])
    return attribute.mapping ? attribute.mapping(params) : [];
  }
}
