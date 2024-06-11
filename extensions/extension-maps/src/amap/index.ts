import { BaseMapWrapper } from '@antv/l7-core';
import MapService from './map';

export default class AMap2Wrapper extends BaseMapWrapper<AMap.Map> {
  protected getServiceConstructor() {
    return MapService;
  }
}
