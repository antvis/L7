import GaodeMap from './amap';
import BaiduMap from './bmap';
import GoogleMap from './gmap';
import Mapbox from './mapbox';
import MapLibre from './maplibre';
import TdtMap from './tdtmap';
import TencentMap from './tmap';

/**
 * @deprecated
 * 使用 new TdtMap()
 */
const TMap = TdtMap;

export { BaiduMap, GaodeMap, GoogleMap, MapLibre, Mapbox, TMap, TdtMap, TencentMap };
