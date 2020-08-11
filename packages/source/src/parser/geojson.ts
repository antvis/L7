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
  rewind(data, true); // 设置地理多边形方向 If clockwise is true, the outer ring is clockwise, otherwise it is counterclockwise.
  if (data.features.length === 0) {
    return {
      dataArray: [],
      featureKeys,
    };
  }
  // 数据为空时处理
  const i = 0;
  // multi polygon 拆分
  turfMeta.flattenEach(
    data,
    (currentFeature: Feature<Geometries, Properties>, featureIndex: number) => {
      const coord = getCoords(currentFeature);
      const id = featureIndex;
      const dataItem: IParseDataItem = {
        ...currentFeature.properties,
        coordinates: coord,
        _id: id,
      };
      resultData.push(dataItem);
      // }
    },
  );
  return {
    dataArray: resultData,
    featureKeys,
  };
}
