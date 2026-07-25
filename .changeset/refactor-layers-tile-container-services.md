---
'@antv/l7-layers': patch
---

refactor(layers): dedupe BaseTileLayer container services via parent.getContainer (stage-5 5.2)

P4 阶段 5 第二刀（5.2，layers 侧，patch）。

`BaseTileLayer`（tile/core）原先在 ctor 缓存父图层容器的 4 个服务
副本（`mapService`/`layerService`/`rendererService`/`pickingService`），
与父级 `ILayer.getContainer()` 已持有的引用构成双份缓存。收敛为：

- `mapService`/`layerService`/`rendererService` 三个 protected 字段
  改为 protected getter，统一经 `this.parent.getContainer()` 解析
  （`getContainer(): L7Container` 非可选，类型安全）。使用点语法
  不变（`this.mapService.on(...)` 等），仅声明形态变化。
- 移除死字段 `pickingService`：存储后无任何读取（`TilePickService`
  自行从 `container.pickingService` 取用），属纯死代码清理。
- ctor 同步精简（去掉 `const container` 局部与 4 行赋值）。

`BaseTileLayer` 无子类（仅 `Scene.initTileLayer` 直接 `new`），
protected → getter 的可见性收紧安全。运行时零行为变化：getter
返回值与原缓存字段指向同一容器服务实例（容器引用在图层生命周期
内稳定）。

注：PLAN 原述「5 个」含 `pickingService` 死字段，实际收敛 3 个
有效服务 + 清理 1 个死字段。

验证：layers eslint 0 error、prettier 通过、layers father build
279 files、scene father build 66 files（d.ts OK）、非 GL jest 子集
25 suites / 158 passed 与基线一致。
