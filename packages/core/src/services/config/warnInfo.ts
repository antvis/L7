export interface IWarnInfo {
  MapToken: string;
  SDK: string;
  [key: string]: any;
}
const WarnInfo: IWarnInfo = {
  MapToken:
    '您正在使用 Demo 测试 Token, 生产环境务必自行注册 Token 确保服务稳定 高德地图申请地址 https://lbs.amap.com/api/javascript-api/guide/abc/prepare  Mapbox地图申请地址 https://docs.mapbox.com/help/glossary/access-token/',
  SDK: '请确认引入了mapbox-gl api且在L7之前引入',
};

export default WarnInfo;
