export type DataType = string | object[] | object;
export interface IDictionary<TValue> {
  [key: string]: TValue;
}
export interface IFeatureKey {
  [key: string]: {
    index: number;
    idField: any;
  };
}
// 解析后返回数据类型
export interface IParseDataItem {
  coordinates: any[];
  _id: number;
  [key: string]: any;
}
export interface IParserData {
  [key: string]: any;
  dataArray: IParseDataItem[];
  // 瓦片地图数据字典
  featureKeys?: IFeatureKey;
}
export interface IJsonItem {
  [key: string]: any;
}
export type IJsonData = IJsonItem[];
