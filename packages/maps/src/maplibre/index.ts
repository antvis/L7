import { Map } from 'maplibre-gl';
import { IMapboxInstance } from '../../typings/index';
import BaseMapWrapper from '../utils/BaseMapWrapper';
import MaplibreService from './map';
export default class MapboxWrapper extends BaseMapWrapper<
  Map & IMapboxInstance
> {
  protected getServiceConstructor() {
    return MaplibreService;
  }
}
