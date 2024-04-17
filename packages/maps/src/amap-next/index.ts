import BaseMapWrapper from '../utils/BaseMapWrapper';
import MapService from './map';

export default class AMap2Wrapper extends BaseMapWrapper<AMap.Map> {
  protected getServiceConstructor() {
    return MapService;
  }
}
