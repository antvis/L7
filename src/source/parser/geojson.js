import * as turfMeta from '@turf/meta';
import { getCoords } from '@turf/invariant';
import { BKDRHash } from '../../util/bkdr-hash';
export default function geoJSON(data, cfg) {
  const resultData = [];
  const featureKeys = {};
  data.features = data.features.filter(item => {
    return item != null && item.geometry && item.geometry.type && item.geometry.coordinates && item.geometry.coordinates.length > 0;
  });
  // 数据为空时处理
  turfMeta.flattenEach(data, (currentFeature, featureIndex) => { // 多个polygon 拆成一个
    const coord = getCoords(currentFeature);
    let id = featureIndex + 1;
    if (cfg.idField && currentFeature.properties[cfg.idField]) {
      const value = currentFeature.properties[cfg.idField];
     // id = value;
      id = BKDRHash(value) % 1000019;
      // if (featureKeys[id] && featureIndex !== featureKeys[id]) {
      //   // TODO 哈希冲突解决方法
      //   console.log('哈希冲突', value);
      // }
    }
    featureKeys[id] = featureIndex;
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
