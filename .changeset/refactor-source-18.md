---
'@antv/l7-source': minor
---

refactor(source): Source.stats() 只读快照 + ISourceStats 类型（阶段 6.4）

新增 `Source.stats(): ISourceStats` 只读快照方法，收敛原本分散在 `data.dataArray.length` /
`extent` getter / `getParserType()` / `tileset.currentTiles` 四处的调试与 size 监控信息为一次调用：

- `ISourceStats` 7 字段：`rows` / `bbox` / `parserType` / `tileCount` / `isTile` / `cluster` /
  `dataVersion`。类型经 `export * from './interface'` 由包入口透出。
- 纯只读，不改 Source 状态；init 未完成 / 取数未触发时用 `?? 0` / `|| 'geojson'` 兜底，仅返回默认值。
- 纯增量 API，未触及 ISource 核心契约，未加 deprecation，对 new Source / Source.create / setData
  路径零行为变化。

详见 docs/refactoring/source/PROGRESS.md 阶段 6.4。
