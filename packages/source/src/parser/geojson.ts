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
interface IParserCFG {
  idField?: string;
  featureId?: string;
  [key: string]: any;
}

function djb2hash(field: string) {
  const str = field.toString();
  let hash = 5381;
  let i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return hash >>> 0;
}

function getFeatureID(feature: Feature<Geometries, Properties>, key?: string) {
  if (key === undefined) {
    return null;
  }
  if (key === 'id' && feature.id) {
    // 标准 mapbox vector feature
    return feature.id;
  }
  // @ts-ignore
  if (feature[key]) {
    // 单独指定要素
    // @ts-ignore
    return feature[key];
  }
  if (feature.properties && feature.properties[key]) {
    // 根据 properties 要素的属性进行编码
    return djb2hash(feature.properties[key] + '') % 1000019;
  }
  return null;
}

export default function geoJSON(
  data: FeatureCollection<Geometries, Properties>,
  cfg?: IParserCFG,
): IParserData {
  const resultData: IParseDataItem[] = [];
  const featureKeys: IFeatureKey = {};
  if (!data.features) {
    data.features = [];
    return {
      dataArray: [],
    };
  }
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
  // multi polygon 拆分
  turfMeta.flattenEach(
    data,
    (currentFeature: Feature<Geometries, Properties>, featureIndex: number) => {
      let featureId = getFeatureID(currentFeature, cfg?.featureId);
      if (featureId === null) {
        featureId = featureIndex;
      }
      const sortedID = featureId;

      const coord = getCoords(currentFeature);
      const dataItem: IParseDataItem = {
        ...currentFeature.properties,
        coordinates: coord,
        _id: sortedID,
      };
      resultData.push(dataItem);
    },
  );
  return {
    dataArray: resultData,
    featureKeys,
  };
}
