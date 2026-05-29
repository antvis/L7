import BaseMapWrapper from '../utils/BaseMapWrapper';
import GMapService from './map';

class GoogleMapWrapper extends BaseMapWrapper<any> {
  protected getServiceConstructor() {
    return GMapService;
  }
}

// 统一命名为 GoogleMap，与主入口保持一致
export default GoogleMapWrapper;
export { GoogleMapWrapper as GoogleMap };
