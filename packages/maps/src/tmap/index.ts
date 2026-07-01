import BaseMapWrapper from '../utils/BaseMapWrapper';
import TMapService from './map';

class TMapWrapper extends BaseMapWrapper<any> {
  protected getServiceConstructor() {
    return TMapService;
  }
}

// 统一命名为 TencentMap，与主入口保持一致
export default TMapWrapper;
export { TMapWrapper as TencentMap };
