/* eslint-disable */
import BaseMapWrapper from '../utils/BaseMapWrapper';
import TdtMapService from './map';

export default class TdtMapWrapper extends BaseMapWrapper<any> {
  // @ts-ignore
  protected getServiceConstructor() {
    return TdtMapService;
  }
}
