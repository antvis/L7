import { BaseMapWrapper } from '@antv/l7-core';
import MapService from './map';

export default class MapboxWrapper extends BaseMapWrapper<BMapGL.Map> {
  protected getServiceConstructor() {
    return MapService;
  }
}
