import { Map } from 'mapbox-gl';
import { IMapboxInstance } from '../../typings/index';
import BaseMapWrapper from '../utils/BaseMapWrapper';
import './logo.css';
import MapboxService from './map';
export default class MapboxWrapper extends BaseMapWrapper<
  Map & IMapboxInstance
> {
  protected getServiceConstructor() {
    return MapboxService;
  }
}
