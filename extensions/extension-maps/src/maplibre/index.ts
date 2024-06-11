import { BaseMapWrapper } from '@antv/l7-core';
import type { Map } from 'maplibre-gl';
import MaplibreService from './map';

export default class MapboxWrapper extends BaseMapWrapper<Map> {
  protected getServiceConstructor() {
    return MaplibreService;
  }
}
