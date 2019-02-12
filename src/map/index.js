import MapBox from './mapbox';
import { default as AMap } from './AMap';
export {
  AMap,
  MapBox
};
const MapType = {
  amap: AMap,
  mapbox: MapBox
};
export const getMap = type => {
  return MapType[type.toLowerCase()];
};

export const registerMap = (type, map) => {
  if (getMap(type)) {
    throw new Error(`Map type '${type}' existed.`);
  }
  map.type = type;
  // 存储到 map 中
  MapType[type.toLowerCase()] = map;
};
