export type DataType = string | object[] | object;
export type TypedArray =
  | Int8Array
  | Uint8Array
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Uint8ClampedArray
  | Float32Array
  | Float64Array;
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

export interface IRasterData {
  rasterData: HTMLImageElement | Uint8Array | ImageBitmap | null | undefined;
  width: number;
  height: number;
}
export type IRasterFormat = (
  imageData: ArrayBuffer,
  bands: number[],
  channels?: string[],
) => Promise<IRasterData | IRasterData[]>;
export interface IRasterFileData {
  data: ArrayBuffer;
  bands: number[];
}

export type IRgbOperation = {
  r?: any[];
  g?: any[];
  b?: any[];
};
export type SchemaOperationType = SchemaRGBOperation | SchemaBandOperation;
export type SchemaRGBOption = {
  countCut?: [number, number]; // 百分比
  RMinMax?: [number, number];
  GMinMax?: [number, number];
  BMinMax?: [number, number];
};

export type SchemaRGBOperation = {
  type: 'rgb';
  options:
    | SchemaRGBOption
    | {
        r?: any[];
        g?: any[];
        b?: any[];
      };
};
export type SchemaBandOperation = {
  type: 'nd';
};

export type IBandsOperation =
  | ((bands: IRasterData[]) => Uint8Array | number[])
  | any[]
  | IRgbOperation
  | SchemaOperationType;

export type IRasterLayerData = number[] | IRasterFileData | IRasterFileData[];

export interface IRasterCfg {
  format?: IRasterFormat;
  operation?: IBandsOperation;
  extent?: [number, number, number, number];
  coordinates?: [[number, number], [number, number], [number, number], [number, number]]; // 非矩形
  width: number;
  height: number;
  max: number;
  min: number;
}

export interface ITileSource {
  getTileData(layer: string): any;
}

export type MapboxVectorTile = {
  layers: { [_: string]: { features: GeoJSON.Feature[] } };
};
