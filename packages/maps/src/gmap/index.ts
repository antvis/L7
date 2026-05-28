import BaseMapWrapper from '../utils/BaseMapWrapper';
import GMapService from './map';

export default class GoogleMapWrapper extends BaseMapWrapper<any> {
  protected getServiceConstructor() {
    return GMapService;
  }
}
