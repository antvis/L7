---
'@antv/l7-source': minor
---

refactor(source): extract registerBuiltins() + tighten sideEffects whitelist (stage 2.4)

把 index.ts 顶层 13 registerParser + 6 registerTransform 收敛为
单一 registerBuiltins(registry = defaultRegistry) 函数; package.json
sideEffects 从 true 收紧为白名单 ["./es/index.js"] (沿用 packages/layers
约定). 对外 API 完全等价, 默认 import { Source } 仍自动注册全 13 内置
parser, 运行期 0 行为变化.

- 新增 builtins.ts (74): export function registerBuiltins(registry:
  ParserRegistry = defaultRegistry): void, 13 parser + 6 transform
  集中注册; 参数默认 defaultRegistry 单例, 传自定义 new ParserRegistry()
  可隔离注册表 (按需子集化 / 测试隔离)
- index.ts (57 -> 29, -28): 删 13 parser default import + 6 transform
  named import (下沉 builtins.ts), 保留 rasterDataTypes named import
  (包公共 re-export); 19 行 registerParser/registerTransform 收敛为
  单行 registerBuiltins(); export 块新增 registerBuiltins
- package.json: "sideEffects": true -> ["./es/index.js"]. 仅 index
  入口标副作用, 其余子路径 (es/parser-registry.js, es/builtins.js,
  es/parser/*.js 等) 对 bundler 视作 tree-shakeable
- **tests**/parser-registry.spec.ts (+3 tests): registerBuiltins
  在 fresh registry 上注册全 13 + 6; 无参默认走 defaultRegistry 幂等;
  fresh registry 与单例独立 (not.toBe)

设计取舍:

- 偏离 PLAN 字面 sideEffects: false, 改用白名单 ["./es/index.js"]:
  index.ts 模块顶层仍调 registerBuiltins() 写入 defaultRegistry 单例,
  设 false 是对 bundler 撒谎, 会致 registerBuiltins() 被 tree-shake,
  new Source({type:'csv'}) 在消费方抛 ParserNotFoundError (致命回归).
  白名单既保 index.ts 副作用被尊重 (零行为回归), 又明示其余子路径
  tree-shakeable. 沿用 packages/layers 既有约定 (同场景同方案).
  严格 sideEffects: false 需移除 index.ts 自动注册, 破坏
  import { Source } 零配置契约, 与对外 API 完全兼容原则相悖,
  留未来 major 版本评估 (BACKLOG)
- registerBuiltins 独立 builtins.ts 而非并入 parser-registry.ts:
  parser-registry.ts 保持 registry 机制单一职责 (97 行: class +
  2 错误类); builtins.ts 依赖全部 13 parser + 6 transform 实现,
  职责分离让 parser-registry.ts 不被 19 import 污染, 保持子路径
  import 时 tree-shake 友好 (消费方经 @antv/l7-source/es/parser-registry
  拿 ParserRegistry 时不被迫拉满 13 parser)
- registerBuiltins 不放 factory.ts: factory.ts 是 defaultRegistry
  薄转发 wrapper 弃用入口 (4 函数均 @deprecated), 把依赖 13 parser
  实现的 registerBuiltins 放进去破坏 thin wrapper 定位且让 factory.ts
  不再 tree-shakeable. 从 index.ts 直接 re-export ./builtins 更清晰
- 保留 export { registerParser, registerTransform } from './factory':
  阶段 2.5 createSource 工厂落地前, 外部仍可能 registerParser('custom',
  fn) 注册自定义 parser 到 defaultRegistry (旧 API), 保留兼容入口

向后兼容: 默认 import { Source } from '@antv/l7-source' 触发 index.ts
副作用调用 registerBuiltins() 自动注册全 13 内置 parser, 与迁移前
等价. monorepo grep 6 处 @antv/l7-source import 全走默认入口 (无子路径),
0 风险. tree-shaking 真正收益仅在消费方不走 index.ts/builtins.ts,
自行 new ParserRegistry() + 手工 registerParser 子集时获得; 阶段 2.5
createSource(data, cfg, registry?) 工厂落地后此模式成为对外正式能力.

验证: source tsc 31 / layers tsc 229 / l7 tsc 346 全基线不变 (全 core
.glsl 噪音, 无 source/src/{index,builtins,factory,parser-registry}.ts
新错), eslint/prettier 通过, source jest 40/40 通过 (旧 37 + 新 3).

详见 docs/refactoring/source/PROGRESS.md 阶段 2.4. 下一步阶段 2.5
createSource(data, cfg, registry?) 工厂可选注入 registry.
