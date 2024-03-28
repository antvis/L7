import type { Map } from 'mapbox-gl';
import type { IMapboxInstance } from '../types';
import BaseMapWrapper from '../utils/BaseMapWrapper';
import './logo.css';
import MapboxService from './map';
export default class MapboxWrapper extends BaseMapWrapper<Map & IMapboxInstance> {
  protected getServiceConstructor() {
    return MapboxService;
  }
}
