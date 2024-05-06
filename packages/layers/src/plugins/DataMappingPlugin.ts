import type {
  IEncodeFeature,
  IFontService,
  ILayer,
  ILayerPlugin,
  IMapService,
  IParseDataItem,
  IStyleAttribute,
  IStyleAttributeService,
  L7Container,
  Position,
} from '@antv/l7-core';
import { IDebugLog, ILayerStage } from '@antv/l7-core';
import { normalize, rgb2arr } from '@antv/l7-utils';

export default class DataMappingPlugin implements ILayerPlugin {
  private mapService: IMapService;
  private fontService: IFontService;

  public apply(layer: ILayer, { styleAttributeService, mapService, fontService }: L7Container) {
    this.mapService = mapService;
    this.fontService = fontService;

    layer.hooks.init.tapPromise('DataMappingPlugin', async () => {
      layer.log(IDebugLog.MappingStart, ILayerStage.INIT);
      // 初始化重新生成 map
      this.generateMaping(layer, { styleAttributeService });
      layer.log(IDebugLog.MappingEnd, ILayerStage.INIT);
    });

    layer.hooks.beforeRenderData.tapPromise('DataMappingPlugin', async (flag: boolean) => {
      if (!flag) {
        return flag;
      }

      layer.dataState.dataMappingNeedUpdate = false;
      layer.log(IDebugLog.MappingStart, ILayerStage.UPDATE);
      const mappingResult = this.generateMaping(layer, {
        styleAttributeService,
      });
      layer.log(IDebugLog.MappingEnd, ILayerStage.UPDATE);
      return mappingResult;
    });

    // remapping before render
    layer.hooks.beforeRender.tap('DataMappingPlugin', () => {
      const source = layer.getSource();
      if (layer.layerModelNeedUpdate || !source || !source.inited) {
        return;
      }
      const attributes = styleAttributeService.getLayerStyleAttributes() || [];
      const filter = styleAttributeService.getLayerStyleAttribute('filter');
      const { dataArray } = source.data;
      // TODO 数据为空的情况
      if (Array.isArray(dataArray) && dataArray.length === 0) {
        return;
      }
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
        const encodeData = this.mapping(
          layer,
          attributesToRemapping,
          filterData,
          layer.getEncodedData(), // TODO 优化
        );
        layer.setEncodedData(encodeData);
      }

      // 处理文本更新，更新文字形状
      // layer.emit('remapping', null);
    });
  }
  private generateMaping(
    layer: ILayer,
    { styleAttributeService }: { styleAttributeService: IStyleAttributeService },
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
    // Tip: layer 对数据做处理
    // 数据处理 在数据进行 mapping 生成 encodeData 之前对数据进行处理
    // 在各个 layer 中继承

    filterData = layer.processData(filterData); // 目前只有简单线需要处理
    const encodeData = this.mapping(layer, attributes, filterData, undefined);

    layer.setEncodedData(encodeData);

    // 对外暴露事件
    layer.emit('dataUpdate', null);
    return true;
  }

  private mapping(
    layer: ILayer,
    attributes: IStyleAttribute[],
    data: IParseDataItem[],
    predata?: IEncodeFeature[],
  ): IEncodeFeature[] {
    const usedAttributes = attributes
      .filter((attribute) => attribute.scale !== undefined)
      .filter((attribute) => attribute.name !== 'filter');
    const mappedData = data.map((record: IParseDataItem, i) => {
      const preRecord = predata ? predata[i] : {};
      const encodeRecord: IEncodeFeature = {
        id: record._id,
        coordinates: record.coordinates,
        ...preRecord,
      };

      usedAttributes.forEach((attribute: IStyleAttribute) => {
        let values = this.applyAttributeMapping(attribute, record);
        // TODO: 支持每个属性配置 postprocess}
        if (attribute.name === 'color' || attribute.name === 'stroke') {
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

    attributes.forEach((attribute) => {
      attribute.needRemapping = false;
    });

    // 调整数据兼容 SimpleCoordinates
    this.adjustData2SimpleCoordinates(mappedData);
    return mappedData;
  }

  private adjustData2SimpleCoordinates(mappedData: IEncodeFeature[]) {
    if (mappedData.length > 0 && this.mapService.version === 'SIMPLE') {
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
      return this.mapService.simpleMapCoord.unproject(coordinates as [number, number]);
    }

    if (coordinates[0] && coordinates[0][0] instanceof Array) {
      // @ts-ignore
      const coords = [];
      coordinates.map((coord: any) => {
        // @ts-ignore
        const c1 = [];
        coord.map((co: any) => {
          c1.push(this.mapService.simpleMapCoord.unproject(co as [number, number]));
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
        coords.push(this.mapService.simpleMapCoord.unproject(coord as [number, number]));
      });
      // @ts-ignore
      return coords;
    }
  }

  private applyAttributeMapping(attribute: IStyleAttribute, record: { [key: string]: unknown }) {
    if (!attribute.scale) {
      return [];
    }
    const scalers = attribute?.scale?.scalers || [];
    const params: unknown[] = [];

    scalers.forEach(({ field }) => {
      if (record.hasOwnProperty(field) || attribute.scale?.type === 'variable') {
        // TODO:多字段，常量
        params.push(record[field]);
      }
    });

    const mappingResult = attribute.mapping ? attribute.mapping(params) : [];

    return mappingResult;
    // return attribute.mapping ? attribute.mapping(params) : [];
  }

  private getArrowPoints(p1: Position, p2: Position) {
    const dir = [p2[0] - p1[0], p2[1] - p1[1]];
    const normalizeDir = normalize(dir);
    const arrowPoint = [p1[0] + normalizeDir[0] * 0.0001, p1[1] + normalizeDir[1] * 0.0001];
    return arrowPoint;
  }
}
