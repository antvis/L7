/* eslint-disable */
import BaseMapWrapper from '../utils/BaseMapWrapper';
import TMapService from './map';

export default class TMapWrapper extends BaseMapWrapper<any> {
  protected getServiceConstructor() {
    return TMapService;
  }
}
