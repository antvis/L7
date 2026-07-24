# @antv/l7-layers 重构路线图

> 起始：2026-07-24 ｜ 工作分支：`refactor/layers-progressive`

## 1. 现状诊断

### 1.1 包结构（`packages/layers/src/`）

```
core/            BaseLayer.ts(1510) — God class，实现 ~140 成员的 ILayer 接口
                 BaseModel.ts(471)   — 模型基类
                 CommonStyleAttribute.ts(130)
                 LayerPickService.ts(118) — 拾取服务（已部分抽出）
                 TextureService.ts(77)    — 图层纹理服务（已抽出）
                 triangulation.ts(684) / line_trangluation.ts(149)
                 interface.ts(347) / schema.ts(28) / constant.ts(22) / utils.ts(45)
plugins/         14 个 ILayerPlugin（DataMapping/DataSource/FeatureScale/LayerAnimateStyle/
                 LayerMask/LayerModel/LayerStyle/Lighting/MultiPassRenderer/PixelPicking/
                 RegisterStyleAttribute/ShaderUniform/UpdateModel/UpdateStyleAttribute）合计 ~1500 行
tile/core/       BaseLayer.ts(285) — BaseTileLayer（组合 parent ILayer，非继承）
                 TileDebugLayer.ts(18)
point/ line/ polygon/ raster/ heatmap/ image/ mask/ earth/ canvas/
citybuilding/ geometry/ — 12 个具体图层 extends BaseLayer（各自只 override 少量方法）
```

机制现状（已具备的扩展点，重构须充分借用、不推翻）：

- **插件系统**：`ILayerPlugin { apply(layer, container): void }`，`BaseLayer.init()` 内 `createPlugins()` 硬编码实例化 14 插件后逐个 `apply`。
- **tapable-style hooks**：`hooks` 对象含 13 个钩子（init/afterInit/beforeRender/beforeRenderData/afterRender/beforePickingEncode/afterPickingEncode/beforeHighlight/afterHighlight/beforeSelect/afterSelect/beforeDestroy/afterDestroy），插件在 `apply` 内订阅。
- **容器 DI**：11 个 `protected get xxxService()` 懒解析 `container.xxxService`。
- **已抽出的服务**：`LayerPickService`、`TextureService` 已是独立类，BaseLayer 持有引用——是 delegate 化的先例。

### 1.2 核心问题（按严重度排序）

