---
'@antv/l7-maps': patch
---

refactor(maps): lift on/off into BaseMap, dedupe adapter event binding

将具体 `on` / `off` 从 abstract 方法降级为 `BaseMap` 具体实现，背靠
四个可 override 的 protected 钩子；各适配器去重重复的 `evtCbProxyMap`
与事件绑定样板。内部重构，公开 API 与运行时行为不变。

- **P2b BaseMap on/off 提升**：新增
  `getEventMap()` / `buildProxy()` / `registerNative()` / `unregisterNative()`
  四个 protected 钩子（均有默认实现：getEventMap 返回空映射、buildProxy 做
  lngLat 归一化、register/unregister 委托 `this.map.on/off`）。`on` 走
  MapServiceEvent 分支（eventEmitter）或经 EventMap 解析后注册代理；
  `evtCbProxyMap` 以**原生 eventName** 为键（修复 tmap/tdtmap 历史以 L7 type
  为键导致 off 空操作的泄漏）。构造函数 container 改为可选以支持契约测试
  隔离实例化。激活 base-map-event 契约 spec 16/16。
- **P2c 适配器去重**：删除 bmap / tmap / tdtmap 各自重复的 `evtCbProxyMap`、
  `on`、`off`（及可删的 `once`），改为提供 `getEventMap()` override；tmap 额外
  override `registerNative`（mouseover 走 container.addEventListener，off 不解绑
  container——历史 quirk）；tdtmap 额外 override `buildProxy`（注入
  `args[0].map = this.map`）。共删 ~195 行重复样板。
- **P2d mapbox 字段去重**：删除 `mapbox-base-map.ts` 重复声明的
  `evtCbProxyMap` 字段，继承 BaseMap。mapbox 系保留自身 `on/off`（模块级
  EventMap + try/catch 吞错 + 无 lngLat 归一化），本轮不并入 DRY。

详见 commits c0822d5 / c842114 / 5fd57fc（P2a 契约 spec 4072b07 为纯测试，
不单列 changeset）。验证：maps eslint 0 error、prettier --check 通过、
father build 89 files、jest 36 suites / 462 passed（含 base-map-event 16），
layers jest 40 suites 绿（无回归）。
