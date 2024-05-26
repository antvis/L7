import { BaseMapWrapper } from '@antv/l7-core';
import TMapService from './map';

export default class TMapWrapper extends BaseMapWrapper<any> {
  protected getServiceConstructor() {
    return TMapService;
  }
}
