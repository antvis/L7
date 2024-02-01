/* eslint-disable */
import BaseMapWrapper from '../utils/BaseMapWrapper';
import GMapService from './map';

export default class GMapWrapper extends BaseMapWrapper<any> {
  protected getServiceConstructor() {
    return GMapService;
  }
}
