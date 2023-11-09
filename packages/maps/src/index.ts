import GaodeMapV1 from './amap/';
import { default as GaodeMap, default as GaodeMapV2 } from './amap2/';
import BaiduMap from './bmap/';
import Earth from './earth/';
import Map from './map/';
import Mapbox from './mapbox/';
import TdtMap from './tdtmap';
import TencentMap from './tmap';
import { Version } from './version';

export * from './utils';
export {
  Version,
  GaodeMap,
  GaodeMapV1,
  GaodeMapV2,
  Mapbox,
  Map,
  Earth,
  BaiduMap,
  TencentMap,
  TdtMap,
};
