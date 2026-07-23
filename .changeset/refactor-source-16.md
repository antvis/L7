---
'@antv/l7-source': patch
---

refactor(source): extract JsonTileLoader from jsonTile parser (stage 3.1.1)

阶段 3.1 (Parser 与 Loader 解耦) 第一步增量: 把 jsonTile parser 的
模块级 getVectorTile 闭包机械抽取为实现 TileLoader 接口的 JsonTileLoader
类. parser 只组装 tilesetOptions.getTileData = (p, t) => loader.loadTile(p,
t). 行为与迁移前 100% 等价 (getCustomData 优先, 否则 getData 回调取数;
err/无数据 resolve 空 defaultLayer 的 GeoJSONVTTileSource, 永不 reject).

- 新增 src/loader/tile-loader.ts (26 行): TileLoader 接口
  loadTile(params, tile): Promise<ITileSource | undefined>. 接口签名
  undefined 化以兼容 mvt 失败时 resolve undefined 的既有路径 (jsonTile/
  geojsonvt 始终 resolve ITileSource, undefined 是合法但不使用的值)
- 新增 src/loader/json-tile-loader.ts (84 行): JsonTileLoader implements
  TileLoader. 构造器持 url / requestParameters? / getCustomData?;
  loadTile 内含原 getVectorTile 函数体 (机械搬运, 零行为改动). 保持
  jsonTile 历史行为: 忽略 TileLoadParams (第一参 _), 用 SourceTile.x/y/z
  生成 url 模板参数 + getCustomData 入参. 不设 tile.xhrCancel (原 jsonTile
  无取消逻辑)
- parser/jsonTile.ts (83 -> 30, -53): 删 getVectorTile 闭包 + 5 个相关
  import (getData / getURLFromTemplate / GeoJSONVTTileSource /
  MapboxVectorTile / RequestParameters 悉数下沉到 loader); import JsonTileLoader,
  构造 loader, getTileData 委托 loader.loadTile. default export 签名
  jsonTile(url, cfg) => IParserData 不变, registry 注册 (registerParser
  ('jsonTile', jsonTile) in builtins.ts) 零影响
- 新增 **tests**/loader/json-tile-loader.spec.ts (110 行, 6 tests): 文件级
  jest.mock('@antv/l7-utils') (getData / getURLFromTemplate), 首次为瓦片
  加载器建立单元测试网 (source 包此前 0 瓦片 parser/loader 单测). 6 case
  覆盖: getData 成功 (断言 getURLFromTemplate 入参 + getData URL 模板插值 +
  src.getTileData('defaultLayer') === features) / getData err / getData 空
  数据 / getCustomData 成功 (断言走 getCustomData 不走 getData + features) /
  getCustomData err / requestParameters 透传 headers

设计取舍:

- 接口签名 Promise<ITileSource | undefined> 而非 Promise<ITileSource>:
  mvt 的 getVectorTile 失败时 resolve undefined (与迁移前等价,
  tileset-manager 状态机已处理 undefined). 用 ITileSource 会让 mvt loader
  被迫改 resolve 空 tile (行为变更, 违反渐进等价原则). jsonTile loader 始终
  resolve ITileSource, Promise<ITileSource> 协变赋值给 Promise<ITileSource
  | undefined>, 零类型回归 (mvt 已是 | undefined 且 layers tsc 229 基线不变)
- jest.mock('@antv/l7-utils') 文件级 mock 而非 DI 注入 fetch:
  保持 loader 生产代码与抽取前 100% 字面等价 (直接 import getData /
  getURLFromTemplate), 测试通过 jest 模块 mock 注入桩. 避免 DI 让 loader 构造
  签名多一个 fetch 参数, 偏离「机械抽取」原则. mock 文件级隔离, 不影响其他
  spec
- getTileData 返回类型从 Promise<ITileSource> 扩宽到 Promise<ITileSource
  | undefined>: 经 mvt 已验证 | undefined 是 tilesetOptions.getTileData
  合法返回值, 扩宽后 layers tsc 229 基线不变. 运行时 jsonTile loader 始终
  resolve 非 undefined, 0 行为变化
- 下沉 5 个 import 到 loader, parser 只留 IParserData / ITileParserCFG /
  TileLoadParams / SourceTile 类型 import + JsonTileLoader:
  parser/jsonTile.ts 职责收敛为「组装 tilesetOptions 指向 loader」, 纯调度

向后兼容: jsonTile default export 签名 + registry 注册 + tilesetOptions
结构 ({...cfg, getTileData}) 全不变. 消费方 import { Source } from
'@antv/l7-source' 走 index.ts 自动注册, new Source({type:'jsonTile', ...})
行为与迁移前等价.

风险: 阶段 3.1 触及瓦片生命周期 ⚠️. source 包此前 0 瓦片 parser 单测,
本增量首次为 JsonTileLoader 建立单元测试网 (6 case 覆盖 fetch 成功/失败/
自定义数据 + 参数透传). 后续 MVTLoader / GeoJSONVTLoader 抽取 (3.1.2 /
3.1.3) 应沿用同 jest.mock('@antv/l7-utils') 模式补 loader 单测 (记 BACKLOG:
瓦片 parser/loader 单测覆盖缺口).

验证: source tsc 31 / layers tsc 229 / source jest 51/51 (旧 45 + 新 6
loader) / eslint / prettier 全通过.

详见 docs/refactoring/source/PROGRESS.md 阶段 3.1.1. 下一步阶段 3.1.2
MVTLoader 抽取 (含 tile.xhrCancel 取消语义).
