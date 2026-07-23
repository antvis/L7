---
'@antv/l7-source': patch
---

refactor(source): fix misspellings in private members (stage 0.2)

私有方法/局部参数重命名，无对外 API 影响：

- base-source.ts: excuteParser → executeParser (private)
- base-source.ts: caculClusterExtent → calcClusterExtent (private)
- factory.ts: registerTransform 参数 transFunction → transformFn
  （改为 transformFn 而非 transformFunction，避免与已有类型别名同名遮蔽）

详见 docs/refactoring/source/PROGRESS.md 阶段 0.2。
