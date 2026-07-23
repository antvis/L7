---
'@antv/l7-source': patch
---

refactor(source): extract TilesetAdapter delegate from base-source (stage 1.2)

从 base-source.ts 抽出瓦片管理职责到独立 TilesetAdapter delegate，
对外 API 完全等价（ISource 接口不动）。

- 新增 src/tileset-adapter.ts (88 行): 封装 TilesetManager 实例的
  创建/更新/销毁 + 7 个 reload/getTile 转发方法
- base-source.ts (314 -> 306, -8):
  - tileset/isTile 字段 -> getter 转发 adapter.manager/.isTile
  - 删除 initTileset(), executeParser 改调 tilesetAdapter.init
  - 7 个 reload*/getTile* 方法实现体改为转发 adapter
  - destroy 改调 tilesetAdapter.destroy

关键设计: adapter.manager 必须 public —— layers/tile/core/BaseLayer.ts
直接读 source.tileset as TilesetManager 后自由操作实例 (update/on/
destroy/tiles.filter/currentTiles)。getter 转发 adapter.manager
让 layers 拿到同一个 TilesetManager 实例, 行为完全等价。

tileset/isTile 从字段改 getter only: ISource 接口字段契约由 getter
满足；Source 内部不再写 this.tileset/this.isTile (改调 adapter.init)。
isTile 不主动重置, 与原 initTileset 行为一致。reloadTilebyId 沿用
原小写 b 拼写避免破坏接口。

验证: source tsc 0 错 (基线 31 不变), layers tsc 229 pre-existing
无新增, eslint/prettier 通过, source jest 27/27 通过, source+layers
jest 81 passed/1 skipped/0 failed (瓦片图层运行时路径覆盖)。

详见 docs/refactoring/source/PROGRESS.md 阶段 1.2。
