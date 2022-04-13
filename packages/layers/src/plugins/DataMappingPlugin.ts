import {
  IEncodeFeature,
  IFontService,
  IGlobalConfigService,
  ILayer,
  ILayerPlugin,
  ILngLat,
  IMapService,
  IParseDataItem,
  IStyleAttribute,
  IStyleAttributeService,
  Position,
  TYPES,
} from '@antv/l7-core';
import { Version } from '@antv/l7-maps';
import { isColor, normalize, rgb2arr, unProjectFlat } from '@antv/l7-utils';
import { inject, injectable } from 'inversify';
import { cloneDeep } from 'lodash';
import 'reflect-metadata';
import { ILineLayerStyleOptions } from '../core/interface';

@injectable()
export default class DataMappingPlugin implements ILayerPlugin {
  @inject(TYPES.IGlobalConfigService)
  private readonly configService: IGlobalConfigService;

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
      const bottomColor = layer.getBottomColor();
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
          return this.applyAttributeMapping(filter, record, bottomColor)[0];
        });
      }

      if (attributesToRemapping.length) {
        // 过滤数据
        if (filter?.needRemapping) {
          layer.setEncodedData(
            this.mapping(attributes, filterData, undefined, bottomColor, layer),
          );
          filter.needRemapping = false;
        } else {
          layer.setEncodedData(
            this.mapping(
              attributesToRemapping,
              filterData,
              layer.getEncodedData(),
              bottomColor,
              layer,
            ),
          );
        }
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
    const bottomColor = layer.getBottomColor();
    const attributes = styleAttributeService.getLayerStyleAttributes() || [];
    const filter = styleAttributeService.getLayerStyleAttribute('filter');
    const { dataArray } = layer.getSource().data;
    let filterData = dataArray;
    // 数据过滤完 再执行数据映射
    if (filter?.scale) {
      filterData = dataArray.filter((record: IParseDataItem) => {
        return this.applyAttributeMapping(filter, record, bottomColor)[0];
      });
    }
    layer.setEncodedData(
      this.mapping(attributes, filterData, undefined, bottomColor, layer),
    );
    // 对外暴露事件
    layer.emit('dataUpdate', null);
  }

  private getArrowPoints(p1: Position, p2: Position) {
    const dir = [p2[0] - p1[0], p2[1] - p1[1]];
    const normalizeDir = normalize(dir);
    const arrowPoint = [
      p1[0] + normalizeDir[0] * 0.0001,
      p1[1] + normalizeDir[1] * 0.0001,
    ];
    return arrowPoint;
  }

  private mapping(
    attributes: IStyleAttribute[],
    data: IParseDataItem[],
    predata?: IEncodeFeature[],
    minimumColor?: string,
    layer?: ILayer,
  ): IEncodeFeature[] {
    const {
      arrow = {
        enable: false,
      },
    } = layer?.getLayerConfig() as ILineLayerStyleOptions;
    const mappedData = data.map((record: IParseDataItem, i) => {
      const preRecord = predata ? predata[i] : {};
      const encodeRecord: IEncodeFeature = {
        id: record._id,
        coordinates: record.coordinates,
        ...preRecord,
      };
      attributes
        .filter((attribute) => attribute.scale !== undefined)
        .forEach((attribute: IStyleAttribute) => {
          // console.log('record', record)
          let values = this.applyAttributeMapping(
            attribute,
            record,
            minimumColor,
          );
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

      if (encodeRecord.shape === 'line' && arrow.enable) {
        // 只有在线图层且支持配置箭头的时候进行插入顶点的处理
        const coords = encodeRecord.coordinates as Position[];
        const arrowPoint = this.getArrowPoints(coords[0], coords[1]);
        encodeRecord.coordinates.splice(1, 0, arrowPoint, arrowPoint);
      }
      return encodeRecord;
    }) as IEncodeFeature[];
    // console.log('mappedData', mappedData)

    // 调整数据兼容 Amap2.0
    this.adjustData2Amap2Coordinates(mappedData);

    // 调整数据兼容 SimpleCoordinates
    this.adjustData2SimpleCoordinates(mappedData);

    return mappedData;
  }

  private adjustData2Amap2Coordinates(mappedData: IEncodeFeature[]) {
    // 根据地图的类型判断是否需要对点位数据进行处理, 若是高德2.0则需要对坐标进行相对偏移
    if (
      mappedData.length > 0 &&
      this.mapService.version === Version['GAODE2.x']
    ) {
      if (typeof mappedData[0].coordinates[0] === 'number') {
        // 单个的点数据
        // @ts-ignore
        mappedData
          // TODO: 避免经纬度被重复计算导致坐标位置偏移
          .filter((d) => !d.originCoordinates)
          .map((d) => {
            d.version = Version['GAODE2.x'];
            // @ts-ignore
            d.originCoordinates = cloneDeep(d.coordinates); // 为了兼容高德1.x 需要保存一份原始的经纬度坐标数据（许多上层逻辑依赖经纬度数据）
            // @ts-ignore
            d.coordinates = this.mapService.lngLatToCoord(d.coordinates);
          });
      } else {
        // 连续的线、面数据
        // @ts-ignore
        mappedData
          // TODO: 避免经纬度被重复计算导致坐标位置偏移
          .filter((d) => !d.originCoordinates)
          .map((d) => {
            d.version = Version['GAODE2.x'];
            // @ts-ignore
            d.originCoordinates = cloneDeep(d.coordinates); // 为了兼容高德1.x 需要保存一份原始的经纬度坐标数据（许多上层逻辑依赖经纬度数据）
            // @ts-ignore
            d.coordinates = this.mapService.lngLatToCoords(d.coordinates);
          });
      }
    }
  }

  private adjustData2SimpleCoordinates(mappedData: IEncodeFeature[]) {
    if (mappedData.length > 0 && this.mapService.version === Version.SIMPLE) {
      mappedData.map((d) => {
        if (!d.simpleCoordinate) {
          d.coordinates = this.unProjectCoordinates(d.coordinates);
          d.simpleCoordinate = true;
        }
      });
    }
  }

  private unProjectCoordinates(coordinates: any) {
    if (typeof coordinates[0] === 'number') {
      return this.mapService.simpleMapCoord.unproject(
        coordinates as [number, number],
      );
    }

    if (coordinates[0] && coordinates[0][0] instanceof Array) {
      // @ts-ignore
      const coords = [];
      coordinates.map((coord: any) => {
        // @ts-ignore
        const c1 = [];
        coord.map((co: any) => {
          c1.push(
            this.mapService.simpleMapCoord.unproject(co as [number, number]),
          );
        });
        // @ts-ignore
        coords.push(c1);
      });
      // @ts-ignore
      return coords;
    } else {
      // @ts-ignore
      const coords = [];
      // @ts-ignore
      coordinates.map((coord) => {
        coords.push(
          this.mapService.simpleMapCoord.unproject(coord as [number, number]),
        );
      });
      // @ts-ignore
      return coords;
    }
  }

  private applyAttributeMapping(
    attribute: IStyleAttribute,
    record: { [key: string]: unknown },
    minimumColor?: string,
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

    const mappingResult = attribute.mapping ? attribute.mapping(params) : [];
    if (attribute.name === 'color' && !isColor(mappingResult[0])) {
      return [minimumColor];
    }
    return mappingResult;
    // return attribute.mapping ? attribute.mapping(params) : [];
  }
}
