import type { MapNext } from '@antv/l7-map';
import BaseMapWrapper from '../utils/BaseMapWrapper';
import MapService from './map';
export default class EarthWrapper extends BaseMapWrapper<MapNext> {
  protected getServiceConstructor() {
    return MapService;
  }
}
