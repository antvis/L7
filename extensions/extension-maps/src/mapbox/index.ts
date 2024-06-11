import { BaseMapWrapper } from '@antv/l7-core';
import type { Map } from 'mapbox-gl';
import './logo.css';
import MapboxService from './map';

export default class MapboxWrapper extends BaseMapWrapper<Map> {
  protected getServiceConstructor() {
    return MapboxService;
  }
}
