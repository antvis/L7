import { Map } from '@antv/l7-map';
import BaseMapWrapper from '../BaseMapWrapper';
import MapService from './map';
export default class EarthWrapper extends BaseMapWrapper<Map> {
  protected getServiceConstructor() {
    return MapService;
  }
}
