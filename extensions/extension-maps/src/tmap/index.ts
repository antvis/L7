import { BaseMapWrapper } from '@antv/l7-core';
import TencentMapService from './map';

export default class TencentMapWrapper extends BaseMapWrapper<TMap.Map> {
  protected getServiceConstructor() {
    return TencentMapService;
  }
}