| #   | 严重度 | 问题                            | 证据                                                                                                                                                                                                                                                                                                                                                        |
| --- | ------ | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | P0     | `BaseLayer.ts` 是 God Class     | 1510 行、约 86 个方法/getter，一个类同时承担：配置/身份、11 个容器服务懒解析、数据源、流式样式 API、样式属性内部状态、scale/legend、模型/渲染管线、picking/交互状态、mask、可见性/zoom、animate、相对坐标、纹理、生命周期——实现约 140 成员的 `ILayer` 接口                                                                                                  |
| 2   | P0     | 角色过度集中，无内部边界        | picking 状态（`pickedFeatureID/selectedFeatureID/currentPickId/needPick` 及 6 个 set/get）+ active/select/highlight + `hooks.beforeHighlight/beforeSelect.then(()=>setTimeout(reRender,1))` 魔法延迟散落在 766–877 与 1244+；相对坐标 5 字段（`relativeOrigin/originalExtent/absoluteDataArray` + 3 getter + `processRelativeCoordinates`）内联在渲染层基类 |
| 3   | P1     | `any` 泛滥、类型缺失            | `getLayerConfig<T=any>()` 返 `any`（全文件 22 处 `@ts-ignore`）；`defaultSourceConfig.data: any[]`；`sourceOption.data: any`；`shapeOption.field/values: any`；`tileLayer: any`；`get(name): number`（实返 `any`）；`getScale(name): any`；`encodeStyleAttribute: Record<string, any>`                                                                      |
| 4   | P1     | 渲染入口分散且命名不一致        | `render`(719)/`renderModels`(1276)/`renderMultiPass`(731)/`renderMulPass`(727)/`renderLayers`(710)/`prerender`(717 空体) 六个渲染相关方法；multipass 与 single-pass 路径交织；`renderMulPass(multiPassRenderer)` public 但**不在 `ILayer` 接口**（仅 `renderMultiPass()` 在），二者命名仅 Mul↔Multi 之差                                                    |
| 5   | P1     | 初始化副作用内联 + 事件泄漏     | `createPlugins()` 在 `init()` 内硬编码实例化 14 插件，无法外部替换/排序/测试隔离；`init()` 内 `this.mapService.on('mapAfterFrameChange', () => this.renderLayers())` 匿名注册，`destroy()` **不解绑**（destroy 仅 `layerSource.off` + `removeAllListeners`，未 off mapService）→ 销毁后回调悬空                                                             |
| 6   | P1     | 配置三轨、真相源不清            | `rawConfig`（原始）/ `needUpdateConfig`（待应用）/ `getLayerConfig()`（从 `globalConfigService` 读回）三处配置；`updateLayerConfig` 合并 + `prepareBuildModel` 读 `needUpdateConfig`，实际生效路径需跨 `configService` 追踪                                                                                                                                 |
| 7   | P2     | 交互 / 动画 / 可见性状态机零散  | animate 状态（`animateOptions/animateStartTime/animateStatus` + `getTime/setAnimateStartTime/stopAnimate/getLayerAnimateTime`）散布 200/242–244/1223–1240；可见性/zoom（`show/hide/setIndex/setMinZoom/setMaxZoom/isVisible/setAutoFit/fitBounds`）混在主类                                                                                                 |
| 8   | P2     | scale/legend 读取逻辑内联       | `getLegendItems` 的 `invertExtent`/`ticks`/`domain` 三分支分类法硬编码在 BaseLayer，与样式属性服务职责重叠                                                                                                                                                                                                                                                  |
| 9   | P2     | 相对坐标关注点渗入渲染层基类    | 状态仍以 5 字段散在 BaseLayer（`processRelativeCoordinates` 已自 `@antv/l7-utils` 取函数，见 source PLAN 5.2；但状态管理未收敛）                                                                                                                                                                                                                            |
| 10  | P3     | 死代码 / 注释残留 / 占位实现    | 注释掉的 `ConfigSchemaValidationPlugin`(plugins/index.ts) / `tileLayer = new TileLayer`(425) / 旧 config 注释(367)；`setEarthTime()` 仅 `console.warn('empty fn')` 占位；`prerender(){}` 空体                                                                                                                                                               |
| 11  | P3     | `BaseTileLayer`(tile/core) 重复 | 285 行重新解析 5 个容器服务（`mapService/layerService/rendererService/pickingService/tileLayerService`），与 BaseLayer 11 个 getter 重复；`tileLayer: any` 无类型，BaseLayer↔BaseTileLayer 边界弱（组合关系仅靠 `parent` 引用）                                                                                                                             |
| 12  | P3     | 测试覆盖薄                      | BaseLayer 无直接 spec，全靠 12 个具体子类间接覆盖；delegate 提取后缺独立验证手段；`enableShaderEncodeStyles/enableDataEncodeStyles` 编码开关无 spec                                                                                                                                                                                                         |

---

## 2. 重构路线图

> 总原则（沿用 source PLAN）：**对外 API 完全向后兼容**。`ILayer` 接口与本包公共导出不动；内部重构用 delegate 组合 + getter/方法别名转发；插件系统与 hooks 不推翻，只强化。每阶段先跑现有 spec 再改行为。

### 阶段 0 — 低风险清理（无行为变更）

| 步骤 | 动作                                                                                                                                                                                                                             | 状态 |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| 0.1  | 删死代码/注释：plugins/index.ts 注释 import、BaseLayer:425 `tileLayer=new TileLayer` 注释、367 旧 config 注释、248 `pickingPassRender` 注释字段                                                                                  | ☑    |
| 0.2  | 命名收口：`renderMulPass`（1272，public 但不在 ILayer）本轮标 `@deprecated` + JSDoc 区分（非破坏）；实际可见性/命名收敛留阶段 4；`renderMultiPass()` 保留为 public 入口                                                          | ☑    |
| 0.3  | 收敛 `@ts-ignore`：本轮安全消除动态键/兼容属性 8 处（**22→14**）；剩 14 处（`splitValuesAndCallbackInAttribute`+scale shape / `@antv/async-hook` call-thenable / `isTileLayer` 动态属性 / triangulation）随阶段 1 delegates 收口 | ☐    |
| 0.4  | `dataState`/`defaultSourceConfig`/`sourceOption`/`shapeOption` 从内联字面量抽到 `core/interface.ts` 已有类型，统一引用而非散落字面量                                                                                             | ☐    |
| 0.5  | 占位方法加默认实现 JSDoc：`setEarthTime`/`prerender`/`processData` 标注「子类可选 override」约定                                                                                                                                 | ☑    |

