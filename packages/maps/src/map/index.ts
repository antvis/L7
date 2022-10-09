import { Map } from '@antv/l7-map';
import BaseMapWrapper from '../utils/BaseMapWrapper';
import MapService from './map';
export default class MapboxWrapper extends BaseMapWrapper<Map> {
  protected getServiceConstructor() {
    return MapService;
  }
}
