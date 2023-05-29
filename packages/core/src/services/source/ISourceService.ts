import { RequestParameters, SourceTile, TilesetManager } from '@antv/l7-utils';
import { BBox } from '@turf/helpers';
export type DataType = string | object[] | object;
export type SourceEventType = 'inited' | 'sourceUpdate' | 'update';
// 栅格瓦片解析配置项

export enum RasterTileType {
  IMAGE = 'image',
  CUSTOMIMAGE = 'customImage',
  ARRAYBUFFER = 'arraybuffer',
  RGB = 'rgb',
  TERRAINRGB = 'terrainRGB',
  CUSTOMRGB = 'customRGB',
  CUSTOMARRAYBUFFER = 'customArrayBuffer',
  CUSTOMTERRAINRGB = 'customTerrainRGB',
}

export interface IGeojsonvtOptions {
  maxZoom: number; // max zoom to preserve detail on
  indexMaxZoom: number; // max zoom in the tile index
  indexMaxPoints: number; // max number of points per tile in the tile index
  tolerance: number; // simplification tolerance (higher means simpler)
  extent: number; // tile extent
  buffer: number; // tile buffer on each side
  lineMetrics: boolean; // whether to calculate line metrics
  promoteId: null; // name of a feature property to be promoted to feature.id
  generateId: boolean; // whether to generate feature ids. Cannot be used with promoteId
  debug: number; // logging level (0, 1 or 2)
}
export interface ITileParserCFG {
  type: string;
  tileSize?: number;
  minZoom?: number;
  maxZoom?: number;
  zoomOffset?: number;
  getCustomData: (
    tile: { x: number; y: number; z: number },
    cb: (err: any, data: any) => void,
  ) => void;
  extent?: [number, number, number, number];
  requestParameters: Partial<RequestParameters>;
  updateStrategy?: 'overlap' | 'replace';
  // 指定 feature 编码 id
  featureId?: string;
  // 指定矢量瓦片的数据分类
  sourceLayer?: string;
  coord?: string;
  // 指定栅格瓦片的类型
  dataType?: RasterTileType;

  geojsonvtOptions?: IGeojsonvtOptions;

  wmtsOptions: IWMTSServiceOption;

  format?: any;
  operation?: any;

  // 用户自定义请求url
  getURLFromTemplate?: (
    template: string,
    properties: { x: number; y: number; z: number },
  ) => string;
  // 用户自定义处理返回数据回调
  transformResponse?: (response: object) => any;
}

export interface IWMTSServiceOption {
  layer: string;
  version?: string;
  style?: string;
  format: string;
  service?: string;
  tileMatrixset: string;
}
export interface IParserCfg {
  type: string;
  x?: string;
  y?: string;
  x1?: string;
  y1?: string;
  coordinates?: string;
  geometry?: string;
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
  autoRender?: boolean;
  parser?: IParserCfg | ITileParserCFG;
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
  inited: boolean;
  isTile: boolean;
  data: IParserData;
  center: [number, number];
  parser: IParserCfg;
  transforms: ITransform[];
  cluster: boolean;
  clusterOptions: Partial<IClusterOptions>;
  extent: BBox;
  tileset: TilesetManager | undefined;
  getSourceCfg(): any;
  setData(data: any, options?: ISourceCFG): void;
  updateClusterData(zoom: number): void;
  getFeatureById(id: number): unknown;
  getFeatureId(field: string, value: any): number | undefined;
  getParserType(): string;
  getClusters(zoom: number): any;
  // 瓦片图层
  reloadAllTile(): void;
  reloadTilebyId(z: number, x: number, y: number): void;
  reloadTileByLnglat(lng: number, lat: number, z: number): void;
  reloadTileByExtent(bounds: [number, number, number, number], z: number): void;
  getTileExtent(
    extent: [number, number, number, number],
    zoom: number,
  ): Array<{ x: number; y: number; z: number }> | undefined;
  getTileByZXY(z: number, x: number, y: number): SourceTile | undefined;
  getClustersLeaves(id: number): any;
  updateFeaturePropertiesById(
    id: number,
    properties: Record<string, any>,
  ): void;
  destroy(): void;
  // Event
  on(type: SourceEventType | string, handler: (...args: any[]) => void): void;
  off(type: SourceEventType | string, handler: (...args: any[]) => void): void;
  once(type: SourceEventType | string, handler: (...args: any[]) => void): void;
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
