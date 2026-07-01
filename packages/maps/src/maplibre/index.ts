import type { Map } from 'maplibre-gl';
import type { IMapboxInstance } from '../types';
import BaseMapWrapper from '../utils/BaseMapWrapper';
import MaplibreService from './map';

class MapboxWrapper extends BaseMapWrapper<Map & IMapboxInstance> {
  protected getServiceConstructor() {
    return MaplibreService;
  }
}

// 统一命名为 MapLibre，与主入口保持一致
export default MapboxWrapper;
export { MapboxWrapper as MapLibre };
