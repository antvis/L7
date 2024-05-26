import { BaseMapWrapper } from '@antv/l7-core';
import type { Map } from '@antv/l7-map';
import EarthService from './earth';

export default class EarthWrapper extends BaseMapWrapper<Map> {
  protected getServiceConstructor() {
    return EarthService;
  }
}
