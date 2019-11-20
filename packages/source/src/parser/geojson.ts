import { djb2hash } from '@antv/l7-utils';
// @ts-ignore
import rewind from '@mapbox/geojson-rewind';
import {
  Feature,
  FeatureCollection,
  Geometries,
  Geometry,
  Properties,
} from '@turf/helpers';
import { getCoords } from '@turf/invariant';
import * as turfMeta from '@turf/meta';
import { IFeatureKey, IParseDataItem, IParserData } from '../interface';
interface IGeoJSON {
  features: object[];
}
interface IParserCFG {
  idField?: string;
  [key: string]: any;
}
export default function geoJSON(
  data: FeatureCollection<Geometries, Properties>,
  cfg?: IParserCFG,
): IParserData {
  rewind(data, true); // 设置地理多边形方向 If clockwise is true, the outer ring is clockwise, otherwise it is counterclockwise.
  const resultData: IParseDataItem[] = [];
  const featureKeys: IFeatureKey = {};
  data.features = data.features.filter((item: Feature) => {
    const geometry: Geometry | null = item.geometry as Geometry;
    return (
      item != null &&
      geometry &&
      geometry.type &&
      geometry.coordinates &&
      geometry.coordinates.length > 0
    );
  });
  // 数据为空时处理
  let i = 0;
  // multi polygon 拆分
  turfMeta.flattenEach(
    data,
    (currentFeature: Feature<Geometries, Properties>, featureIndex: number) => {
      const coord = getCoords(currentFeature);
      let id = featureIndex;
      // 瓦片数据通过字段hash建立索引
      if (
        cfg &&
        cfg.idField &&
        currentFeature.properties &&
        currentFeature.properties[cfg.idField]
      ) {
        const value = currentFeature.properties[cfg.idField];
        id = djb2hash(value) % 1000019;
        featureKeys[id] = {
          index: i++,
          idField: value,
        };
      }
      const dataItem: IParseDataItem = {
        ...currentFeature.properties,
        coordinates: coord,
        _id: id,
      };
      resultData.push(dataItem);
    },
  );
  return {
    dataArray: resultData,
    featureKeys,
  };
}
