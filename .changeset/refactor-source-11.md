---
'@antv/l7-source': patch
---

refactor(source): define Parser contract + dedupe raster parser types (stage 2.1)

定义统一 Parser 函数契约, 为阶段 2.2 ParserRegistry class 与
2.3 ParserNotFoundError 铺路. 对外 API 完全等价 (新增类型, 无运行时改动).

- interface.ts (102 -> 200, +98):
  - 新增 export type Parser<TData, TCfg, TResult extends IParserData>
    = (data: TData, cfg?: TCfg) => TResult 统一 parser 契约
  - 新增 export interface KnownParsers: 13 内置 parser
    (csv/geojson/.../testTile) 注册键名 -> Parser 契约 映射
  - 新增 export type KnownParserType = keyof KnownParsers
  - 去重: RasterDataType / IRGBParseCfg 从 parser/rgb.ts 与
    parser/ndi.ts (两份完全相同的定义) 收敛到 interface.ts 单一来源
    - 闭环 BACKLOG: 独立小项 RasterDataType / IRGBParseCfg 重复定义
  - 去重: IImageCfg 从 parser/image.ts 收敛到 interface.ts
    (image.ts 改 import 转发, 无外部使用)
  - 新增 import type: IJsonData/IParserCfg/ITileParserCFG (core),
    ITileBand/RequestParameters (utils), FeatureCollection/Geometries/
    Properties (@turf/helpers) - 全 import type 无运行时副作用
- factory.ts (18 -> 47, +29):
  - type ParserFunction = Parser (替代字面量函数类型), 导入 Parser 契约
    - 契约的类型擦除版本 (Parser<any, any, IParserData>), 按 string 分发
  - 新增模块头注释, 指明阶段 2.2/2.3/2.4 演进路径
- parser/rgb.ts (27 -> 6, -21): 删本地 RasterDataType/IRGBParseCfg,
  import from interface
- parser/ndi.ts (26 -> 5, -21): 同上
- parser/image.ts: 删本地 IImageCfg 定义, import from interface;
  RequestParameters 因 loadData 仍用而保留 type import

设计取舍:

- Parser 用 type 别名 而非 PLAN 字面的 interface (call signature 等价)
- cfg? 在契约里是 optional (与现状一致); 预先隔离 TS 严格模式实测
  required-cfg 的具名 parser (csv) 可赋值到 Parser<any, any>, 兼容
  13 个 parser 文件无需改签名. 这是 "兼容擦除" 演进路径, ParserRegistry<K>
  在阶段 2.2 才使 cfg 形状参与类型推导
- KnownParsers 是弱契约, 不参与 tsc 检查 parser 实现 (实现由本地签名
  保证). 强制对齐留阶段 2.2 ParserRegistry<K extends KnownParserType>
- 去重 IImageCfg/RasterDataType/IRGBParseCfg 是顺手闭环: 仅内部使用,
  grep 确认无外部 importers, 单一化定义不破坏跨包消费

验证: source tsc 31 基线不变 (全 core .glsl 噪音), layers tsc 229
不变 (layers 不见直接 import 去重类型), eslint/prettier 通过,
source jest 27/27 通过.

详见 docs/refactoring/source/PROGRESS.md 阶段 2.1. 下一步阶段 2.2
ParserRegistry class + defaultRegistry 单例 + 旧 getParser 等
函数作 wrapper 保留.
