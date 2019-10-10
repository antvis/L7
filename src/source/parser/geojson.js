import * as turfMeta from '@turf/meta';
import { getCoords } from '@turf/invariant';
import { djb2hash } from '../../util/bkdr-hash';
import rewind from '@mapbox/geojson-rewind';
export default function geoJSON(data, cfg) {
  // 矢量瓦片图层不做 rewind
  const resultData = [];
  const featureKeys = {};
  data.features = data.features.filter(item => {
    return item != null
          && item.geometry
          && item.geometry.type
          && item.geometry.coordinates
          && Array.isArray(item.geometry.coordinates)
          && item.geometry.coordinates.length > 0;
  });
  rewind(data, true);
  // 数据为空时处理
  let i = 0;
  turfMeta.flattenEach(data, (currentFeature, featureIndex) => { // 多个polygon 拆成一个

    const coord = getCoords(currentFeature);
    if (coord.length === 0) {
      i++;
      return;
    }
    let id = featureIndex + 1;
    if (cfg.idField && currentFeature.properties[cfg.idField]) {
      const value = currentFeature.properties[cfg.idField];
      id = djb2hash(value) % 1000019;
      featureKeys[id] = {
        index: i++,
        idField: value
      };
    }
    const dataItem = {
      ...currentFeature.properties,
      coordinates: coord,
      _id: id
    };
    resultData.push(dataItem);
  });
  return {
    dataArray: resultData,
    featureKeys
  };
}
