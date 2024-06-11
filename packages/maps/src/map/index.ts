import { BaseMapWrapper } from '@antv/l7-core';
import type { Map } from '@antv/l7-map';
import MapService from './map';

export default class MapboxWrapper extends BaseMapWrapper<Map> {
  protected getServiceConstructor() {
    return MapService;
  }
}
