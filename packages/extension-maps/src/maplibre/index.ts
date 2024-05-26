import { BaseMapWrapper } from '@antv/l7-core';
import type { Map } from 'maplibre-gl';
import type { IMapboxInstance } from '../types';
import MaplibreService from './map';

export default class MapboxWrapper extends BaseMapWrapper<Map & IMapboxInstance> {
  protected getServiceConstructor() {
    return MaplibreService;
  }
}
