/* eslint-disable */
import BaseMapWrapper from '../utils/BaseMapWrapper';
import TMapService from './map';

export default class TMapWrapper extends BaseMapWrapper<any> {
  // @ts-ignore
  protected getServiceConstructor() {
    return TMapService;
  }
}
