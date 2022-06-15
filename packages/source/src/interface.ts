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

export enum RasterTileType {
  IMAGE = 'image',
  ARRAYBUFFER = 'arraybuffer',
}
export interface IRasterTileParserCFG {
  tileSize?: number;
  minZoom?: number;
  maxZoom?: number;
  zoomOffset?: number;
  extent?: [number, number, number, number];
  updateStrategy?: 'overlap' | 'replace';
  // 指定 feature 编码 id
  featureId?: string;
  // 指定矢量瓦片的数据分类
  sourceLayer?: string;
  coord?: string;
  // 指定栅格瓦片的类型
  dataType?: RasterTileType;

  format?: any;
}

export interface IJsonItem {
  [key: string]: any;
}
export type IJsonData = IJsonItem[];
