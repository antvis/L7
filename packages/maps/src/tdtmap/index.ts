import BaseMapWrapper from '../utils/BaseMapWrapper';
import TdtMapService from './map';

class TdtMapWrapper extends BaseMapWrapper<any> {
  // @ts-ignore
  protected getServiceConstructor() {
    return TdtMapService;
  }
}

// 统一命名为 TMap，与主入口保持一致
export default TdtMapWrapper;
export { TdtMapWrapper as TMap };
