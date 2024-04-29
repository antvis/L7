import { MapType } from '@antv/l7-utils';
import { default as GaodeMapNext } from './amap-next';
import BaiduMap from './bmap/';
import Earth from './earth/';
import GoogleMap from './gmap';
import Map from './map/';
import Mapbox from './mapbox/';
import MapLibre from './maplibre';
import TMap from './tdtmap';
import TencentMap from './tmap';
export * from './utils';

const GaodeMap = GaodeMapNext;

/**
 * @deprecated
 * 不再支持 GaodeMapV1，自动指向最新版 GaodeMap V2
 */
const GaodeMapV1 = GaodeMapNext;

/**
 * @deprecated
 * 不再暴露 GaodeMapV2，默认自动指向最新版 GaodeMap
 */
const GaodeMapV2 = GaodeMapNext;

export {
  BaiduMap,
  Earth,
  GaodeMap,
  GaodeMapV1,
  GaodeMapV2,
  GoogleMap,
  Map,
  MapLibre,
  MapType,
  Mapbox,
  TMap,
  TencentMap,
};
