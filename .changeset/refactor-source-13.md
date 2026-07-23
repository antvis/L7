---
'@antv/l7-source': patch
---

refactor(source): getParser/getTransform throw on unregistered (stage 2.3)

getParser/getTransform 未注册时改抛 ParserNotFoundError /
TransformNotFoundError (替代迁移前返回 undefined -> 调用方残报
TypeError 的延迟语义). 对已注册路径 0 影响, 对外签名保持
Parser / TransformFn 不带 | undefined, 调用方链式调用零变更.

- parser-registry.ts (45 -> 97):
  - 新增 ParserNotFoundError extends Error (含 readonly type 字段,
    name='ParserNotFoundError'), 仿 utils/ajax.ts 的 AJAXError 风格
    (target es6 下 extends Error 原型链无需 setPrototypeOf 修补)
  - 新增 TransformNotFoundError extends Error: 与 ParserNotFoundError
    对称, 覆盖 transform 注册表等价错误路径
  - getParser(type): 内部取 Record<string,Parser>[type] (运行期可能
    undefined), undefined 即抛 ParserNotFoundError(type); 签名保持
    : Parser (不带 | undefined) - 抛错路径由 Error 表达, 调用方
    仍可链式 getParser('geojson')({...}) 无 null 守卫
  - getTransform(type): 对称抛 TransformNotFoundError(type),
    签名保持 : TransformFn
- factory.ts (37 -> 45): export 块新增 ParserNotFoundError /
  TransformNotFoundError, 4 个 @deprecated wrapper 经
  defaultRegistry 转发自动享受抛错语义, 无函数体改动
- index.ts (55 -> 57): export 块新增两个错误类, 包入口暴露
  (消费方可 catch e instanceof ParserNotFoundError)
- 新增 **tests**/parser-registry.spec.ts (100 行 / 10 tests):
  fresh new ParserRegistry() 抛 ParserNotFoundError /
  TransformNotFoundError (含 name/type/message/instanceof Error
  断言); registerParser/registerTransform 后 getParser/getTransform
  返回原引用; defaultRegistry (import '../src' 触发 index.ts 副作用)
  含全部 13 parser + 6 transform, 未注册 type 抛命名错误

设计取舍:

- 偏离 PLAN 字面方案 (getParser 返 Parser | undefined 配合 orThrow):
  或版本会要求调用方加 null 守卫, 破坏 cluster-manager.ts:102
  getParser('geojson')({...}) 与 base-source.ts:266/288 链式调用,
  与严格行为等价相悖. 改为 getParser 直接抛错签名保持 Parser:
  未注册路径由 Error 表达 (替代旧 undefined -> TypeError),
  已注册路径 0 影响, tsc 链式推断全友好. Parser | undefined +
  tryGet* 变体若后续真有探测需求再加, 本阶段不预留 API surface (YAGNI)
- TransformNotFoundError 单独定义而非复用: parser 与 transform 是
  两条独立注册表, 错误类型隔离便于 catch 精确分支处理, 不牺牲复杂度
- 错误类放 parser-registry.ts 而非新 errors.ts: 当前 source 包仅
  此一个领域错误, 独立 errors.ts 过度分层; 后续 Source 层引入更多
  领域错误再抽 errors.ts 收口 (BACKLOG 跨阶段评估)

向后兼容: 迁移前未注册 parser 在 base-source/cluster-manager 调用链
下表现为 undefined(...) -> TypeError: xxx is not a function
(运行期延迟报错); 迁移后改抛命名 ParserNotFoundError (注册表边界
即时报错). 正常使用 (已注册 13 内置 type) 0 影响, jest 27/27 既有
测试全过即证. grep l7 monorepo 无第三方依赖 getParser(unknown) 返
undefined 做能力探测的用法.

验证: source tsc 31 基线不变, layers tsc 229 不变,
eslint/prettier 通过, source jest 37/37 通过 (旧 27 + 新 10).

详见 docs/refactoring/source/PROGRESS.md 阶段 2.3. 下一步阶段 2.4
sideEffects: false + registerBuiltins() 抽取 index.ts 副作用.