### 阶段 1 — 拆解 God Class（内部 delegate，对外透明）

`BaseLayer` 持有 delegate，**所有 `ILayer` 公开成员保留**（方法体改为转发 delegate），子类 override 路径不变：

| 步骤 | delegate              | 封装内容（搬出约）                                                                                                                                                                                                         | 参考先例                                                         |
| ---- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 1.1  | `LayerStyleFluent`    | 流式 API（`color/size/shape/texture/rotate/filter/label/style/scale/animate/active/select` → `return this`）+ `pendingStyleAttributes` 注册 + `encodeStyle` + `splitValuesAndCallbackInAttribute`（~200 行）               | plugin 已吃一半，本步收口方法体                                  |
| 1.2  | `LayerModelManager`   | `models[]/layerModel/buildLayerModel/buildModels/rebuildModels/initLayerModels/createAttributes/updateModelData/prepareBuildModel/clearModels/uniformBuffers/getPickingUniformBuffer` + blend/`BlendTypes`（~250 行）      | —                                                                |
| 1.3  | `LayerPickingManager` | `pick/boxSelect/active/setActive/select/setSelect` + `pickedFeatureID/selectedFeatureID/currentPickId/needPick` + set/get + `hooks.beforeHighlight/beforeSelect` 编排 + `setTimeout(reRender,1)` 收敛为可读调度（~150 行） | `LayerPickService` 已抽出（picking 委托），本步收口**状态+编排** |
| 1.4  | `LayerRelativeCoords` | `relativeOrigin/originalExtent/absoluteDataArray/processRelativeCoordinates/getAbsoluteData/getRelativeOrigin/getOriginalExtent`（~50 行，函数已 `@antv/l7-utils`）                                                        | —                                                                |
| 1.5  | `LayerAnimateState`   | `animateOptions/animateStartTime/animateStatus/getTime/setAnimateStartTime/stopAnimate/getLayerAnimateTime`（~40 行）                                                                                                      | —                                                                |
| 1.6  | `LayerScaleLegend`    | `scaleOptions/getScaleOptions/getScale/getLegend/getLegendItems`（`invertExtent/ticks/domain` 三分支分类法，~80 行）                                                                                                       | —                                                                |
| 1.7  | `LayerMaskManager`    | `addMask/removeMask/disableMask/enableMask/addMaskLayer/removeMaskLayer` + `masks[]`（~50 行）                                                                                                                             | —                                                                |
| 1.8  | `LayerVisibilityZoom` | `show/hide/setIndex/setMinZoom/setMaxZoom/getMinZoom/getMaxZoom/isVisible/setAutoFit/fitBounds`（~90 行）                                                                                                                  | —                                                                |
| 1.9  | `LayerSourceState`    | `source/setData/setSource/getSource/sourceOption/defaultSourceConfig/layerSource/processData/dataState` + `sourceEvent/onSourceUpdate` 监听（与 `DataSourcePlugin` 边界厘清：plugin 管初始化，delegate 管状态）（~120 行） | —                                                                |

收益：`BaseLayer.ts` 从 1510 行降到 ~450 行的「协调者」——只保留身份/配置、`init/destroy` 生命周期编排、hooks 对象、container DI getters、`render` 总入口、delegate 实例化与转发。

> ⚠️ 顺序：1.3（picking）/1.7（mask）/1.8（visibility）风险最低先做；1.1（style fluent）与 plugin 重叠最多，需配合阶段 2，可放后；1.2（model manager）触及 `buildLayerModel` 子类高频 override 点，放最后并重点回归。

### 阶段 2 — 插件机制现代化与容器服务收敛

- 2.1 `createPlugins()` 从 `init()` 内联 → 抽 `LayerPluginRegistry`（默认注册内置 14 插件，支持外部追加/替换/排序），`BaseLayer.plugins` 来自 registry。旧全局 `createPlugins` 作 deprecation wrapper（参考 source `ParserRegistry` 模式）。
- 2.2 `ILayerPlugin` 补可选元数据：`name?: string` / `order?: number` / `initStage?: 'init'|'afterInit'`，便于声明式排序与调试（`addPlugin` 现仅 push 无序）。
- 2.3 11 个 `protected get xxxService()` 懒 getter 收敛为一个 `protected services: LayerServices` 访问器对象（仍懒解析，零行为变化），减少 11 段重复样板；同时供 delegate 共享同一引用。
- 2.4 修复阶段 1.2 发现的事件泄漏：`mapService.on('mapAfterFrameChange')` 匿名回调解构为具名方法 + `destroy()` 内 `mapService.off(...)`（strictly-better，零接口变化）。

