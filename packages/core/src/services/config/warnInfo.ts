export interface IWarnInfo {
  MapToken: string;
  SDK: string;
  [key: string]: any;
}
const WarnInfo: IWarnInfo = {
  MapToken:
    '您正在使用 Demo 测试地图token，生产环境务必自行注册Token 确保服务稳定',
  SDK: '请确认引入了mapbox-gl api且在L7之前引入',
};

export default WarnInfo;
