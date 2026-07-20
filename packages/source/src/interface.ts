/**
 * @antv/l7-source 类型定义
 *
 * 与 `@antv/l7-core` 重复的类型此处改为 re-export（单一来源在 core），
 * 仅 @antv/l7-source 专有类型（栅格波段运算、瓦片数据源等）在此定义。
 *
 * 重构参考：docs/refactoring/source/PLAN.md › 阶段 0.1
 */

// 阶段 2.1: Parser 契约 + 已注册 parser 键名所需运行时类型
import type { IJsonData, IParserCfg, IParserData, ITileParserCFG } from '@antv/l7-core';
import type { ITileBand, RequestParameters } from '@antv/l7-utils';
import type { FeatureCollection, Geometries, Properties } from '@turf/helpers';

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

/**
 * Image parser 配置 (阶段 2.1: 从 parser/image.ts 收敛到 interface.ts,
 * 单一来源; IImageCfg 内部无外部使用, image.ts 改 import 转发).
 */
export interface IImageCfg {
  extent?: [number, number, number, number];
  coordinates?: [[number, number], [number, number], [number, number], [number, number]]; // 非矩形
  requestParameters?: Omit<RequestParameters, 'url'>;
}

// ===== Parser 契约 + 注册键名（阶段 2.1）=====

/**
 * 统一 Parser 函数契约（阶段 2.1）。
 *
 * parser = 纯数据形状转换: (原始数据, 解析配置) => IParserData.
 * - TData: 原始输入数据形状 (csv string / geojson FeatureCollection / 栅格数组 等)
 * - TCfg: 解析配置形状 (IParserCfg / ITileParserCFG / IRasterCfg / IRGBParseCfg / IImageCfg 等)
 * - TResult: 返回数据形状, 默认 IParserData, 预留子类型 (如 IRasterTileSourceData)
 *
 * 各 parser 的 default export 已是 (TData, TCfg) => IParserData 的具体签名,
 * 结构上自动满足本契约 (TS 允许 "required cfg" 函数指针赋值到 "optional cfg"
 * 类型当 cfg 形参类型是 any, 详见阶段 2.1 PROGRESS 验证). factory.ts 的
 * ParserFunction 是该契约的 "类型擦除" 版本 (Parser<any, any>), 用于按 string
 * 分发的可变注册表. 阶段 2.2 ParserRegistry 会用精确泛型承接.
 *
 * 重构参考: docs/refactoring/source/PLAN.md › 阶段 2.1
 */
export type Parser<TData = any, TCfg = any, TResult extends IParserData = IParserData> = (
  data: TData,
  cfg?: TCfg,
) => TResult;

/**
 * 栅格波段数据类型 (阶段 2.1 去重: 原 parser/rgb.ts 与 parser/ndi.ts 各定义一份,
 * 形状完全相同; 统一收敛到 interface.ts, 单一来源, BACKLOG 项 GAP-3 闭环).
 */
export type RasterDataType =
  | Uint8Array
  | Int8Array
  | Uint16Array
  | Int16Array
  | Uint32Array
  | Int32Array
  | Float32Array
  | Float64Array;

/**
 * RGB / NDI 栅格解析配置 (阶段 2.1 去重: 原 rgb.ts / ndi.ts 各定义一份).
 * 在 IRasterCfg 之上扩展 bands / countCut / 通道 MinMax 三段.
 */
export interface IRGBParseCfg extends IRasterCfg {
  bands?: [number, number, number];
  countCut?: [number, number];
  RMinMax?: [number, number];
  GMinMax?: [number, number];
  BMinMax?: [number, number];
}

/**
 * 全部内置 parser 的 "注册键名 -> Parser 契约" 映射 (阶段 2.1, 对外暴露).
 *
 * 用途: 阶段 2.2 ParserRegistry<K extends keyof KnownParsers> 用本接口约束
 * getParser/registerParser 的类型参数; 阶段 2.5 工厂 createSource(data, cfg,
 * registry?) 用本接口查表推导 cfg 形状. 当前 13 个内置 parser 全列出, data /
 * cfg 形状取 default export 的实际签名.
 *
 * 注意: 本接口仅作 "注册键名 -> 契约" 的弱契约 (Partial<ITileParserCFG> 等
 * 私有缩窄类型保留), parser 文件本身仍以本地精确签名保证实现正确,
 * KnownParsers 不参与 tsc 检查 parser 实现的具体签名 (实现与契约一致是阶段
 * 2.2 注册机制现代化后才会强制对齐的).
 */
export interface KnownParsers {
  csv: Parser<string, IParserCfg>;
  geojson: Parser<FeatureCollection<Geometries, Properties>, IParserCfg>;
  geojsonvt: Parser<FeatureCollection<Geometries, Properties>, ITileParserCFG>;
  image: Parser<string | string[] | HTMLImageElement | ImageBitmap, IImageCfg>;
  json: Parser<IJsonData, IParserCfg>;
  jsonTile: Parser<string, ITileParserCFG>;
  mvt: Parser<string | string[], ITileParserCFG>;
  ndi: Parser<RasterDataType[], IRGBParseCfg>;
  raster: Parser<IRasterLayerData, IRasterCfg>;
  rasterTile: Parser<string | string[] | ITileBand[], Partial<ITileParserCFG>>;
  rasterRgb: Parser<IRasterLayerData, IRasterCfg>;
  rgb: Parser<RasterDataType[], IRGBParseCfg>;
  testTile: Parser<string | string[], ITileParserCFG>;
}

/** 内置 parser 的注册键名联合类型 (阶段 2.1) */
export type KnownParserType = keyof KnownParsers;
