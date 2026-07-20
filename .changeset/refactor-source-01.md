---
'@antv/l7-source': patch
---

refactor(source): dedupe interface types with @antv/l7-core via re-export

将 source/interface.ts 中与 @antv/l7-core 重复的 7 个类型改为 re-export，
单一来源收敛到 core。纯 type-only 变更，运行时无影响。

- 重复类型：DataType / IDictionary / IFeatureKey / IJsonData / IJsonItem /
  IParseDataItem / IParserData
- 保留 source 专有类型原地定义（栅格波段运算、瓦片数据源等）
- IRasterCfg 因 core 版本不完整暂保留，后续统一

详见 docs/refactoring/source/PROGRESS.md 阶段 0.1。
