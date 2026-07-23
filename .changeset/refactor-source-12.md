---
'@antv/l7-source': patch
---

refactor(source): extract ParserRegistry class + defaultRegistry singleton (stage 2.2)

将 factory.ts 模块级 PARSERS/TRANSFORMS 可变对象抽到
ParserRegistry class + defaultRegistry 单例. 对外 API 完全等价,
旧 getParser/registerParser/getTransform/registerTransform
4 函数保留为 defaultRegistry 薄转发 wrapper (加 @deprecated).

- 新增 parser-registry.ts (45 行):
  - ParserRegistry class 持有 parsers/transforms 两个
    Record<string, X> 私有字典 (替代旧模块级可变对象)
  - 公开方法: registerParser / registerTransform /
    getParser / getTransform
  - getParser 返回 Parser (不带 | undefined): 与迁移前
    PARSERS[type] 在 noUncheckedIndexedAccess: false 下语义一致
    调用方仍可链式 getParser('geojson')({...}), 无 null 守卫回归
  - 导出 defaultRegistry: ParserRegistry = new ParserRegistry()
    单例, 由 index.ts 模块初始化时注册内置 parser/transform
- 重写 factory.ts (47 -> 37 行):
  - 删除内部 PARSERS/TRANSFORMS 字典与字面量私有类型
  - 4 函数保留为 defaultRegistry 的 @deprecated 转发 wrapper
  - export { ParserRegistry, defaultRegistry } from
    './parser-registry' 让消费者从 factory 入口也可拿到 class
- index.ts (46 -> 55 行): 单行 export 改多行 export 块,
  显式 re-export ParserRegistry 与 defaultRegistry, 外部可从
  @antv/l7-source 包入口拿到这两个新 API

设计取舍:

- 用对象字典而非 Map: Map.get() 返 T | undefined 会破坏
  getParser(type)(arg) 链式调用, Record<string, X> 在
  noUncheckedIndexedAccess: false 下保持原 X 不带 undefined
- PARSERS 与 TRANSFORMS 合并到一个 class: registry 边界统一,
  阶段 2.5 createSource(data, cfg, registry?) 工厂可注入单个
  registry 同时承载 parser/transform
- TransformFn 保持字面量类型 (data, cfg?) => IParserData,
  Transform<TIn,TCfg,TOut> 契约抽取留阶段 2.x (BACKLOG)
- 保留 getParser(type): Parser 不返 | undefined: 阶段 2.3 才
  改抛 ParserNotFoundError, 本阶段严格行为等价

验证: source tsc 31 基线不变 (全 core .glsl 噪音),
layers tsc 229 不变, eslint/prettier 通过,
source jest 27/27 通过 (factory 运行期经 index.ts 仍正确注册
内置 parser/transform 到 defaultRegistry 单例, 调用路径不变).

详见 docs/refactoring/source/PROGRESS.md 阶段 2.2. 下一步阶段 2.3
ParserNotFoundError + getParser 未注册改抛错.
