---
'@antv/l7-layers': minor
---

refactor(layers): introduce LayerConfigModel delegate converging config three-tracks (stage-3 3.1)

P4 阶段 3 第一刀（3.1，layers 侧，minor）。

把 BaseLayer 的「配置三轨」状态与读写收敛到新 delegate
`core/LayerConfigModel.ts`：

- `rawConfig`（ctor 入参快照，选择性同步：仅更新已存在键）
- `needUpdateConfig`（pre-init 缓冲 / post-init 写穿即清空）
- `configService` 读回（sceneConfig + defaultLayerConfig + 写入合并）

delegate 暴露 `read()` 单一读路径、`apply(patch)` 单一写路径、
`hasPending()` 供 `prepareBuildModel` 消费 diff 触发 flush。
`configService` 经 ctor 注入（BaseLayer 该字段为 `protected`，注入保持
BaseLayer 零可见性变更）。

BaseLayer 侧：

- 删 `protected rawConfig` / `private needUpdateConfig` 字段，单一真源
  统一经 `protected configModel`
- `getLayerConfig<T>()` → `return this.configModel.read<T>()`
- `updateLayerConfig(c)` → `this.configModel.apply(c)`
- `init()` 用 `this.configModel.rawConfig` 写穿 + 派生 layerType
- `prepareBuildModel()` 用 `this.configModel.hasPending()` 替
  `Object.keys(this.needUpdateConfig || {}).length`
- `ILayer.getLayerConfig<T>()` / `updateLayerConfig()` 公开签名零变更

先补 `config-tracks.spec.ts` 10 cases（commit 7689e78）锁定三轨可观测
契约，后接 delegate—数字节级镜像、运行时零行为变化。子类无直访
`rawConfig`（grep 已确认），字段移除对外透明。

验证：layers eslint 0 error、prettier 通过、layers father build
279 files（d.ts 生成、类型检查通过）、25 个非 GL 套件 158 passed
（含 `config-tracks` 10 cases 重跑全绿、encode-styles 等不破）。
