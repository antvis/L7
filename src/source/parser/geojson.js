import * as turfMeta from '@turf/meta';
import { default as cleanCoords } from '@turf/clean-coords';
import { getCoords } from '@turf/invariant';

export default function geoJSON(data) {
  const resultData = [];
  turfMeta.flattenEach(data, (currentFeature, featureIndex) => { // 多个polygon 拆成一个
    const coord = getCoords(cleanCoords(currentFeature));
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
