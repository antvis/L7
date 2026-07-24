import BaiduMap from './bmap/';
import Earth from './earth/';
import GoogleMap from './gmap';
import { GaodeMap, GaodeMapV1, GaodeMapV2 } from './lib/gaode-aliases';
import Map from './map/';
import Mapbox from './mapbox/';
import MapLibre from './maplibre';
import TMap from './tdtmap';
import TencentMap from './tmap';
import type { MapType } from './types';

export { default as Viewport } from './lib/web-mercator-viewport';
export * from './utils';

export {
  BaiduMap,
  Earth,
  GaodeMap,
  GaodeMapV1,
  GaodeMapV2,
  GoogleMap,
  Map,
  Mapbox,
  MapLibre,
  MapType,
  TencentMap,
  TMap,
};

// Re-exported from merged @antv/l7-map (mapbase) — abstract map primitives.
export { MapMouseEvent, MercatorCoordinate, SimpleMapCoord } from './mapbase';
export type { ISimpleMapCoord, MapOptions } from './mapbase';
