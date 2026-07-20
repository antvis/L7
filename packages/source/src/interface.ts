/**
 * @antv/l7-source 类型定义
 *
 * 与 `@antv/l7-core` 重复的类型此处改为 re-export（单一来源在 core），
 * 仅 @antv/l7-source 专有类型（栅格波段运算、瓦片数据源等）在此定义。
 *
 * 重构参考：docs/refactoring/source/PLAN.md › 阶段 0.1
 */

// 与 @antv/l7-core 重复的类型 —— 单一来源在 core，此处仅作 re-export 透传
export type {
  DataType,
  IDictionary,
  IFeatureKey,
  IJsonData,
  IJsonItem,
  IParseDataItem,
  IParserData,
} from '@antv/l7-core';

// ===== @antv/l7-source 专有类型 =====

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
  ((bands: IRasterData[]) => Uint8Array | number[]) | any[] | IRgbOperation | SchemaOperationType;

export type SchemaOperationType = SchemaRGBOperation | SchemaBandOperation;

export type IRasterLayerData = number[] | IRasterFileData | IRasterFileData[];

/**
 * 注意：@antv/l7-core 也定义了 IRasterCfg，但那是简化版（extent 必需、无 coordinates/format/operation）。
 * 此处保留 source 的完整版本供 parser 使用。后续统一见 BACKLOG。
 */
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
