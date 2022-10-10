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
  RGB = 'rgb',
}

export interface IGeojsonvtOptions {
  maxZoom: number;          // max zoom to preserve detail on
  indexMaxZoom: number;     // max zoom in the tile index
  indexMaxPoints: number;   // max number of points per tile in the tile index
  tolerance: number;        // simplification tolerance (higher means simpler)
  extent: number;           // tile extent
  buffer: number;           // tile buffer on each side
  lineMetrics: boolean;     // whether to calculate line metrics
  promoteId: null;          // name of a feature property to be promoted to feature.id
  generateId: boolean;      // whether to generate feature ids. Cannot be used with promoteId
  debug: number;            // logging level (0, 1 or 2)
}
export interface ITileParserCFG {
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

  geojsonvtOptions?: IGeojsonvtOptions;

  format?: any;
  operation?: any;
}

export interface IJsonItem {
  [key: string]: any;
}
export type IJsonData = IJsonItem[];

export interface IRasterData {
  rasterData: HTMLImageElement | Uint8Array| ImageBitmap | null | undefined;
  width: number;
  height: number;
}
export type IRasterFormat = (imageData: ArrayBuffer, bands: number[], channels?: string[]) => Promise<IRasterData|IRasterData[]>;
export interface IRasterFileData {
  data: ArrayBuffer;
  bands: number[];
}

export type IRgbOperation = {
  r?: any[];
  g?: any[]
  b?: any[]
};

export type IBandsOperation = ((bands: IRasterData[]) => Uint8Array | Array<number>) | any[] | IRgbOperation;

export type IRasterLayerData = number[] | IRasterFileData | IRasterFileData[];

export interface IRasterCfg {
  format?: IRasterFormat;
  operation?: IBandsOperation;
  extent: [number, number, number, number];
  width: number;
  height: number;
  max: number;
  min: number;
}