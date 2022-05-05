import { BBox } from '@turf/helpers';
export type DataType = string | object[] | object;
export interface IParserCfg {
  type: string;
  x?: string;
  y?: string;
  x1?: string;
  y1?: string;
  coordinates?: string;
  [key: string]: any;
}
type CallBack = (...args: any[]) => any;
export interface ITransform {
  type: string;
  [key: string]: any;
  callback?: CallBack;
}

export interface ISourceCFG {
  cluster?: boolean;
  clusterOptions?: Partial<IClusterOptions>;
  parser?: IParserCfg;
  transforms?: ITransform[];
}
export interface IClusterOptions {
  enable: false;
  radius: number;
  maxZoom: number;
  minZoom: number;
  zoom: number;
  bbox: [number, number, number, number];
  field: string;
  method: 'max' | 'sum' | 'min' | 'mean' | 'count' | CallBack;
}
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

export interface ISource {
  data: IParserData;
  cluster: boolean;
  clusterOptions: Partial<IClusterOptions>;
  extent: BBox;
  setData(data: any): void;
  updateClusterData(zoom: number): void;
  getFeatureById(id: number): unknown;
  getFeatureId(field: string, value: any): number | undefined;
  getClusters(zoom: number): any;
  getClustersLeaves(id: number): any;
  updateFeaturePropertiesById(
    id: number,
    properties: Record<string, any>,
  ): void;
}
export interface IRasterCfg {
  extent: [number, number, number, number];
  width: number;
  height: number;
  max: number;
  min: number;
}

export interface IRasterParserDataItem extends IParseDataItem {
  data: number[];
  width: number;
  height: number;
}
