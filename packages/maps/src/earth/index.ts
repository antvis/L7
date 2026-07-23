import type { Map } from '../mapbase';
import BaseMapWrapper from '../utils/BaseMapWrapper';
import MapService from './map';
export default class EarthWrapper extends BaseMapWrapper<Map> {
  protected getServiceConstructor() {
    return MapService;
  }
}
