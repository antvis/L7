---
'@antv/l7-source': patch
---

refactor(source): rename source/ to tile-source/ and rename classes (stage 0.6)

重命名 `src/source/` 目录为 `src/tile-source/`（实为「瓦片数据源」)，
两个同名 `VectorSource` class 拆分为语义清晰的名字，对外 API 完全兼容：

- `git mv` 保留历史:
  - source/vector.ts -> tile-source/mvt.ts, class VectorSource -> MVTSource
  - source/geojsonvt.ts -> tile-source/geojsonvt.ts, class VectorSource -> GeoJSONVTTileSource
  - source/index.ts -> tile-source/index.ts (重写为兼容别名导出)
- `git rm source/baseSource.ts`（抽象类死代码, 无继承者）
- tile-source/index.ts: 导出 MVTSource / GeoJSONVTTileSource，
  保留 `VectorSource` 作 @deprecated 兼容别名 (= MVTSource)
- src/index.ts: export * from './tile-source/index'
- 3 个 parser (mvt/geojsonvt/jsonTile) 更新 import 路径与 new 的类名

兼容性:

- layers 包 `import type { VectorSource } from '@antv/l7-source'`
  (packages/layers/src/tile/tile/VectorTile.ts) 经兼容别名仍可用, 零改动
- VectorSource 正式移除留待阶段 7 (届时同步 layers 改用 MVTSource)

验证: source tsc 0 错(基线 31 不变)、layers tsc 229 pre-existing 无新增、
prettier 通过、jest 27/27 通过。

详见 docs/refactoring/source/PROGRESS.md 阶段 0.6。
