import type { IAMapInstance } from '../types';
import BaseMapWrapper from '../utils/BaseMapWrapper';
import AMapService from './map';

export default class AMapWrapper extends BaseMapWrapper<AMap.Map & IAMapInstance> {
  protected getServiceConstructor() {
    return AMapService;
  }
}
