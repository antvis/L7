import * as turfMeta from '@turf/meta';
import { getCoords } from '@turf/invariant';

export default function geoJSON(data) {
  const resultData = [];
  turfMeta.flattenEach(data, (currentFeature, featureIndex) => { // 多个polygon 拆成一个
    const coord = getCoords(currentFeature);
    const dataItem = {
      ...currentFeature.properties,
      coordinates: coord,
      _id: featureIndex + 1
    };
    resultData.push(dataItem);
  });
  return {
    dataArray: resultData
  };
}
