import { Map } from 'mapbox-gl';
import { IMapboxInstance } from '../../typings/index';
import BaseMapWrapper from '../BaseMapWrapper';
import MapboxService from './index';

export default class MapboxWrapper extends BaseMapWrapper<
  Map & IMapboxInstance
> {
  protected getServiceConstructor() {
    return MapboxService;
  }
}
