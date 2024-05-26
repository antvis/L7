import { BaseMapWrapper } from '@antv/l7-core';
import GMapService from './map';

export default class GMapWrapper extends BaseMapWrapper<any> {
  protected getServiceConstructor() {
    return GMapService;
  }
}
