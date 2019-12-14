export interface IWarnInfo {
  MapToken: string;
  [key: string]: any;
}
const WarnInfo: IWarnInfo = {
  MapToken: '您正在使用 Demo测试地图token，如果生成环境中使用去对应地图请注册Token',
  SDK: 's',
};

export default WarnInfo;
