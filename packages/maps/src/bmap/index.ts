import BaseMapWrapper from '../utils/BaseMapWrapper';
import MapService from './map';
export default class MapboxWrapper extends BaseMapWrapper<BMapGL.Map> {
  protected getServiceConstructor() {
    return MapService;
  }
}
