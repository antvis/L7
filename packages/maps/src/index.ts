import GaodeMapV1 from './amap/';
// import GaodeMapV1 from './amap/';
import { default as GaodeMap, default as GaodeMapV2 } from './amap2/';
import Earth from './earth/';
// import GaodeMapV2 from './amap2/';
import Map from './map/';
import Mapbox from './mapbox/';
import { Version } from './version';

export * from './utils';
export { Version, GaodeMap, GaodeMapV1, GaodeMapV2, Mapbox, Map, Earth };
