import { BaseMapWrapper } from '@antv/l7-core';
import TdtMapService from './map';

export default class TdtMapWrapper extends BaseMapWrapper<any> {
  // @ts-ignore
  protected getServiceConstructor() {
    return TdtMapService;
  }
}