### 阶段 3 — 配置模型与类型强化

- 3.1 定义 `LayerConfigModel` 收敛三轨：`rawConfig`（入参快照）/ `needUpdateConfig`（diff 暂存）/ `getLayerConfig()`（`globalConfigService` 读回）→ 统一为 `LayerConfigModel.read()` 单一读路径 + `apply(patch)` 单一写路径，`prepareBuildModel` 消费 diff。`ILayer.getLayerConfig<T>()` 签名不变。
- 3.2 给 `defaultSourceConfig/sourceOption/shapeOption/encodeStyleAttribute` 补严格类型（替 `any`）：引入 `ILayerSourceOption/IShapeOption/IEncodedStyleMap`，`get(name)`/`getScale(name)` 标泛型或返回联合类型。
- 3.3 `enableShaderEncodeStyles/enableDataEncodeStyles: string[]` → 收敛为 `encodeStyles: Map<string,'shader'|'data'>`（内部），公开数组 getter 保留过渡；补 spec 锁定编码开关行为。

### 阶段 4 — 渲染管线收敛

- 4.1 厘清 6 入口：`render()`（总入口，分流 tile/multipass/single）→ `renderModels()`（single-pass model.draw）+ `renderMultiPass()`（multipass 编排）；`renderMulPass`（阶段 0.2 已改名/降级）收为 `renderMultiPass` 内部助手；`renderLayers()`/`prerender()` 边界文档化。
- 4.2 `multiPassRenderer/postProcessingPassFactory/normalPassFactory` 初始化收敛到 `LayerModelManager`（阶段 1.2），消除 `init()` 与 `setMultiPass()` 两处分散初始化。
- 4.3 `renderModels` 的 `encodeDataLength <= 0 && !forceRender` 空数据早退逻辑（1277）下沉到 manager 并加 spec（当前仅 TODO 注释保护 texture 超限）。

### 阶段 5 — 瓦片/子图层边界理顺

- 5.1 `tileLayer: any` → `IBaseTileLayer`（`ILayer` 已声明 `tileLayer: IBaseTileLayer`，实现层却写 `any`，直接对齐）。
- 5.2 `BaseTileLayer`(tile/core, 285) 的 5 个重复容器服务 getter 改为复用 `parent.getContainer()` 统一解析路径（与阶段 2.3 `LayerServices` 协同）。
- 5.3 `layerChildren/isTileLayer/tileMask` 子图层关系文档化 + `addSubLayer/removeSubLayer` 路径统一（当前 `layerChildren` 仅 `destroy` 时遍历，无 add 入口规范化）。

### 阶段 6 — 测试 & 文档（持续）

- 6.1 为每个 delegate（1.1–1.9）补独立 spec（mock container + 插件），不再仅靠子类间接覆盖。
- 6.2 交互编码开关（`enableShaderEncodeStyles/enableDataEncodeStyles`）补 spec，锁定 shader/data 编码分流。
- 6.3 相对坐标、animate 状态机补纯单测（已从 `@antv/l7-utils` 解耦，可脱离 map 测试）。
- 6.4 `BaseLayer` 的 delegate 转发用「接口契约 spec」模式（类似 maps `base-map-event.spec.ts`）锁定对外透明。

### 阶段 7（可选, 长期）— API 演进

- 7.1 在 `ILayer` 上做能力拆分接口（`IStyleable/IPickable/IAnimateable/IMaskable/IRelativeCoords`），`BaseLayer implements` 全部，子类可按需收窄（minor-safe，纯叠加）。
- 7.2 事件对齐：`BaseLayer extends EventEmitter<LayerEventType>` 与 `ILayer` 声明的 `on/off/emit/once` 统一签名（当前 `emit(type, handler)` 第二参语义实为 payload，命名误导）。
- 7.3 `BaseModel`(471) 拆解评估：`BaseModel` 与 `LayerModelManager` 职责重叠（uniform/blend/stencil/textures 在两处），长期合并或明确分层。

---

## 3. 优先级矩阵

