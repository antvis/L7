import { BaseMapWrapper } from '@antv/l7-core';
import GMapService from './map';

export default class GMapWrapper extends BaseMapWrapper<google.maps.Map> {
  protected getServiceConstructor() {
    return GMapService;
  }
}
