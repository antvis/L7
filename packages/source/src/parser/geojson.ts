import type { Feature, FeatureCollection, Geometries, Geometry, Properties } from '@turf/helpers';
import { getCoords } from '@turf/invariant';
import { flattenEach } from '@turf/meta';
import type { IFeatureKey, IParseDataItem, IParserData } from '../interface';
import { geojsonRewind } from '../utils/util';

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

  // @ts-ignore
  if (!isNaN(feature.properties[key] * 1)) {
    // @ts-ignore
    return feature.properties[key] * 1;
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

  data = geojsonRewind(data);

  if (data.features.length === 0) {
    return {
      dataArray: [],
      featureKeys,
    };
  }

  // multi feature 情况拆分
  flattenEach(data, (currentFeature: Feature<Geometries, Properties>, featureIndex: number) => {
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
  });

  return {
    dataArray: resultData,
    featureKeys,
  };
}