| 阶段            | 风险                                           | 收益                     | PR 数 | 建议周期 |
| --------------- | ---------------------------------------------- | ------------------------ | ----- | -------- |
| 0 清理          | 极低                                           | 命名/类型/死代码一致     | 2–3   | 3–5 天   |
| 1 拆 God Class  | 低–中（internal delegate，子类 override 点多） | 可读性 / 可维护性 / 可测 | 5–8   | 2–3 周   |
| 2 插件/服务收敛 | 中                                             | 可替换 / 可测 / 修泄漏   | 2–3   | 1–2 周   |
| 3 配置/类型     | 中                                             | 类型安全 / 真相源单一    | 2     | 1 周     |
| 4 渲染管线      | 中高（渲染 hot path）                          | 渲染路径可读 / 可测      | 2     | 1–2 周   |
| 5 瓦片/子图层   | 低–中                                          | 边界清晰 / 去重          | 1–2   | 1 周     |
| 6 测试/文档     | 低                                             | 覆盖率                   | 持续  | 持续     |
| 7 API 演进      | 高                                             | 长期扩展                 | 多    | 季度级   |

---

## 4. 风险与缓解

1. **API 兼容**：阶段 0–5 全程保留 `export default BaseLayer`、12 子类 `extends BaseLayer` 路径、`ILayer` 接口。delegate 用组合，`BaseLayer` 上保留同名 public 方法转发（`return this` / `return this.delegate.xxx()`）。每个 PR 加 `@deprecated` 注释而非直接删。
2. **子类 override 点**：`buildLayerModel/buildModels/processData/getModelType/getDefaultConfig/setEarthTime` 等被 12 子类大量 override。阶段 1.2（model delegate）必须保留这些为 `protected` 虚方法**而非** delegate 私有方法，子类 override 路径零改动。回归用 12 子图层现有 spec。
3. **插件/hook 兼容**：阶段 2 强化插件机制不删现有 14 插件的 `apply` 契约；`hooks` 对象的 13 钩子**名称与类型不变**，仅 `createPlugins` 来源可替换。
4. **渲染 hot path**：阶段 4 改动 `render/renderModels/renderMultiPass` 命中每帧热路径，需逐 PR 跑 `examples` 视觉回归 + layers jest，重点验证 multipass/highlight/select/picking 不回归。
5. **跨包**：阶段 1.4 相对坐标函数已在 `@antv/l7-utils`（source PLAN 5.1/5.2 完成），本阶段只动 layers 内部状态，不跨包；若阶段 3.2 类型改动溢出至 `@antv/l7-core` 接口，PR 拆 core + layers，changeset 标 minor。
6. **CI/Size**：每 PR 跑 layers `eslint` + `prettier --check` + `father build`（权威构建，忽略 `tsc --noEmit` 的 .glsl 噪音）+ 相关 jest spec；监控 `l7.js` size（1.7 MB 上限）。
7. **Changeset 策略**：阶段 0–1 为 patch（内部重构、对外透明）；阶段 2 为 minor（新增 registry/services API、修复事件泄漏=strictly-better）；阶段 3 为 minor；阶段 7 才考虑 major。fixed group `["@antv/l7","@antv/l7-*"]`，**不在 peerDependencies 声明兄弟包**（触发 major bump bug，见 source BACKLOG）。

---

## 5. 关键文件清单（重构主战场）

| 文件                                          | 当前行数 | 主要问题                                                    | 涉及阶段  |
| --------------------------------------------- | -------- | ----------------------------------------------------------- | --------- |
| `src/core/BaseLayer.ts`                       | 1510     | God Class，~86 方法/140 成员接口                            | 0,1,3,4   |
| `src/plugins/index.ts` + 14 插件              | ~1500    | `createPlugins()` 硬编码、无元数据排序                      | 2         |
| `src/tile/core/BaseLayer.ts`                  | 285      | 重复容器服务 getter、`tileLayer: any`                       | 5         |
| `src/core/BaseModel.ts`                       | 471      | 与 model manager 职责重叠（uniform/blend/stencil/textures） | 4,7       |
| `src/core/LayerPickService.ts`                | 118      | 已抽出先例，picking 编排仍留 BaseLayer                      | 1.3       |
| `src/core/TextureService.ts`                  | 77       | 已抽出先例（mask/animate 模式参照）                         | 1.6/1.7   |
| `src/core/interface.ts`                       | 347      | 类型待补（`any` 收敛）                                      | 0.4,3.2   |
| `core/ILayerService.ts`（@antv/l7-core）      | —        | `ILayer` 接口（~140 成员，须保兼容）                        | 1,7       |
| 12 个 `*/index.ts`（point/line/.../geometry） | 24–141   | `extends BaseLayer`，override 点最多                        | 1（回归） |
