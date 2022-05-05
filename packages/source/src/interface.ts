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

// 栅格瓦片解析配置项
export interface IRasterTileParserCFG {
  tileSize?: number;
  minZoom?: number;
  maxZoom?: number;
  zoomOffset?: number;
  extent?: [number, number, number, number];
  updateStrategy?: 'overlap' | 'replace';
}

export interface IJsonItem {
  [key: string]: any;
}
export type IJsonData = IJsonItem[];
