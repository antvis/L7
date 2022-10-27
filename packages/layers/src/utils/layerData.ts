import {
  IEncodeFeature,
  IFontService,
  ILayer,
  IMapService,
  IParseDataItem,
  ISourceCFG,
  IStyleAttribute,
  IStyleAttributeService,
  Position,
} from '@antv/l7-core';
import { Version } from '@antv/l7-maps';
import Source from '@antv/l7-source';
import { normalize, rgb2arr } from '@antv/l7-utils';
import { cloneDeep } from 'lodash';
import { ILineLayerStyleOptions } from '../core/interface';

function getArrowPoints(p1: Position, p2: Position) {
  const dir = [p2[0] - p1[0], p2[1] - p1[1]];
  const normalizeDir = normalize(dir);
  const arrowPoint = [
    p1[0] + normalizeDir[0] * 0.0001,
    p1[1] + normalizeDir[1] * 0.0001,
  ];
  return arrowPoint;
}

function adjustData2Amap2Coordinates(
  mappedData: IEncodeFeature[],
  mapService: IMapService,
  layer: ILayer,
) {
  // 根据地图的类型判断是否需要对点位数据进行处理, 若是高德2.0则需要对坐标进行相对偏移
  if (mappedData.length > 0 && mapService.version === Version['GAODE2.x']) {
    const layerCenter = layer.coordCenter;
    if (typeof mappedData[0].coordinates[0] === 'number') {
      // 单个的点数据
      // @ts-ignore
      mappedData
        // 避免经纬度被重复计算导致坐标位置偏移
        .filter((d) => !d.originCoordinates)
        .map((d) => {
          d.version = Version['GAODE2.x'];
          // @ts-ignore
          d.originCoordinates = cloneDeep(d.coordinates); // 为了兼容高德1.x 需要保存一份原始的经纬度坐标数据（许多上层逻辑依赖经纬度数据）
          // @ts-ignore
          // d.coordinates = mapService.lngLatToCoord(d.coordinates);
          d.coordinates = mapService.lngLatToCoordByLayer(
            d.coordinates,
            layerCenter,
          );
        });
    } else {
      // 连续的线、面数据
      // @ts-ignore
      mappedData
        // 避免经纬度被重复计算导致坐标位置偏移
        .filter((d) => !d.originCoordinates)
        .map((d) => {
          d.version = Version['GAODE2.x'];
          // @ts-ignore
          d.originCoordinates = cloneDeep(d.coordinates); // 为了兼容高德1.x 需要保存一份原始的经纬度坐标数据（许多上层逻辑依赖经纬度数据）
          // @ts-ignore
          // d.coordinates = mapService.lngLatToCoords(d.coordinates);
          d.coordinates = mapService.lngLatToCoordsByLayer(
            d.coordinates,
            layerCenter,
          );
        });
    }
  }
}

function adjustData2SimpleCoordinates(
  mappedData: IEncodeFeature[],
  mapService: IMapService,
) {
  if (mappedData.length > 0 && mapService.version === Version.SIMPLE) {
    mappedData.map((d) => {
      if (!d.simpleCoordinate) {
        d.coordinates = unProjectCoordinates(d.coordinates, mapService);
        d.simpleCoordinate = true;
      }
    });
  }
}

function unProjectCoordinates(coordinates: any, mapService: IMapService) {
  if (typeof coordinates[0] === 'number') {
    return mapService.simpleMapCoord.unproject(coordinates as [number, number]);
  }

  if (coordinates[0] && coordinates[0][0] instanceof Array) {
    // @ts-ignore
    const coords = [];
    coordinates.map((coord: any) => {
      // @ts-ignore
      const c1 = [];
      coord.map((co: any) => {
        c1.push(mapService.simpleMapCoord.unproject(co as [number, number]));
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
        mapService.simpleMapCoord.unproject(coord as [number, number]),
      );
    });
    // @ts-ignore
    return coords;
  }
}

function applyAttributeMapping(
  attribute: IStyleAttribute,
  record: { [key: string]: unknown },
) {
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
}

function mapping(
  attributes: IStyleAttribute[],
  data: IParseDataItem[],
  fontService: IFontService,
  mapService: IMapService,
  layer?: ILayer,
): IEncodeFeature[] {
  const {
    arrow = {
      enable: false,
    },
  } = layer?.getLayerConfig() as ILineLayerStyleOptions;
  const mappedData = data.map((record: IParseDataItem) => {
    const encodeRecord: IEncodeFeature = {
      id: record._id,
      coordinates: record.coordinates,
    };

    attributes
      .filter((attribute) => attribute.scale !== undefined)
      .forEach((attribute: IStyleAttribute) => {
        let values = applyAttributeMapping(attribute, record);

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

        // 增加对 layer/text/iconfont unicode 映射的解析
        if (attribute.name === 'shape') {
          encodeRecord.shape = fontService.getIconFontKey(
            encodeRecord[attribute.name] as string,
          );
        }
      });

    if (encodeRecord.shape === 'line' && arrow.enable) {
      // 只有在线图层且支持配置箭头的时候进行插入顶点的处理
      const coords = encodeRecord.coordinates as Position[];
      const arrowPoint = getArrowPoints(coords[0], coords[1]);
      encodeRecord.coordinates.splice(1, 0, arrowPoint, arrowPoint);
    }
    return encodeRecord;
  }) as IEncodeFeature[];
  // 调整数据兼容 Amap2.0
  adjustData2Amap2Coordinates(mappedData, mapService, layer as ILayer);

  // 调整数据兼容 SimpleCoordinates
  adjustData2SimpleCoordinates(mappedData, mapService);

  return mappedData;
}

export function calculateData(
  layer: ILayer,
  fontService: IFontService,
  mapService: IMapService,
  styleAttributeService: IStyleAttributeService,
  data: any,
  options: ISourceCFG | undefined,
): IEncodeFeature[] {
  const source = new Source(data, options);
  const attributes = styleAttributeService.getLayerStyleAttributes() || [];
  const { dataArray } = source.data;
  const filterData = dataArray;

  const mappedEncodeData = mapping(
    attributes,
    filterData,
    fontService,
    mapService,
    layer,
  );
  source.destroy();
  return mappedEncodeData;
}
