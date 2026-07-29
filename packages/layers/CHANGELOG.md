# Change Log

## 3.0.0-beta.1

### Minor Changes

- [`5445cc6`](https://github.com/antvis/L7/commit/5445cc6fea19da223b2c5cb06495255040814edc) Thanks [@lzxue](https://github.com/lzxue)! - refactor(layers): introduce LayerConfigModel delegate converging config three-tracks (stage-3 3.1)

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

- [`af62247`](https://github.com/antvis/L7/commit/af622479123a01437e6d498bf4b06402f99de57f) Thanks [@lzxue](https://github.com/lzxue)! - refactor(layers): converge encode styles into Map-backed accessor (stage-3 3.3)

  P4 阶段 3 第二刀（3.3，layers 侧，minor——子类构造期 API 变更 + 新增内部
  单真源 + 新增 spec）。

  收敛原两个平行 `string[]` 数组为内部单一真源 `Map`，公开数组 getter 桥接
  维持 `ILayer` 契约。

  **BaseLayer**：

  - 删 `public enableShaderEncodeStyles: string[] = []` /
    `public enableDataEncodeStyles: string[] = []` 字段。
  - 加 `protected encodeStyles: Map<string, EncodeStyleKind> = new Map()`
    （单一真源，运行时不 mutate）。
  - 加 `public get enableShaderEncodeStyles() / .enableDataEncodeStyles()`
    数组 getter：按 `kind` 过滤 Map、映射出键名数组（每次调用新数组，
    浅拷贝不泄漏引引用）。
  - 加 `protected setEncodeStyles(kind, keys)` 批量声明 helper（同名后写
    覆盖先写，空 keys no-op）。
  - `encodeStyle()` 中 `[...shader, ...data].includes(key)` →
    `this.encodeStyles.has(key)`（语义等价，单 Map 查询替代数组 spread+includes）。

  **子类（point/line/polygon）**：原 `public enableXxxEncodeStyles = [...]`
  字段初始化器改为显式 `constructor(super(config); setEncodeStyles(...))`。
  构造期参数类型与 BaseLayer 一致（`Partial<ILayerConfig & 子类样式 options>`），
  类型透传替代 `as any`。

  **零行为变化**：getter 返回派生数组与原字段内容一致（point 5+2、line 4、
  polygon 5）；`encodeStyle` 过滤等价；下游 `BaseModel.getStyleAttribute` /
  `getDynamicStyleInject` 读 `.enableShaderEncodeStyles` 经 getter 透明工作。

  **spec**：新增 `__tests__/core/encode-styles.spec.ts`（7 cases）锁定：

  - point/line/polygon/BaseLayer 默认注册内容；
  - 公开数组 getter 从 Map 派生且浅拷贝不泄漏；
  - `setEncodeStyles` 同名覆盖语义、`shader`/`data` 互斥。

  验证：layers eslint 0 error、prettier 通过、layers father build 278 files
  （含 d.ts 类型检查，getter 三态正确解析）、jest layers+maps 78 suites
  0 failed（含新 7 cases；1 skipped `citybuilding` 基线一致）。

- [`0a3aa4d`](https://github.com/antvis/L7/commit/0a3aa4d85768603909bbe6df21aaf4a72ec96edc) Thanks [@lzxue](https://github.com/lzxue)! - fix(layers): unpin mapAfterFrameChange listener leak on destroy

  P4 阶段 2 第四刀（2.4，strictly-better：修复真实事件泄漏，零接口变化）。

  `BaseLayer.init` 在 `enableMultiPassRenderer + passes` 下以 **inline arrow**
  注册 `mapService.on('mapAfterFrameChange', () => this.renderLayers())`，
  而 `destroy()` 无对应 `off`——匿名箭头引用不可复现，即便加 off 也无法命中，
  监听器随图层销毁后仍挂在 `mapService` 上泄漏（图层重复创建/销毁场景累积）。

  修复（与既有 `onSourceUpdate` 具名实例箭头同模式）：

  - inline arrow → `protected readonly onMapAfterFrameChange = (): void => { this.renderLayers(); }`
    稳定实例引用，on/off 配对解绑。
  - init 内 `on(..., this.onMapAfterFrameChange)`。
  - destroy 内 **无条件** `this.mapService.off('mapAfterFrameChange', this.onMapAfterFrameChange)`
    （未注册时 off 为空操作，无害；条件化注册下统一 off 比 guard 更简洁安全）。

  行为变化：仅修复泄漏，renderLayers 触发时机与频率不变。属 strictly-better，
  按 PLAN 阶段 2 归 minor。

  验证：eslint 0 error、prettier 通过、layers father build 278 files（含
  declaration d.ts）、jest layers+maps 0 failed（77 suites，1 skipped）。

- [`a642560`](https://github.com/antvis/L7/commit/a64256031aead81f30d6c4cea6ab78d3d365f14a) Thanks [@lzxue](https://github.com/lzxue)! - refactor(layers): plugin metadata + registry replace/sortByOrder/getByName (stage-2 2.2)

  P4 阶段 2 第二刀（2.2，layers 侧，minor）。

  配合 core 侧 `ILayerPlugin` 新增的 `name?`/`order?`/`initStage?` 可选元数据
  （见 `refactor-core-plugin-metadata` changeset），落地 registry 声明式 API
  并为 14 内置插件各自声明唯一 `name`。

  **新增公共 API（`LayerPluginRegistry`，minor 依据）**：

  - `replace(name, plugin): this` — 按 `name` 精确替换已注册插件（首个匹配；
    未匹配抛错，显式 fail 避免静默吞拼写错误；替换保留下标，apply 序位不变）。
  - `sortByOrder(): this` — 按 `order` 升序稳定排序（缺省视 `Infinity` 兜底，
    相同 order 保持插入序）。14 内置插件均未声明 `order`，调用为 no-op。
  - `getByName(name): ILayerPlugin | undefined` — 按 `name` 查询。

  **14 内置插件元数据**：各插件加 `public readonly name = '<kebab>'`（与
  `registerBuiltinDefaults` 实例化顺序一致）：`data-source` / `register-style-attribute`
  / `feature-scale` / `data-mapping` / `layer-style` / `layer-mask` /
  `update-style-attribute` / `update-model` / `multi-pass-renderer` / `shader-uniform`
  / `layer-animate-style` / `lighting` / `pixel-picking` / `layer-model`。
  均不声明 `order`/`initStage`（保持 2.1 的插入序 apply 时序字节级一致）。

  **顺带修正 pre-existing class-name typo**：`LayerMaskPlugin.ts` 原误声明为
  `export default class LayerStylePlugin`（文件名/导入名与类名长期不一致，污染
  emitted `.d.ts`）→ 改回 `LayerMaskPlugin`。默认 export 绑定与 `instanceof`
  类身份不受影响（importer 全部经 default import 绑定到 `LayerMaskPlugin` 名），
  纯严格性修正。

  **行为零回归**：`ILayerPlugin` 三字段可选；registry 新方法不被 `BaseLayer.init`
  调用（apply 时序与实例化语义与 2.1 字节级等价）。仅_additive_ 公共 API。

  验证：layers eslint 0 error、prettier 通过、layers father build 278 files（含
  declaration d.ts 类型检查）、jest layers+maps 77 suites 无真实回归
  （`scroll_zoom` 的 `gl` 原生模块 texImage2D 并发 flake 单跑 9/9 通过，与本
  layers 改动无因果）。

- [`7861576`](https://github.com/antvis/L7/commit/78615761933c500d99cfc8d097b0770597997221) Thanks [@lzxue](https://github.com/lzxue)! - refactor(layers): extract LayerPluginRegistry (stage-2 2.1)

  P4 阶段 2 第一刀（2.1，新增 registry 公共 API，minor）。

  从 `BaseLayer.init()` 内联的 `createPlugins()` 抽出 `LayerPluginRegistry`
  （`plugins/registry.ts`），作为图层默认插件集的可配置来源。

  **新增公共 API**（minor 依据）：

  - `export class LayerPluginRegistry`：数组型注册表，方法
    `registerBuiltinDefaults()`（幂等注册默认 14，每次 `new` 全新实例、
    顺序与原 `createPlugins` 字节级一致）、`register(plugin)` 追加、
    `reorder(compareFn)` 重排（稳定排序）、`getAll()` 浅拷贝读取、
    `clear()`、`isDefaultsRegistered()`。
  - `BaseLayer.pluginRegistry: LayerPluginRegistry`（protected，每实例独立，
    字段初始化器 `new LayerPluginRegistry()`）。

  **接入点**：外部可在 `init` 前 `layer.pluginRegistry.registerBuiltinDefaults()`

  - `register` / `reorder` 自定义默认集/排序，`init` 内 `registerBuiltinDefaults`
    幂等跳过，保留外部配置。`replace(name, plugin)` 等基于元数据的精确替换留待
    2.2（`ILayerPlugin` 补 `name?`/`order?`/`initStage?` 后）。

  **与 source `ParserRegistry` 的关键差异**：parser 无状态可单例
  （`defaultRegistry` 单例 + `registerBuiltins`）；插件是**有状态实例**
  （`DataSourcePlugin.mapService` 在 `apply` 赋值、
  `FeatureScalePlugin.scaleOptions` 缓存），**不可跨图层共享** → 每图层实例
  独立 registry，`registerBuiltinDefaults` 每次 new 14。

  **行为零回归**：`init` 内 `this.plugins = createPlugins()` →
  `this.pluginRegistry.registerBuiltinDefaults(); this.plugins = this.pluginRegistry.getAll()`，
  apply 顺序与实例化语义字节级等价。`addPlugin`（init 后追加到 `this.plugins`）
  行为不变，与本 registry 解耦。

  旧全局 `createPlugins()` 保留为 `@deprecated` wrapper（实现为
  `new LayerPluginRegistry().registerBuiltinDefaults().getAll()`），外部调用方
  完全等价；`plugins/index.ts` 新增 14 插件具名 re-export 供外部按需 import。

  验证：eslint 0 error、prettier 通过、layers father build 278 files（含
  declaration d.ts 类型检查）、jest layers+maps 无真实回归（77 suites，
  `scroll_zoom` 的 `gl` 原生模块 texImage2D 并发 flake 单跑 9/9 通过，与本 layers
  改动无因果）。

- [`1530598`](https://github.com/antvis/L7/commit/153059820fb36b8eb3c684f06bb9245940f67743) Thanks [@lzxue](https://github.com/lzxue)! - refactor(layers): document render entries + drop deprecated renderMulPass (stage-4 4.1)

  P4 阶段 4 第一刀（4.1，layers 侧，minor）。

  渲染管线 6 入口边界厘清 + 文档化（运行时零行为变化）：

  - `render()`：单 pass 渲染入口（`LayerService` 在未启用
    `enableMultiPassRenderer` 时调用）。瓦片图层短路委托
    `tileLayer.render()`；否则 `beforeRenderData` 通知 + 空数据早退
    （避免数据纹理空数据导致 texture 超限），最后委托 `renderModels`。
    multipass 路径由 `LayerService` 直接调用 `renderMultiPass`，不经此方法。
  - `renderMultiPass()`：multipass 渲染入口（`LayerService` 在启用
    `enableMultiPassRenderer` 时调用）；有 `multiPassRenderer` 且
    `getRenderFlag()` 为真时委托其编排，否则回退 `renderModels`。
  - `renderModels()`：单 pass 共享 `model.draw` 执行器（`beforeRender` +
    逐 model draw，uniforms/blend/stencil/textures 取自 `layerModel`），
    被 `render` 与 `renderMultiPass` 复用。
  - `renderLayers()`：触发 `layerService.reRender()` 批量重渲信号，前后
    标记 `rendering` 防重入。
  - `prerender()`：每帧渲染前钩子，默认空体，子类可 override。

  同时移除 `renderMulPass(multiPassRenderer)` —— 该方法不在 `ILayer`
  公共接口、无任何内部调用方、阶段 0.2 已 `@deprecated` 并预告「将在
  渲染管线收敛（阶段 4）时并入 `renderMultiPass`」。其能力已被
  `renderMultiPass()` 内联的 `await this.multiPassRenderer.render()`
  覆盖。属预公告的弃用移除（minor）。

  验证：layers eslint 0 error、prettier 通过、layers father build 279
  files（d.ts OK）、非 GL jest 子集 25 suites / 158 passed 与基线一致。

### Patch Changes

- [`15c19a3`](https://github.com/antvis/L7/commit/15c19a3a0b297cac02533dccb8b11f00a374e047) Thanks [@lzxue](https://github.com/lzxue)! - refactor(layers): type encodeStyleAttribute field via IEncodedStyleMap (stage-3 3.2)

  P4 阶段 3 第一刀（3.2，layers 侧，patch——纯内部字段类型对齐，无新增/改动公共 API）。

  配合 core 侧 `IEncodedStyleMap`（见 `refactor-core-encoded-style-map`），将
  `BaseLayer.encodeStyleAttribute: Record<string, any>` 收窄为 `IEncodedStyleMap`
  并从 `@antv/l7-core` 导入。

  **零行为变化**：

  - 写入点 `encodeStyle()` 的 `this.encodeStyleAttribute[key] = options[key]`
    右值 `options[key]` 为 `any`，赋值具名类型无类型错误、运行时同一对象引用。
  - 读取点 `BaseModel.getInject()` 经 `getDynamicStyleInject(..., this.layer
.encodeStyleAttribute)` 传入（其形参 `Record<string, any>` 接受
    `IEncodedStyleMap`）、`!this.layer.encodeStyleAttribute[key]` 真值判断、
    `Object.keys(...)` 遍历均不受影响。

  `registerStyleAttribute`/其他 BaseModel 自身的 `encodeStyleAttribute: Record<
string, boolean>`（布尔 flag 表）与本字段同名但语义独立，不在本刀收窄范围。

  验证：layers eslint 0 error、prettier 通过、layers father build 278 files
  （含 declaration d.ts 类型检查）、jest layers+maps 77 suites 0 failed（1
  skipped `citybuilding`，基线一致）。

- [`8ce2a7a`](https://github.com/antvis/L7/commit/8ce2a7aeb0cba7d82f405d3ae38bf80154efabfc) Thanks [@lzxue](https://github.com/lzxue)! - refactor(layers): align getScale generic signature with ILayer (stage-3 3.2)

  P4 阶段 3 第二刀收尾（3.2，layers 侧，patch）。

  `BaseLayer.getScale` 与 `LayerScaleLegend.getScale` 同步加
  `<T = IStyleScale>` 泛型签名，对齐 `@antv/l7-core` 的 `ILayer.getScale`
  接口变更（见 `refactor-core-getscale-generic` changeset）：

  - `BaseLayer.getScale<T = IStyleScale>(name): T` →
    `return this.scaleLegendManager.getScale<T>(name)`
  - `LayerScaleLegend.getScale<T = IStyleScale>(name): T` →
    `return this.layer.styleAttributeService
.getLayerAttributeScale(name) as T`

  纯内部签名对齐，运行时零行为变化。

  验证：layers eslint 0 error、prettier 通过、layers father build 278 files
  （d.ts 生成、类型检查通过）、jest packages/layers packages/maps
  0 failed（660 passed，1 skipped citybuilding 基线不变）。

- [`a534e62`](https://github.com/antvis/L7/commit/a534e62a7cadfd6548820c797d208562de28f082) Thanks [@lzxue](https://github.com/lzxue)! - refactor(layers): BaseLayer stage-0 @ts-ignore 收敛 22→14

  P4 阶段 0 第二刀（0.3，零行为/零 API 变更）。安全消除 8 处冗余 `@ts-ignore`：

  - `updateLayerConfig` 动态键赋值 → `Record<string, unknown>` 断言
  - 删 `styleDataMapping(...)` 死代码注释 + 其冗余 `@ts-ignore`
  - `style()` 的 borderColor/borderWidth 兼容分支 → 局部 `styleRest` 断言，消 5 处动态属性访问 `@ts-ignore`
  - `get(name)` 的 `@ts-ignore` 冗余删除（`getLayerConfig()` 返 `any`，`cfg[name]` 兼容 `ILayer.get(): number`）

  剩余 14 处为真实类型边界，明确归属后续阶段：

  - `splitValuesAndCallbackInAttribute` + scale shape（init pendingStyle / updateStyleAttribute）→ 阶段 1.1 `LayerStyleFluent`
  - `@antv/async-hook` `SyncHook.call().then()`（call 运行时返 thenable 但类型未声明）→ 阶段 1.3 `LayerPickingManager`
  - `isTileLayer` 动态属性、triangulation 解构 → 阶段 1.5/1.2

  `log()` 处 `@ts-ignore` 经验证非冗余（`isTileLayer` 不在 BaseLayer 类型上），保留并补注释。
  验证：eslint 0 error、prettier 通过、father build 271 files（含 declaration 生成）、jest 40 suites / 191 passed。

- [`c9e995d`](https://github.com/antvis/L7/commit/c9e995d57d82122ccee496966cad582fa3ae61ae) Thanks [@lzxue](https://github.com/lzxue)! - refactor(layers,core): BaseLayer stage-0 抽内联字面量类型为命名接口（0.4）

  P4 阶段 0 第三刀（0.4，零行为/零 API 变更，纯类型 DRY）。`BaseLayer.ts` 的
  `defaultSourceConfig`/`sourceOption`/`shapeOption` 此前以内联字面量类型声明，
  且同样的字面量在 `core/src/services/layer/ILayerService.ts` 的 `ILayer` 接口里
  重复声明一次（散落字面量）。本轮在 `IDataState` 旁新增三个命名接口统一引用：

  - `IDefaultSourceConfig { data: any[]; options: ISourceCFG | undefined }`
  - `ISourceOption { data: any; options?: ISourceCFG }`
  - `IShapeOption { field: any; values: any }`

  `ILayer` 接口与 `BaseLayer` 字段声明均改为引用命名接口（形状完全一致）。
  `dataState` 此前已使用 `IDataState`，本轮无需改动。精确保留 `shape()` /
  `source()` 运行时赋值点的可赋值性（`any` 字段双向兼容）。

  验证：eslint 0 error、prettier 通过、core father build（98 files，含 declaration）、
  layers father build（271 files，含 declaration d.ts 类型检查）、jest 40 suites / 191 passed。

- [`7454f96`](https://github.com/antvis/L7/commit/7454f96ae278823a4f4ac68d36676417cedefba3) Thanks [@lzxue](https://github.com/lzxue)! - refactor(layers): BaseLayer stage-0 dead-code cleanup & render API doc

  P4 阶段 0 第一刀（无行为变更、无 API 变更）。

  - 删死代码/注释：`plugins/index.ts` 注释 import、BaseLayer 注释字段
    `pickingPassRender`、`init()` 内旧 config 注释块、注释 `tileLayer = new TileLayer` 块
  - 命名/文档收口：`renderMulPass` 标 `@deprecated`（public 但不在 `ILayer` 接口、
    仓库内无内部调用方）；`renderMultiPass`/`prerender`/`setEarthTime`/`processData`
    补 JSDoc 明确各自职责与「子类可选 override」约定，与优先级矩阵「阶段 0 极低风险」一致

  对应 PLAN 0.1 / 0.2 / 0.5；`@ts-ignore` 收敛(0.3)与类型抽接口(0.4)留待阶段 0 第二刀。
  `renderMulPass` 的实际可见性/命名收敛留到阶段 4（渲染管线，中高风险）配合处理。
  验证：layers eslint 0 error、prettier --check 通过、father build 271 files、
  jest 40 suites / 191 passed（1 skipped 为 pre-existing）。

- [`274f3c8`](https://github.com/antvis/L7/commit/274f3c81ccfcd5dd2d56e4e980e9e8dddb2144a4) Thanks [@lzxue](https://github.com/lzxue)! - refactor(layers): extract LayerAnimateState (stage-1 1.5)

  P4 阶段 1 第四刀（1.5，对外透明 delegate，零 API/行为变更）。

  从 BaseLayer 抽出动画运行态 delegate `core/LayerAnimateState.ts`，收口
  2 个原 private 字段（`animateStartTime` / `animateStatus`）与 4 个方法：
  `getTime`（clock.getDelta）、`setAnimateStartTime`、`stopAnimate`（含
  layerService.stopAnimate + `updateLayerConfig` 关闭 animateOption）、
  `getLayerAnimateTime`；另将 `prepareBuildModel` 内联启动块抽为 delegate
  `prepareAnimate()`。

  `animateStatus` 被 `LayerAnimateStylePlugin` 经 `@ts-ignore` 直读
  `layer.animateStatus`（private + 不在 ILayer 接口）。为保留该运行时读取，
  BaseLayer 新增 **public getter `get animateStatus()`** 桥接到 delegate
  `getAnimateStatus()`——外部读取行为不变（读取实例属性命中 getter）。
  `animateStartTime` 纯内部（仅本组方法读写），直接搬入。

  `layerService` 在 BaseLayer 为 protected getter，delegate 经公开
  `this.layer.container.layerService` 访问（同 `LayerVisibilityZoom` 先例）；
  `updateLayerConfig` / `getLayerConfig` 均公开，可跨类调用。

  顺带清理原 protected dead 字段 `animateOptions`（`{ enable: false }`）——
  全仓仅声明、无任何读写（动画配置实走 `getLayerConfig().animateOption`），
  protected 不属外部 API，删除零行为/零 API 变更。`IAnimateOption` import
  仍被 `animate()` 方法使用，保留。

  验证：eslint 0 error、prettier 通过、layers father build 276 files（含
  declaration d.ts 类型检查）、jest layers+maps `--json` 干净跑 0 failed
  （77 suites，1 skipped；偶发 `gl` 原生模块 texImage2D 并发 flake 已知，单跑通过）。

- [`d9510d7`](https://github.com/antvis/L7/commit/d9510d796bc9afe6173d51656df4115a40cad1fa) Thanks [@lzxue](https://github.com/lzxue)! - refactor(layers): extract LayerMaskManager (stage-1 1.7)

  P4 阶段 1 第三刀（1.7，对外透明 delegate，零 API/行为变更）。

  从 BaseLayer 抽出遮罩管理 delegate `core/LayerMaskManager.ts`，收口
  mask 相关方法：`addMask` / `removeMask` / `disableMask` / `enableMask` /
  `addMaskLayer` / `removeMaskLayer`（后两者 `@deprecated` JSDoc 随搬入）。

  **关键设计**：`masks[]` 数组**保持为 BaseLayer 公开字段**——`core` 的
  `LayerService`（`layer.masks.filter`）与 `BaseModel`
  （`this.layer.masks.length`）直接读取该字段，故数组引用不能移入 delegate。
  delegate 持有对该数组的引用并就地 mutate（push/splice），reassign 仅发生在
  BaseLayer ctor 初始化与 `destroy()` 清空两处。为避免 ctor 中
  `this.masks = config.maskLayers` 断开 delegate 引用，delegate 在该赋值之后
  实例化（`new LayerMaskManager(this, this.masks)`）。

  BaseLayer 保留全部 `ILayer` 公开签名作为薄转发；全仓无子类 override 这一组
  方法（已确认）。destroy() 中 `this.masks = []` reassign 在终态、之后 manager
  不再使用，无引用失效风险。

  验证：eslint 0 error、prettier 通过、layers father build 273 files（含
  declaration d.ts 类型检查）、jest layers+maps 76 suites/653 passed。

- [`4a6ff65`](https://github.com/antvis/L7/commit/4a6ff6594ff031eecf9295b80f24b1d6d5f2d391) Thanks [@lzxue](https://github.com/lzxue)! - refactor(layers): move picking orchestration into LayerPickingManager (1.3b)

  P4 阶段 1 第二刀（1.3b，对外透明 delegate，零 API/行为变更）。1.3 整步收尾。

  将编排方法 `active` / `setActive` / `select` / `setSelect` 从 BaseLayer 搬入
  `core/LayerPickingManager.ts`（1.3a 已搬入 pick/boxSelect/needPick + 状态）。
  BaseLayer 保留全部 `ILayer` 公开签名作为薄转发，方法体逻辑字节级镜像原实现，
  子类 override 路径不变（全仓无子类 override 这四方法，已确认）。

  关键设计：`reRender` 是 BaseLayer protected 成员，delegate 不能直访。采用 ctor
  注入 `rerender` 回调桥接——`new LayerPickingManager(this, () => this.reRender())`，
  箭头函数延迟求值，在 BaseLayer 字段初始化处定义时对 protected 可见、且不实际
  调用（仅 setActive/setSelect 的 setTimeout 回调内触发）。保持 hooks
  beforeHighlight/beforeSelect 编排与 `setTimeout(reRender,1)` 行为不变。

  `@ts-ignore`（`@antv/async-hook` `SyncHook.call().then()` thenable，运行时成立
  但类型未声明）随方法体一并搬入 delegate，归属阶段 1.3 既有标记不变。

  验证：eslint 0 error、prettier 通过、layers father build 272 files（含
  declaration d.ts 类型检查）、jest layers 40 suites/191 passed。
  （maps `scroll_zoom.spec` 全量跑时偶现 GL texImage2D mock flaky，单跑 9 passed，
  与本改动无关。）

- [`ba1394c`](https://github.com/antvis/L7/commit/ba1394caf4cbc26191ed5c360630652f8bc49e56) Thanks [@lzxue](https://github.com/lzxue)! - refactor(layers): extract LayerPickingManager (stage-1 1.3a)

  P4 阶段 1 第一刀（1.3a，对外透明 delegate，零 API/行为变更）。

  从 BaseLayer 抽出拾取状态与查询 delegate `core/LayerPickingManager.ts`，
  收口：

  - 私有状态 `currentPickId`、`selectedFeatureID`（前者原 private，后者原 public
    但非 ILayer 成员、全仓零外部直引用）搬入 delegate
  - 查询/转发方法 `pick` / `boxSelect` / `needPick`
  - pick-id 状态访问器 `setCurrentPickId` / `getCurrentPickId` /
    `setCurrentSelectedId` / `getCurrentSelectedId`

  BaseLayer 保留全部 `ILayer` 公开签名作为薄转发（`this.pickingManager.*`），
  方法签名字节级镜像原实现，子类 override 路径不变。外部调用方
  （`PickingService` / `PixelPickingPass` / `tile/interaction/utils`）全部经由
  ILayer 方法访问，无一受影响。

  `active` / `setActive` / `select` / `setSelect`（含 hooks beforeHighlight/
  beforeSelect + `setTimeout(reRender,1)` 异步重渲染，依赖 protected `reRender`）
  暂留 BaseLayer，留待 1.3b 随 reRender 桥接一并搬入——拆分以保持本刀零
  protected 跨类访问、最小风险。

  验证：eslint 0 error、prettier 通过、layers father build 272 files（含
  declaration d.ts 类型检查）、jest layers 40 suites/191 passed、jest maps
  36 suites/462 passed。

- [`ea11251`](https://github.com/antvis/L7/commit/ea11251213ae20caf6e75771441918c831ca3e7a) Thanks [@lzxue](https://github.com/lzxue)! - refactor(layers): extract LayerRelativeCoords (stage-1 1.4)

  P4 阶段 1 第三刀（1.4，对外透明 delegate，零 API/行为变更）。

  从 BaseLayer 抽出相对坐标状态与转换 delegate `core/LayerRelativeCoords.ts`，
  收口 3 个原 protected 字段（`relativeOrigin` / `originalExtent` /
  `absoluteDataArray`）与 4 个方法：`processRelativeCoordinates`（原 protected，
  自我触发，init / setData 钩子调用）、`getAbsoluteData` / `getRelativeOrigin` /
  `getOriginalExtent`（public getter）。

  BaseLayer 保留全部对外签名作为薄转发：`processRelativeCoordinates` 保留
  protected 自调用（内部 call site 不变），3 getter 转发到 delegate。
  `processRelativeCoordinates` 核心逻辑字节级镜像原实现——读 `getLayerConfig`
  取 `enableRelativeCoordinates`（经 `(layerConfig as any)?.` 兼容字段不在类型上），
  经公开 `getSource()` 读写 `source.data.dataArray`（同引用，mutation 生效），
  不跨类直访 protected `layerSource`。

  3 字段原 protected、外部全走 ILayer getter 访问（grep 已确认无一字段直读），
  搬入 delegate 安全。`@antv/l7-utils` 的 `processRelativeCoordinates` 函数
  import 从 BaseLayer 上移至 delegate（阶段 0 已就绪，不跨包）。

  验证：eslint 0 error、prettier 通过、layers father build 275 files（含
  declaration d.ts 类型检查）、jest layers+maps 76 suites/653 passed。

- [`556c8fc`](https://github.com/antvis/L7/commit/556c8fc0c556f02e80ca22cbe9641289913bfeea) Thanks [@lzxue](https://github.com/lzxue)! - refactor(layers): extract LayerScaleLegend (stage-1 1.6)

  P4 阶段 1 第五刀（1.6，对外透明 delegate，零 API/行为变更）。

  从 BaseLayer 抽出 scale 配置与图例读取 delegate `core/LayerScaleLegend.ts`，
  收口 1 个原 private 字段（`scaleOptions`）与 5 个方法：`scale`（含
  `styleAttributeService.updateScaleAttribute` 联动）、`getScaleOptions`、
  `getScale`、`getLegend`、`getLegendItems`（`invertExtent` 分段 /
  `ticks` 连续 / `domain` 枚举三分支分类法，字节级镜像原实现）。

  `scaleOptions` 经 `getScaleOptions()` 返回引用，被 `FeatureScalePlugin`
  缓存到其自身 `this.scaleOptions` 字段——转发返回同一 delegate 字段引用，
  插件缓存语义不变。`scale()` 返回 `ILayer` 由 BaseLayer 转发层 `return this`
  完成，delegate 侧改为 void。

  `styleAttributeService` 在 BaseLayer 为 public，delegate 经公开
  `this.layer.styleAttributeService` 访问 `getLayerAttributeScale` /
  `getLayerStyleAttribute` / `updateScaleAttribute`（均 public）。

  顺带清理搬运后 BaseLayer 变 dead 的类型 import（`ILegendClassificaItem` /
  `ILegendSegmentItem`）与 lodash 解构项 `isUndefined`（仅声明无使用）。
  `IScale` / `IScaleOptions` / `ILegend` / `LegendItems` 仍用于转发签名，保留。

  验证：eslint 0 error、prettier 通过、layers father build 277 files（含
  declaration d.ts 类型检查）、jest layers+maps `--json` 干净跑 0 failed
  （77 suites，1 skipped）。

- [`1c07545`](https://github.com/antvis/L7/commit/1c075459dc4a7e50dedf303ea211b1b054ce130d) Thanks [@lzxue](https://github.com/lzxue)! - refactor(layers): extract LayerVisibilityZoom (stage-1 1.8)

  P4 阶段 1 第四刀（1.8，对外透明 delegate，零 API/行为变更）。

  从 BaseLayer 抽出可见性/缩放管理 delegate `core/LayerVisibilityZoom.ts`，
  收口 10 个方法：`show` / `hide`（含 `emit('show'|'hide')` 事件契约）、
  `setIndex`（写 `zIndex` + renderList 重排）、`setMinZoom` / `setMaxZoom` /
  `getMinZoom` / `getMaxZoom`、`isVisible`（zoom 范围判定）、`setAutoFit` /
  `fitBounds`（未 init 落 autoFit 标记、init 后走 mapService.fitBounds）。

  BaseLayer 保留全部 `ILayer` 公开签名作为薄转发。`reRender`（protected）经
  ctor 注入 `rerender` 回调桥接——同 `LayerPickingManager`（1.3b）先例模式，
  箭头延迟求值、字段初始化处定义、不实际调用。

  子类 override 路径不受影响：`CanvasLayer.show/hide` 完全替换基类、走 DOM
  显隐不调 super，保持原行为不变（已确认）。`isVisible` 被同轮 `pickingManager`
  delegate（1.3a）的 `needPick` 间接调用，转发链经 BaseLayer 回路完整。

  验证：eslint 0 error、prettier 通过、layers father build 274 files（含
  declaration d.ts 类型检查）、jest layers+maps 76 suites/653 passed。

- [`8dc6ef0`](https://github.com/antvis/L7/commit/8dc6ef07a86c36bf6db9f3e11bd28b8f5ad856dd) Thanks [@lzxue](https://github.com/lzxue)! - refactor(layers): document sublayer fields + surface isTileLayer/tileMask (stage-5 5.3)

  P4 阶段 5 第三刀（5.3 文档化部分，layers 侧，patch）。

  子图层关系字段文档化 + 类型面收紧（运行时零行为变化）：

  - `layerChildren`：补 JSDoc 标注其生命周期不对称——`destroy()` 遍历
    销毁、`LayerService.remove(layer, parentLayer)` 按 id splice 移除，
    源码内**无 add 路径**（子图层经 `Scene.addLayer` 独立加入 scene，
    不自动登记此数组）。
  - `isTileLayer`：由 `ILayer` 接口隐式（`isTileLayer?: boolean`）收敛
    为 `BaseLayer` 显式可选字段声明 + JSDoc。由 `Tile.addLayer` 在瓦片
    子图层置 `true`，区分「瓦片宿主图层」（持 `tileLayer`）与「瓦片
    实例子图层」（持本标记）；`DataSourcePlugin`/text 模型/`log()` 据此
    短路瓦片路径。
  - `tileMask`：同上收敛为显式可选字段声明 + JSDoc。由
    `Tile.addTileMask` 在瓦片 mainLayer 置（`mainLayer.tileMask = mask`），
    供 `BaseModel` mask 模式与 `LayerService` mask 渲染按瓦片裁剪；非瓦片
    图层保持 `undefined`。

  路径统一（`addSubLayer`/对称 `addLayer(layer, parentLayer?)` 入口 +
  `IBaseTileLayerManager` 死接口 `addChild/addChildren/removeChild/
clearChild/hasChild` 收口）推迟阶段 7：`layerChildren` 源码内
  write-never，新增公共 add 入口若无消费者即死 API，属 API 设计决策
  而非内部重构。

  验证：layers eslint 0 error、prettier 通过、layers father build
  279 files、scene father build 66 files（d.ts OK）、非 GL jest 子集
  25 suites / 158 passed 与基线一致。

- [`cd3bf40`](https://github.com/antvis/L7/commit/cd3bf40bde46b10f6f167e4f39e81e8b6b802a3d) Thanks [@lzxue](https://github.com/lzxue)! - refactor(layers): dedupe BaseTileLayer container services via parent.getContainer (stage-5 5.2)

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

- [`fa33b9d`](https://github.com/antvis/L7/commit/fa33b9dbd9efd52dda38c741e8e7f47951167086) Thanks [@lzxue](https://github.com/lzxue)! - refactor(layers): type BaseLayer.tileLayer as IBaseTileLayer | undefined (stage-5 5.1)

  P4 阶段 5 第一刀（5.1，layers 侧，patch）。

  `BaseLayer.tileLayer` 由 `any | undefined` 收敛为
  `IBaseTileLayer | undefined`，与 `ILayer` 契约对齐。运行时赋值点
  仅 `Scene.initTileLayer` 的 `new TileLayer(layer)`（`BaseTileLayer`
  结构性实现 `IBaseTileLayer`，含 `render`/`destroy`/`pickRender`/
  `getLayers`/`getTiles`/`selectFeature`/`highlightPickedFeature`/
  `reload`），类型安全且零行为变化。

  配套 core 侧接口补强（`IBaseTileLayer.reload` + `ILayer.tileLayer`
  可选化）见 `refactor-core-tilelayer-interface` changeset。

  验证：layers eslint 0 error、prettier 通过、layers father build
  279 files（d.ts OK）、scene father build 66 files、非 GL jest
  子集 25 suites / 158 passed 与基线一致。

- [`541a7ea`](https://github.com/antvis/L7/commit/541a7ea19d79205dc82f1667cfbcc24530e21dc3) Thanks [@lzxue](https://github.com/lzxue)! - refactor(maps,layers): gaode alias dedupe, source listener leak fix, raster parser guards

  三处互不相关的稳健性修复与去重，行为等价或 strictly-better。

  - **maps gaode alias dedupe**：将 `GaodeMap / GaodeMapV1 / GaodeMapV2` 弃用别名
    从 `index.ts` 与 `gaode.ts` 重复定义收敛到单一 `lib/gaode-aliases.ts`，
    两个 entry 改为 re-export。无运行时行为变更，去重样板。
  - **layers source listener 泄漏修复**：`BaseLayer.setSource` 原先以 inline arrow
    注册 `layerSource.on('update', …)`，而 `destroy` / `setSource` 替换旧 source
    时调用 `off('update', this.sourceEvent)`（不同引用），令 off 永不命中（空操作），
    监听器泄漏至 source GC。提取为稳定的 `protected readonly onSourceUpdate`
    实例箭头方法，on/off 统一引用，解绑真实生效。
  - **layers rgb/ndi parser 守卫**：波段数不足时（rgb 需 3、ndi 需 2）原先仅 `console.warn`
    后继续访问 `data[band]`（undefined），后续运算产生 `NaN`；现改为 warn 后提前返回
    空 `dataArray`。rgb 同时为缺失的 `extent` 提供默认值，使无 coordinates 的调用方
    被优雅处理（`extentToCoord` 不再对 undefined extent 报错）。strictly-better，
    补 rgb.spec.ts 覆盖两处守卫。

  详见 commit 38ba982。验证：maps/layers eslint 0 error、father build 绿、
  相关 jest spec 绿，无回归。

- Updated dependencies [[`d45cb50`](https://github.com/antvis/L7/commit/d45cb50516a57be2b63237385050a9716901211f), [`af62247`](https://github.com/antvis/L7/commit/af622479123a01437e6d498bf4b06402f99de57f), [`15c19a3`](https://github.com/antvis/L7/commit/15c19a3a0b297cac02533dccb8b11f00a374e047), [`8ce2a7a`](https://github.com/antvis/L7/commit/8ce2a7aeb0cba7d82f405d3ae38bf80154efabfc), [`a642560`](https://github.com/antvis/L7/commit/a64256031aead81f30d6c4cea6ab78d3d365f14a), [`fa33b9d`](https://github.com/antvis/L7/commit/fa33b9dbd9efd52dda38c741e8e7f47951167086), [`c9e995d`](https://github.com/antvis/L7/commit/c9e995d57d82122ccee496966cad582fa3ae61ae), [`541a7ea`](https://github.com/antvis/L7/commit/541a7ea19d79205dc82f1667cfbcc24530e21dc3), [`541a7ea`](https://github.com/antvis/L7/commit/541a7ea19d79205dc82f1667cfbcc24530e21dc3)]:
  - @antv/l7-utils@3.0.0-beta.1
  - @antv/l7-core@3.0.0-beta.1
  - @antv/l7-maps@3.0.0-beta.1

## 2.30.0-beta.0

### Patch Changes

- Updated dependencies [[`9a455f4`](https://github.com/antvis/L7/commit/9a455f42ec057482646a49fde2f5ecd16dd9713a), [`cd654c1`](https://github.com/antvis/L7/commit/cd654c1c16610636a2986e0ffd4ed2224930fc7f), [`cd654c1`](https://github.com/antvis/L7/commit/cd654c1c16610636a2986e0ffd4ed2224930fc7f), [`cd654c1`](https://github.com/antvis/L7/commit/cd654c1c16610636a2986e0ffd4ed2224930fc7f), [`cd654c1`](https://github.com/antvis/L7/commit/cd654c1c16610636a2986e0ffd4ed2224930fc7f), [`cd654c1`](https://github.com/antvis/L7/commit/cd654c1c16610636a2986e0ffd4ed2224930fc7f), [`cd654c1`](https://github.com/antvis/L7/commit/cd654c1c16610636a2986e0ffd4ed2224930fc7f), [`cd654c1`](https://github.com/antvis/L7/commit/cd654c1c16610636a2986e0ffd4ed2224930fc7f), [`cd654c1`](https://github.com/antvis/L7/commit/cd654c1c16610636a2986e0ffd4ed2224930fc7f), [`cd654c1`](https://github.com/antvis/L7/commit/cd654c1c16610636a2986e0ffd4ed2224930fc7f), [`cd654c1`](https://github.com/antvis/L7/commit/cd654c1c16610636a2986e0ffd4ed2224930fc7f), [`cd654c1`](https://github.com/antvis/L7/commit/cd654c1c16610636a2986e0ffd4ed2224930fc7f), [`cd654c1`](https://github.com/antvis/L7/commit/cd654c1c16610636a2986e0ffd4ed2224930fc7f), [`cd654c1`](https://github.com/antvis/L7/commit/cd654c1c16610636a2986e0ffd4ed2224930fc7f), [`cd654c1`](https://github.com/antvis/L7/commit/cd654c1c16610636a2986e0ffd4ed2224930fc7f), [`cd654c1`](https://github.com/antvis/L7/commit/cd654c1c16610636a2986e0ffd4ed2224930fc7f)]:
  - @antv/l7-maps@2.30.0-beta.0
  - @antv/l7-source@2.30.0-beta.0
  - @antv/l7-core@2.30.0-beta.0
  - @antv/l7-utils@2.30.0-beta.0

## 2.29.1

### Patch Changes

- chore: upgrade deprecated dependencies and pnpm to v11
- Updated dependencies []:
  - @antv/l7-core@2.29.1
  - @antv/l7-maps@2.29.1
  - @antv/l7-source@2.29.1
  - @antv/l7-utils@2.29.1

## 2.28.14

### Patch Changes

- Release 2.28.14.

- Updated dependencies []:
  - @antv/l7-core@2.28.14
  - @antv/l7-maps@2.28.14
  - @antv/l7-source@2.28.14
  - @antv/l7-utils@2.28.14

## 2.28.13

### Patch Changes

- Release 2.28.13.

- Updated dependencies []:
  - @antv/l7-core@2.28.13
  - @antv/l7-maps@2.28.13
  - @antv/l7-source@2.28.13
  - @antv/l7-utils@2.28.13

## 2.28.12

### Patch Changes

- Updated dependencies []:
  - @antv/l7-maps@2.28.12
  - @antv/l7-core@2.28.12
  - @antv/l7-source@2.28.12
  - @antv/l7-utils@2.28.12

## 2.25.9

### Patch Changes

- fix: revert to version 2.25.4 and fix text rendering issue

- Updated dependencies []:
  - @antv/l7-core@2.25.9
  - @antv/l7-maps@2.25.9
  - @antv/l7-source@2.25.9
  - @antv/l7-utils@2.25.9

## 2.25.4

### Patch Changes

- fix(scale): return range midpoint when domain min equals max

  When all data values are identical (e.g., all values are 1),
  .domain([1, 1]).range([0, 1]) would return 0 for all values,
  making heatmap invisible. Now returns the range midpoint instead.

  Affected scales:
  - scaleLinear: return (r0 + r1) / 2
  - scalePow: return (r0 + r1) / 2
  - scaleLog: return (r0 + r1) / 2
  - scaleQuantize: return \_range[Math.floor(_range.length / 2)]
  - scaleTime: return (r0 + r1) / 2

- Updated dependencies []:
  - @antv/l7-core@2.25.4
  - @antv/l7-maps@2.25.4
  - @antv/l7-source@2.25.4
  - @antv/l7-utils@2.25.4

## 2.23.3-beta.3

### Patch Changes

- Updated dependencies []:
  - @antv/l7-core@2.23.3-beta.3
  - @antv/l7-maps@2.23.3-beta.3
  - @antv/l7-source@2.23.3-beta.3
  - @antv/l7-utils@2.23.3-beta.3

## 2.23.3-beta.2

### Patch Changes

- Updated dependencies []:
  - @antv/l7-core@2.23.3-beta.2
  - @antv/l7-maps@2.23.3-beta.2
  - @antv/l7-source@2.23.3-beta.2
  - @antv/l7-utils@2.23.3-beta.2

## 2.23.3-beta.1

### Patch Changes

- 版本更新

- Updated dependencies []:
  - @antv/l7-source@2.23.3-beta.1
  - @antv/l7-utils@2.23.3-beta.1
  - @antv/l7-core@2.23.3-beta.1
  - @antv/l7-maps@2.23.3-beta.1

## 2.23.3-beta.0

### Patch Changes

- [`8248e26`](https://github.com/antvis/L7/commit/8248e264c6cad611547c7f9730540ab0729115ac) Thanks [@lzxue](https://github.com/lzxue)! - patch 版本

- Updated dependencies [[`8248e26`](https://github.com/antvis/L7/commit/8248e264c6cad611547c7f9730540ab0729115ac)]:
  - @antv/l7-source@2.23.3-beta.0
  - @antv/l7-utils@2.23.3-beta.0
  - @antv/l7-core@2.23.3-beta.0
  - @antv/l7-maps@2.23.3-beta.0

## 2.23.2

### Patch Changes

- [`a3e9a44`](https://github.com/antvis/L7/commit/a3e9a440e43030a297ee8dd32aabb32c10624e7d) Thanks [@lzxue](https://github.com/lzxue)! - rename source

- Updated dependencies [[`a3e9a44`](https://github.com/antvis/L7/commit/a3e9a440e43030a297ee8dd32aabb32c10624e7d)]:
  - @antv/l7-core@2.23.2
  - @antv/l7-maps@2.23.2
  - @antv/l7-source@2.23.2
  - @antv/l7-utils@2.23.2

## 2.23.1

### Patch Changes

- [`7932838`](https://github.com/antvis/L7/commit/79328384d8b1deb547ff2422aaa4366201dfe9b2) Thanks [@lzxue](https://github.com/lzxue)! - 更新demo

- [`4f690b8`](https://github.com/antvis/L7/commit/4f690b837a322bc9923baf2b387ea43d37ba1e5d) Thanks [@lzxue](https://github.com/lzxue)! - 移动端事件

- Updated dependencies [[`7932838`](https://github.com/antvis/L7/commit/79328384d8b1deb547ff2422aaa4366201dfe9b2), [`4f690b8`](https://github.com/antvis/L7/commit/4f690b837a322bc9923baf2b387ea43d37ba1e5d)]:
  - @antv/l7-source@2.23.1
  - @antv/l7-utils@2.23.1
  - @antv/l7-core@2.23.1
  - @antv/l7-maps@2.23.1

## 2.22.6

### Patch Changes

- [#2726](https://github.com/antvis/L7/pull/2726) [`c357dc8`](https://github.com/antvis/L7/commit/c357dc8520e1d3f53af60e4a325096da2d4e223c) Thanks [@lzxue](https://github.com/lzxue)! - 相对坐标系支持

- Updated dependencies [[`c357dc8`](https://github.com/antvis/L7/commit/c357dc8520e1d3f53af60e4a325096da2d4e223c)]:
  - @antv/l7-source@2.22.6
  - @antv/l7-core@2.22.6
  - @antv/l7-maps@2.22.6
  - @antv/l7-utils@2.22.6

## 2.22.5

### Patch Changes

- [#2680](https://github.com/antvis/L7/pull/2680) [`42134f3`](https://github.com/antvis/L7/commit/42134f3aac3f2814e167bedca3c84b98766ebd6e) Thanks [@XinyueDu](https://github.com/XinyueDu)! - update version

- Updated dependencies [[`42134f3`](https://github.com/antvis/L7/commit/42134f3aac3f2814e167bedca3c84b98766ebd6e)]:
  - @antv/l7-core@2.22.5
  - @antv/l7-maps@2.22.5
  - @antv/l7-source@2.22.5
  - @antv/l7-utils@2.22.5

## 2.22.4

### Patch Changes

- [#2631](https://github.com/antvis/L7/pull/2631) [`8a9413f`](https://github.com/antvis/L7/commit/8a9413fa842397d7eb2beae18e896ffddc9abdf4) Thanks [@lzxue](https://github.com/lzxue)! - raster tile extent

- Updated dependencies [[`8a9413f`](https://github.com/antvis/L7/commit/8a9413fa842397d7eb2beae18e896ffddc9abdf4)]:
  - @antv/l7-core@2.22.4
  - @antv/l7-maps@2.22.4
  - @antv/l7-source@2.22.4
  - @antv/l7-utils@2.22.4

## 2.22.3

### Patch Changes

- [#2636](https://github.com/antvis/L7/pull/2636) [`c9db10a`](https://github.com/antvis/L7/commit/c9db10ab34c269d48db7601f2f624262b61856ee) Thanks [@lvisei](https://github.com/lvisei)! - fix: scale domain when default undefined

- Updated dependencies []:
  - @antv/l7-core@2.22.3
  - @antv/l7-maps@2.22.3
  - @antv/l7-source@2.22.3
  - @antv/l7-utils@2.22.3

## 2.22.2

### Patch Changes

- [#2631](https://github.com/antvis/L7/pull/2631) [`8a9413f`](https://github.com/antvis/L7/commit/8a9413fa842397d7eb2beae18e896ffddc9abdf4) Thanks [@lzxue](https://github.com/lzxue)! - raster tile extent

- Updated dependencies [[`8a9413f`](https://github.com/antvis/L7/commit/8a9413fa842397d7eb2beae18e896ffddc9abdf4)]:
  - @antv/l7-core@2.22.2
  - @antv/l7-maps@2.22.2
  - @antv/l7-source@2.22.2
  - @antv/l7-utils@2.22.2

## 2.22.1

### Patch Changes

- Updated dependencies []:
  - @antv/l7-core@2.22.1
  - @antv/l7-maps@2.22.1
  - @antv/l7-source@2.22.1
  - @antv/l7-utils@2.22.1

## 2.22.0

### Patch Changes

- [#2529](https://github.com/antvis/L7/pull/2529) [`ce90571`](https://github.com/antvis/L7/commit/ce90571ba77686790b2476936b9466657e187ae8) Thanks [@lvisei](https://github.com/lvisei)! - fix: mapbox 线图层的贴图变形

- [#2529](https://github.com/antvis/L7/pull/2529) [`ce90571`](https://github.com/antvis/L7/commit/ce90571ba77686790b2476936b9466657e187ae8) Thanks [@lvisei](https://github.com/lvisei)! - fix: 解决 GeometryLayer 在不同底图上的渲染不一致情况

- [#2529](https://github.com/antvis/L7/pull/2529) [`ce90571`](https://github.com/antvis/L7/commit/ce90571ba77686790b2476936b9466657e187ae8) Thanks [@lvisei](https://github.com/lvisei)! - fix: 修复热力蜂窝图层渲染空白

- [#2529](https://github.com/antvis/L7/pull/2529) [`ce90571`](https://github.com/antvis/L7/commit/ce90571ba77686790b2476936b9466657e187ae8) Thanks [@lvisei](https://github.com/lvisei)! - fix: Mapbox/Maplibre 20 层级以上数据偏移问题
  fix: 修复点图层部分 shape 中心点计算有误
  fix: 修复立体面图层光照计算有误

- [#2529](https://github.com/antvis/L7/pull/2529) [`ce90571`](https://github.com/antvis/L7/commit/ce90571ba77686790b2476936b9466657e187ae8) Thanks [@lvisei](https://github.com/lvisei)! - fix: mapbox 下部分面数据图层绘制异常

- Updated dependencies [[`ce90571`](https://github.com/antvis/L7/commit/ce90571ba77686790b2476936b9466657e187ae8), [`ce90571`](https://github.com/antvis/L7/commit/ce90571ba77686790b2476936b9466657e187ae8), [`ce90571`](https://github.com/antvis/L7/commit/ce90571ba77686790b2476936b9466657e187ae8), [`ce90571`](https://github.com/antvis/L7/commit/ce90571ba77686790b2476936b9466657e187ae8), [`ce90571`](https://github.com/antvis/L7/commit/ce90571ba77686790b2476936b9466657e187ae8)]:
  - @antv/l7-maps@2.22.0
  - @antv/l7-core@2.22.0
  - @antv/l7-source@2.22.0
  - @antv/l7-utils@2.22.0

## 2.21.11-beta.7

### Patch Changes

- Updated dependencies []:
  - @antv/l7-core@2.21.11-beta.7
  - @antv/l7-maps@2.21.11-beta.7
  - @antv/l7-source@2.21.11-beta.7
  - @antv/l7-utils@2.21.11-beta.7

## 2.21.11-beta.6

### Patch Changes

- [#2523](https://github.com/antvis/L7/pull/2523) [`67647e9`](https://github.com/antvis/L7/commit/67647e95c5b06b593604310c78c6a0ec195c3a01) Thanks [@lvisei](https://github.com/lvisei)! - fix: 解决 GeometryLayer 在不同底图上的渲染不一致情况

- Updated dependencies []:
  - @antv/l7-maps@2.21.11-beta.6
  - @antv/l7-core@2.21.11-beta.6
  - @antv/l7-source@2.21.11-beta.6
  - @antv/l7-utils@2.21.11-beta.6

## 2.21.11-beta.5

### Patch Changes

- Updated dependencies [[`8939e9b`](https://github.com/antvis/L7/commit/8939e9bc0e744d75b5b469c221d6695c7a313e83)]:
  - @antv/l7-maps@2.21.11-beta.5
  - @antv/l7-core@2.21.11-beta.5
  - @antv/l7-source@2.21.11-beta.5
  - @antv/l7-utils@2.21.11-beta.5

## 2.21.11-beta.4

### Patch Changes

- Updated dependencies [[`cca16a3`](https://github.com/antvis/L7/commit/cca16a3d72de462afa9d71c386c82f92952d1c47)]:
  - @antv/l7-maps@2.21.11-beta.4
  - @antv/l7-core@2.21.11-beta.4
  - @antv/l7-source@2.21.11-beta.4
  - @antv/l7-utils@2.21.11-beta.4

## 2.21.11-beta.3

### Patch Changes

- Updated dependencies [[`a5f57ed`](https://github.com/antvis/L7/commit/a5f57eda52dab160fe076f252ad52cd51b8f456a)]:
  - @antv/l7-core@2.21.11-beta.3
  - @antv/l7-maps@2.21.11-beta.3
  - @antv/l7-source@2.21.11-beta.3
  - @antv/l7-utils@2.21.11-beta.3

## 2.21.11-beta.2

### Patch Changes

- [#2500](https://github.com/antvis/L7/pull/2500) [`0754eeb`](https://github.com/antvis/L7/commit/0754eebe5c029c808958a5f29492ed2487263c7f) Thanks [@lvisei](https://github.com/lvisei)! - fix: 修复热力蜂窝图层渲染空白

- Updated dependencies []:
  - @antv/l7-core@2.21.11-beta.2
  - @antv/l7-maps@2.21.11-beta.2
  - @antv/l7-source@2.21.11-beta.2
  - @antv/l7-utils@2.21.11-beta.2

## 2.21.11-beta.1

### Patch Changes

- Updated dependencies []:
  - @antv/l7-core@2.21.11-beta.1
  - @antv/l7-maps@2.21.11-beta.1
  - @antv/l7-source@2.21.11-beta.1
  - @antv/l7-utils@2.21.11-beta.1

## 2.21.11-beta.0

### Patch Changes

- [#2474](https://github.com/antvis/L7/pull/2474) [`3e33888`](https://github.com/antvis/L7/commit/3e33888a56c6efa80be60bc79182644eaccaa500) Thanks [@lvisei](https://github.com/lvisei)! - fix: mapbox 线图层的贴图变形

- [#2453](https://github.com/antvis/L7/pull/2453) [`d408bdb`](https://github.com/antvis/L7/commit/d408bdb4a2a7be57a50f9a88247cf7b690ba4387) Thanks [@lvisei](https://github.com/lvisei)! - fix: mapbox 下部分面数据图层绘制异常

- Updated dependencies []:
  - @antv/l7-core@2.21.11-beta.0
  - @antv/l7-maps@2.21.11-beta.0
  - @antv/l7-source@2.21.11-beta.0
  - @antv/l7-utils@2.21.11-beta.0

## 2.21.10

### Patch Changes

- Updated dependencies []:
  - @antv/l7-core@2.21.10
  - @antv/l7-maps@2.21.10
  - @antv/l7-source@2.21.10
  - @antv/l7-utils@2.21.10

## 2.21.9

### Patch Changes

- [#2460](https://github.com/antvis/L7/pull/2460) [`8193864`](https://github.com/antvis/L7/commit/8193864e44acf05d92677b2cabb25211ffd628cb) Thanks [@lvisei](https://github.com/lvisei)! - fix: device 渲染模式下 setData 时不生效

- Updated dependencies []:
  - @antv/l7-core@2.21.9
  - @antv/l7-maps@2.21.9
  - @antv/l7-source@2.21.9
  - @antv/l7-utils@2.21.9

## 2.21.8

### Patch Changes

- Updated dependencies []:
  - @antv/l7-maps@2.21.8
  - @antv/l7-core@2.21.8
  - @antv/l7-source@2.21.8
  - @antv/l7-utils@2.21.8

## 2.21.7

### Patch Changes

- [#2420](https://github.com/antvis/L7/pull/2420) [`bb0af05`](https://github.com/antvis/L7/commit/bb0af057acafeeafd7eb52224ff2863c4a1c302a) Thanks [@lzxue](https://github.com/lzxue)! - fix regl bool uniform

- Updated dependencies [[`bb0af05`](https://github.com/antvis/L7/commit/bb0af057acafeeafd7eb52224ff2863c4a1c302a)]:
  - @antv/l7-core@2.21.7
  - @antv/l7-maps@2.21.7
  - @antv/l7-source@2.21.7
  - @antv/l7-utils@2.21.7

## 2.21.6

### Patch Changes

- Updated dependencies [[`6c38e3c`](https://github.com/antvis/L7/commit/6c38e3c57b1c1bf876b05199f114f5324cbe070f)]:
  - @antv/l7-source@2.21.6
  - @antv/l7-core@2.21.6
  - @antv/l7-maps@2.21.6
  - @antv/l7-utils@2.21.6

## 2.21.5

### Patch Changes

- Updated dependencies [[`a73f0b6`](https://github.com/antvis/L7/commit/a73f0b6ef8aee79cce346a183e9323dee41176c7)]:
  - @antv/l7-maps@2.21.5
  - @antv/l7-core@2.21.5
  - @antv/l7-source@2.21.5
  - @antv/l7-utils@2.21.5

## 2.21.4

### Patch Changes

- Updated dependencies [[`f1b8c29`](https://github.com/antvis/L7/commit/f1b8c295c44d15f75ce0f60401cf03cc79e9d96b)]:
  - @antv/l7-source@2.21.4
  - @antv/l7-core@2.21.4
  - @antv/l7-maps@2.21.4
  - @antv/l7-utils@2.21.4

## [2.1.12](https://github.com/antvis/L7/compare/v2.1.11...v2.1.12) (2020-04-10)

### Bug Fixes

- 采用非偏移坐标系坐标系解决高德地图中国区域抖动的问题 ([124a1d2](https://github.com/antvis/L7/commit/124a1d27aa97c9a6af1de6d041785c420f02ce4c))
- **heatmap:** 修复热力图某些设备上黑色 fix [#278](https://github.com/antvis/L7/issues/278) ([b8f5899](https://github.com/antvis/L7/commit/b8f58992d1fce38fdaac9d82ebfbec14e35298bd))

## [2.1.11](https://github.com/antvis/L7/compare/v2.1.10...v2.1.11) (2020-04-07)

**Note:** Version bump only for package @antv/l7-layers

## [2.1.8](https://github.com/antvis/L7/compare/v2.1.7...v2.1.8) (2020-03-26)

### Bug Fixes

- 3d 热力图抖动问题 fixes [#138](https://github.com/antvis/L7/issues/138) [#263](https://github.com/antvis/L7/issues/263) ([d56e8d6](https://github.com/antvis/L7/commit/d56e8d6205942ca12fa7ac3dfd226aecbb850ed2))

## [2.1.7](https://github.com/antvis/L7/compare/v2.1.6...v2.1.7) (2020-03-26)

### Bug Fixes

- 修复颜色纹理取色问题 & 图片标注默认颜色问题 ([9d6b198](https://github.com/antvis/L7/commit/9d6b198f76b44c55ce0a094c6649c9e4130a398b))

## [2.1.5](https://github.com/antvis/L7/compare/v2.1.4...v2.1.5) (2020-03-20)

**Note:** Version bump only for package @antv/l7-layers

## [2.1.3](https://github.com/antvis/L7/compare/v2.0.36...v2.1.3) (2020-03-17)

### Bug Fixes

- fix build layer opactiy ([5a58ab8](https://github.com/antvis/L7/commit/5a58ab8f86ec969ca384e984784355c2c91b1a47))
- merge conflict ([89c8cb2](https://github.com/antvis/L7/commit/89c8cb2c0250eb5a28d96d82c87b804bf3db4c30))
- 图层不可见,取消拾取 ([f4abe6a](https://github.com/antvis/L7/commit/f4abe6a6b91d9d568573018ed4cad6cf01c592d3))

## [2.1.2](https://github.com/antvis/L7/compare/v2.0.36...v2.1.2) (2020-03-15)

### Bug Fixes

- merge conflict ([89c8cb2](https://github.com/antvis/L7/commit/89c8cb2c0250eb5a28d96d82c87b804bf3db4c30))
- 图层不可见,取消拾取 ([f4abe6a](https://github.com/antvis/L7/commit/f4abe6a6b91d9d568573018ed4cad6cf01c592d3))

## [2.1.1](https://github.com/antvis/L7/compare/v2.0.36...v2.1.1) (2020-03-15)

**Note:** Version bump only for package @antv/l7-layers

## [2.0.34](https://github.com/antvis/L7/compare/v2.0.32...v2.0.34) (2020-03-02)

**Note:** Version bump only for package @antv/l7-layers

# [2.0.0-beta.28](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.28) (2020-01-02)

### Bug Fixes

- **pointlayer:** point amimate ([fd66d90](https://github.com/antvis/L7/commit/fd66d90c1dad1925d1b8a3c99e89172a16bb9f60))
- animate time ([d2b8041](https://github.com/antvis/L7/commit/d2b8041ebe77753f5687383ce690950b745f748c))
- layer style storkeColor->stroke ([27f66a9](https://github.com/antvis/L7/commit/27f66a9918a3568f7f591af161953ac498d2dcba))
- 高德地图底图模式,事件交互注册顺序的问题导致不生效 ([2ad4289](https://github.com/antvis/L7/commit/2ad4289e75519f956a9cb1b44a7231b1151c88fb))
- **layer:** fix default model config ([2301419](https://github.com/antvis/L7/commit/2301419aadf00a887fc22728b9797e6c1149bead))
- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- add raster layer ([2b28380](https://github.com/antvis/L7/commit/2b2838015198b8586b0c30fdc154116252a76f29))
- point text add overlap ([98869d8](https://github.com/antvis/L7/commit/98869d876b0e98dd9258c97b9be9f5a69c0a1612))
- polygon 支持text ([f5a1546](https://github.com/antvis/L7/commit/f5a15465e230e6f58c92bec5f12b132bc9a9ae91))
- **layer:** add blend 效果配置支持 normal,additive ([e0ab4cd](https://github.com/antvis/L7/commit/e0ab4cd386f53ba4e93aaebfb1fa05b6e438710e))
- **layer:** add citybuildinglayer & add line add animate ([d657286](https://github.com/antvis/L7/commit/d657286d58c795ba968ae930eb382ca422bdbd08))
- **layer:** add setSelect setActive 方法 & refactor color util ([5c27d66](https://github.com/antvis/L7/commit/5c27d66a6401192f5e0406a2f4c3e0983dc2867c))
- **layer:** pointLayer add text model ([84a9193](https://github.com/antvis/L7/commit/84a9193e3a8a311bb52bbedabc8847eabba7dc9a))
- scene 实例化支持传入地图实例 & 更新文档 ([cb1d4b6](https://github.com/antvis/L7/commit/cb1d4b6c7d0e65a5e15138ae01adb56cd1b6ee43))
- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
- **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))

# [2.0.0-beta.27](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.27) (2020-01-01)

### Bug Fixes

- **pointlayer:** point amimate ([fd66d90](https://github.com/antvis/L7/commit/fd66d90c1dad1925d1b8a3c99e89172a16bb9f60))
- animate time ([d2b8041](https://github.com/antvis/L7/commit/d2b8041ebe77753f5687383ce690950b745f748c))
- layer style storkeColor->stroke ([27f66a9](https://github.com/antvis/L7/commit/27f66a9918a3568f7f591af161953ac498d2dcba))
- 高德地图底图模式,事件交互注册顺序的问题导致不生效 ([2ad4289](https://github.com/antvis/L7/commit/2ad4289e75519f956a9cb1b44a7231b1151c88fb))
- **layer:** fix default model config ([2301419](https://github.com/antvis/L7/commit/2301419aadf00a887fc22728b9797e6c1149bead))
- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- point text add overlap ([98869d8](https://github.com/antvis/L7/commit/98869d876b0e98dd9258c97b9be9f5a69c0a1612))
- polygon 支持text ([f5a1546](https://github.com/antvis/L7/commit/f5a15465e230e6f58c92bec5f12b132bc9a9ae91))
- **layer:** add blend 效果配置支持 normal,additive ([e0ab4cd](https://github.com/antvis/L7/commit/e0ab4cd386f53ba4e93aaebfb1fa05b6e438710e))
- **layer:** add citybuildinglayer & add line add animate ([d657286](https://github.com/antvis/L7/commit/d657286d58c795ba968ae930eb382ca422bdbd08))
- **layer:** add setSelect setActive 方法 & refactor color util ([5c27d66](https://github.com/antvis/L7/commit/5c27d66a6401192f5e0406a2f4c3e0983dc2867c))
- **layer:** pointLayer add text model ([84a9193](https://github.com/antvis/L7/commit/84a9193e3a8a311bb52bbedabc8847eabba7dc9a))
- scene 实例化支持传入地图实例 & 更新文档 ([cb1d4b6](https://github.com/antvis/L7/commit/cb1d4b6c7d0e65a5e15138ae01adb56cd1b6ee43))
- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
- **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))

# [2.0.0-alpha.28](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-alpha.28) (2020-01-01)

### Bug Fixes

- animate time ([d2b8041](https://github.com/antvis/L7/commit/d2b8041ebe77753f5687383ce690950b745f748c))
- layer style storkeColor->stroke ([27f66a9](https://github.com/antvis/L7/commit/27f66a9918a3568f7f591af161953ac498d2dcba))
- 高德地图底图模式,事件交互注册顺序的问题导致不生效 ([2ad4289](https://github.com/antvis/L7/commit/2ad4289e75519f956a9cb1b44a7231b1151c88fb))
- **layer:** fix default model config ([2301419](https://github.com/antvis/L7/commit/2301419aadf00a887fc22728b9797e6c1149bead))
- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- point text add overlap ([98869d8](https://github.com/antvis/L7/commit/98869d876b0e98dd9258c97b9be9f5a69c0a1612))
- polygon 支持text ([f5a1546](https://github.com/antvis/L7/commit/f5a15465e230e6f58c92bec5f12b132bc9a9ae91))
- **layer:** add blend 效果配置支持 normal,additive ([e0ab4cd](https://github.com/antvis/L7/commit/e0ab4cd386f53ba4e93aaebfb1fa05b6e438710e))
- **layer:** add citybuildinglayer & add line add animate ([d657286](https://github.com/antvis/L7/commit/d657286d58c795ba968ae930eb382ca422bdbd08))
- **layer:** add setSelect setActive 方法 & refactor color util ([5c27d66](https://github.com/antvis/L7/commit/5c27d66a6401192f5e0406a2f4c3e0983dc2867c))
- **layer:** pointLayer add text model ([84a9193](https://github.com/antvis/L7/commit/84a9193e3a8a311bb52bbedabc8847eabba7dc9a))
- scene 实例化支持传入地图实例 & 更新文档 ([cb1d4b6](https://github.com/antvis/L7/commit/cb1d4b6c7d0e65a5e15138ae01adb56cd1b6ee43))
- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
- **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))

# [2.0.0-alpha.27](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-alpha.27) (2019-12-31)

### Bug Fixes

- animate time ([d2b8041](https://github.com/antvis/L7/commit/d2b8041ebe77753f5687383ce690950b745f748c))
- layer style storkeColor->stroke ([27f66a9](https://github.com/antvis/L7/commit/27f66a9918a3568f7f591af161953ac498d2dcba))
- 高德地图底图模式,事件交互注册顺序的问题导致不生效 ([2ad4289](https://github.com/antvis/L7/commit/2ad4289e75519f956a9cb1b44a7231b1151c88fb))
- **layer:** fix default model config ([2301419](https://github.com/antvis/L7/commit/2301419aadf00a887fc22728b9797e6c1149bead))
- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- point text add overlap ([98869d8](https://github.com/antvis/L7/commit/98869d876b0e98dd9258c97b9be9f5a69c0a1612))
- polygon 支持text ([f5a1546](https://github.com/antvis/L7/commit/f5a15465e230e6f58c92bec5f12b132bc9a9ae91))
- **layer:** add blend 效果配置支持 normal,additive ([e0ab4cd](https://github.com/antvis/L7/commit/e0ab4cd386f53ba4e93aaebfb1fa05b6e438710e))
- **layer:** add citybuildinglayer & add line add animate ([d657286](https://github.com/antvis/L7/commit/d657286d58c795ba968ae930eb382ca422bdbd08))
- **layer:** add setSelect setActive 方法 & refactor color util ([5c27d66](https://github.com/antvis/L7/commit/5c27d66a6401192f5e0406a2f4c3e0983dc2867c))
- **layer:** pointLayer add text model ([84a9193](https://github.com/antvis/L7/commit/84a9193e3a8a311bb52bbedabc8847eabba7dc9a))
- scene 实例化支持传入地图实例 & 更新文档 ([cb1d4b6](https://github.com/antvis/L7/commit/cb1d4b6c7d0e65a5e15138ae01adb56cd1b6ee43))
- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
- **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))

# [2.0.0-beta.26](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.26) (2019-12-30)

### Bug Fixes

- animate time ([d2b8041](https://github.com/antvis/L7/commit/d2b8041ebe77753f5687383ce690950b745f748c))
- layer style storkeColor->stroke ([27f66a9](https://github.com/antvis/L7/commit/27f66a9918a3568f7f591af161953ac498d2dcba))
- 高德地图底图模式,事件交互注册顺序的问题导致不生效 ([2ad4289](https://github.com/antvis/L7/commit/2ad4289e75519f956a9cb1b44a7231b1151c88fb))
- **layer:** fix default model config ([2301419](https://github.com/antvis/L7/commit/2301419aadf00a887fc22728b9797e6c1149bead))
- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- point text add overlap ([98869d8](https://github.com/antvis/L7/commit/98869d876b0e98dd9258c97b9be9f5a69c0a1612))
- polygon 支持text ([f5a1546](https://github.com/antvis/L7/commit/f5a15465e230e6f58c92bec5f12b132bc9a9ae91))
- **layer:** add blend 效果配置支持 normal,additive ([e0ab4cd](https://github.com/antvis/L7/commit/e0ab4cd386f53ba4e93aaebfb1fa05b6e438710e))
- **layer:** add citybuildinglayer & add line add animate ([d657286](https://github.com/antvis/L7/commit/d657286d58c795ba968ae930eb382ca422bdbd08))
- **layer:** add setSelect setActive 方法 & refactor color util ([5c27d66](https://github.com/antvis/L7/commit/5c27d66a6401192f5e0406a2f4c3e0983dc2867c))
- **layer:** pointLayer add text model ([84a9193](https://github.com/antvis/L7/commit/84a9193e3a8a311bb52bbedabc8847eabba7dc9a))
- scene 实例化支持传入地图实例 & 更新文档 ([cb1d4b6](https://github.com/antvis/L7/commit/cb1d4b6c7d0e65a5e15138ae01adb56cd1b6ee43))
- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
- **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))

# [2.0.0-beta.25](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.25) (2019-12-27)

### Bug Fixes

- 高德地图底图模式,事件交互注册顺序的问题导致不生效 ([2ad4289](https://github.com/antvis/L7/commit/2ad4289e75519f956a9cb1b44a7231b1151c88fb))
- layer style storkeColor->stroke ([27f66a9](https://github.com/antvis/L7/commit/27f66a9918a3568f7f591af161953ac498d2dcba))
- **layer:** fix default model config ([2301419](https://github.com/antvis/L7/commit/2301419aadf00a887fc22728b9797e6c1149bead))
- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- **layer:** add blend 效果配置支持 normal,additive ([e0ab4cd](https://github.com/antvis/L7/commit/e0ab4cd386f53ba4e93aaebfb1fa05b6e438710e))
- **layer:** add citybuildinglayer & add line add animate ([d657286](https://github.com/antvis/L7/commit/d657286d58c795ba968ae930eb382ca422bdbd08))
- **layer:** add setSelect setActive 方法 & refactor color util ([5c27d66](https://github.com/antvis/L7/commit/5c27d66a6401192f5e0406a2f4c3e0983dc2867c))
- **layer:** pointLayer add text model ([84a9193](https://github.com/antvis/L7/commit/84a9193e3a8a311bb52bbedabc8847eabba7dc9a))
- scene 实例化支持传入地图实例 & 更新文档 ([cb1d4b6](https://github.com/antvis/L7/commit/cb1d4b6c7d0e65a5e15138ae01adb56cd1b6ee43))
- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
- **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))

# [2.0.0-beta.24](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.24) (2019-12-23)

### Bug Fixes

- **layer:** fix default model config ([2301419](https://github.com/antvis/L7/commit/2301419aadf00a887fc22728b9797e6c1149bead))
- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- **layer:** add blend 效果配置支持 normal,additive ([e0ab4cd](https://github.com/antvis/L7/commit/e0ab4cd386f53ba4e93aaebfb1fa05b6e438710e))
- **layer:** add setSelect setActive 方法 & refactor color util ([5c27d66](https://github.com/antvis/L7/commit/5c27d66a6401192f5e0406a2f4c3e0983dc2867c))
- scene 实例化支持传入地图实例 & 更新文档 ([cb1d4b6](https://github.com/antvis/L7/commit/cb1d4b6c7d0e65a5e15138ae01adb56cd1b6ee43))
- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
- **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))

# [2.0.0-beta.23](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.23) (2019-12-23)

### Bug Fixes

- **layer:** fix default model config ([2301419](https://github.com/antvis/L7/commit/2301419aadf00a887fc22728b9797e6c1149bead))
- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- **layer:** add blend 效果配置支持 normal,additive ([e0ab4cd](https://github.com/antvis/L7/commit/e0ab4cd386f53ba4e93aaebfb1fa05b6e438710e))
- **layer:** add setSelect setActive 方法 & refactor color util ([5c27d66](https://github.com/antvis/L7/commit/5c27d66a6401192f5e0406a2f4c3e0983dc2867c))
- scene 实例化支持传入地图实例 & 更新文档 ([cb1d4b6](https://github.com/antvis/L7/commit/cb1d4b6c7d0e65a5e15138ae01adb56cd1b6ee43))
- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
- **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))

# [2.0.0-beta.21](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.21) (2019-12-18)

### Bug Fixes

- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- **layer:** add blend 效果配置支持 normal,additive ([e0ab4cd](https://github.com/antvis/L7/commit/e0ab4cd386f53ba4e93aaebfb1fa05b6e438710e))
- **layer:** add setSelect setActive 方法 & refactor color util ([5c27d66](https://github.com/antvis/L7/commit/5c27d66a6401192f5e0406a2f4c3e0983dc2867c))
- scene 实例化支持传入地图实例 & 更新文档 ([cb1d4b6](https://github.com/antvis/L7/commit/cb1d4b6c7d0e65a5e15138ae01adb56cd1b6ee43))
- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
- **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))

# [2.0.0-beta.20](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.20) (2019-12-12)

### Bug Fixes

- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
- **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))

# [2.0.0-beta.19](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.19) (2019-12-08)

### Bug Fixes

- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))

# [2.0.0-beta.18](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.18) (2019-12-08)

### Bug Fixes

- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))

# [2.0.0-beta.17](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.17) (2019-12-08)

### Bug Fixes

- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))

# [2.0.0-beta.16](https://github.com/antvis/L7/compare/v2.0.0-beta.15...v2.0.0-beta.16) (2019-11-29)

**Note:** Version bump only for package @antv/l7-layers

# [2.0.0-beta.15](https://github.com/antvis/L7/compare/v2.0.0-beta.14...v2.0.0-beta.15) (2019-11-29)

**Note:** Version bump only for package @antv/l7-layers

# [2.0.0-beta.14](https://github.com/antvis/L7/compare/v2.0.0-beta.13...v2.0.0-beta.14) (2019-11-28)

**Note:** Version bump only for package @antv/l7-layers

# [2.0.0-beta.13](https://github.com/antvis/L7/compare/v2.0.0-beta.12...v2.0.0-beta.13) (2019-11-28)

**Note:** Version bump only for package @antv/l7-layers

# [2.0.0-beta.12](https://github.com/antvis/L7/compare/v2.0.0-beta.11...v2.0.0-beta.12) (2019-11-28)

### Bug Fixes

- **component:** fix marker ([14d4818](https://github.com/antvis/L7/commit/14d48184a1579241b077110ed51a8358de25e010))

# 2.0.0-beta.11 (2019-11-28)

### Bug Fixes

- **demo:** bugs ([5a857f9](https://github.com/antvis/L7/commit/5a857f9c1b707c91cbc07b0fc4878be3fe56011b))
- **demo:** demo ([a4e49a6](https://github.com/antvis/L7/commit/a4e49a6f6b25f585ba224f6d92fafd5cb5e0113f))
- **demo:** gatsby ([5faac23](https://github.com/antvis/L7/commit/5faac2306c34ac8f3a02fdc61ad18337a4df7f49))
- **demo:** gatsby ([b6a1785](https://github.com/antvis/L7/commit/b6a1785a0ba432134495f6d9ac65f92ecc045fe8))
- **demo:** update demo ([3ae610f](https://github.com/antvis/L7/commit/3ae610f81421fb2720966dde76f5988dac8acc02))
- **doc:** file name lowercase ([3cbdc9c](https://github.com/antvis/L7/commit/3cbdc9c7f1d9be34e9c917f05531323946993eb4))
- **fix confilict:** conflict ([8a09ae2](https://github.com/antvis/L7/commit/8a09ae24bef7ba845e5b16759b3ecac210e472c5))
- **fix css:** fix css png ([f7e5376](https://github.com/antvis/L7/commit/f7e5376b7d6c64b2b078dca8f2a230f4fce14c68))
- **layer:** fix merge conflict ([6f33e5f](https://github.com/antvis/L7/commit/6f33e5f72bc9e72202db12a059dcd6c88da41084))
- **layers:** heatmap 3d effect ([38d1736](https://github.com/antvis/L7/commit/38d173610fbf729dfc3a6fae94ad27bb68f33cb8))
- **layers:** heatmap 3d effect ([c99bb27](https://github.com/antvis/L7/commit/c99bb27d94ad9b6b1e85b7b153953dd2a7455db8))
- **layerservice:** fix init bugs in layer service ([8cbbf7b](https://github.com/antvis/L7/commit/8cbbf7b28d63f4df16f061a4ae21726f243e7108))
- **layerservice:** fix init bugs in layer service ([8844243](https://github.com/antvis/L7/commit/8844243050f619b28043c4e9ed1942fe172f561e))
- **map:** use P20 offset coordinates ([393e891](https://github.com/antvis/L7/commit/393e891a22098db3bcfb036a7182a45238ca6a73)), closes [#94](https://github.com/antvis/L7/issues/94)
- **master:** merge master branch fix conflict ([2ea903e](https://github.com/antvis/L7/commit/2ea903ee3f17bfdb670abfb1d252de8b6222b19f))
- **merge:** fix conflict ([07e8505](https://github.com/antvis/L7/commit/07e85059ebd40506623253feb624ee3083f393ae))
- **merge:** merge next branch ([30597d9](https://github.com/antvis/L7/commit/30597d9a45a728dac230f30ad18c787c7beb4163))
- **merge branch:** fix confilt ([e7a46a6](https://github.com/antvis/L7/commit/e7a46a691d9e67a03d733fd565c6b152ee8715b6))
- **packages:** remove sub modules node_modules ([132b99e](https://github.com/antvis/L7/commit/132b99e4d2bef7ec5565a0b18c5659e8b246944b))
- **raster layer:** raster layer triangle ([cce659a](https://github.com/antvis/L7/commit/cce659aaa1fda8e6964bc6c839b875fa05a89c7d))
- **raster layer:** update raster triangle ([b0f6265](https://github.com/antvis/L7/commit/b0f6265cd3b16c6ff39d0a6693788a25fca7bda2))
- **rm cache:** rm cache ([51ea07e](https://github.com/antvis/L7/commit/51ea07ea664229f775b7c191cfde68299cc8c2d5))
- **site:** megre conflict ([1b5619b](https://github.com/antvis/L7/commit/1b5619b3945e97919e0c616a48ba2265a2a95c22))
- **stories:** conflict ([f7be720](https://github.com/antvis/L7/commit/f7be720db1753b1b3643c0f3669c40d4b712f37b))
- **tslint:** fix tslint error ([aed5e9e](https://github.com/antvis/L7/commit/aed5e9e51b5dd214cc19baece7dd0138b336a5d5))

### Features

- **add l7 site:** add websites ([0463ff8](https://github.com/antvis/L7/commit/0463ff874eab1c484b593e8c02f73c85a02c000c))
- **add point demo:** add demo ([90f6945](https://github.com/antvis/L7/commit/90f6945feb4818842c6231f5b5683db6cda15a73))
- **component:** add layer control ([7f4646e](https://github.com/antvis/L7/commit/7f4646efd3b0004fde4e9f6860e618c7668af1a7))
- **component:** add scale ,zoom, popup, marker map method ([a6baef4](https://github.com/antvis/L7/commit/a6baef4954c11d9c6582c27de2ba667f18538460))
- **core:** add map method ([853c190](https://github.com/antvis/L7/commit/853c1901fbb8559a9d3bdb3631ec13a7dcaf0ea7))
- **demo:** add point chart demo ([8c2e4a8](https://github.com/antvis/L7/commit/8c2e4a82bf7a49b29004d5e261d8e9c46cd0bd9d))
- **layer:** 新增sourceplugin, attribute 增加类型判断 ([2570b8c](https://github.com/antvis/L7/commit/2570b8c242af29bae07640b1ec7eaadfb04ec9d6))
- **layer:** add arc2d layer ([420459c](https://github.com/antvis/L7/commit/420459ce5aee91dc8d6f770a2a2078c7e5bca4bf))
- **layer:** add imagelayer ([a995815](https://github.com/antvis/L7/commit/a995815284652ca5d6e013c547b617fa52039ddc))
- **layer:** add point line polygon image layer ([54f28be](https://github.com/antvis/L7/commit/54f28be495af94a39313b7840c69725be16dc1e2))
- **layer:** point layer ([3da72c8](https://github.com/antvis/L7/commit/3da72c83ff0577455a29ba98df4bb7cd8838328a))
- **layers:** add arclayer ([7e499fd](https://github.com/antvis/L7/commit/7e499fdc877d9715000c138a5d3505924ebd083e))
- **layers:** add girdheatmap add raster imagelayer ([ddd1d0e](https://github.com/antvis/L7/commit/ddd1d0ef38cc44767d2ec5329eb844c31d847938))
- **layers:** add heatmap 3d layer ([cd8409e](https://github.com/antvis/L7/commit/cd8409e4cb234f850f2d46dd68b35f4848daf74b))
- **layers:** add heatmap layer ([e04b3b2](https://github.com/antvis/L7/commit/e04b3b268b9fdc4bea150d2db1fdaae227f51fc8))
- **layers:** add polygon3d , pointimagelayer ([75f2eaa](https://github.com/antvis/L7/commit/75f2eaa083064ff21c8bbe13f5f6770682c23241))
- **layers:** add polygon3d , pointimagelayer ([bda6b6c](https://github.com/antvis/L7/commit/bda6b6cfb06193f6ae83e505a9c8667811d80a2f))
- **multi-pass:** support TAA(Temporal Anti-Aliasing) ([2cf0824](https://github.com/antvis/L7/commit/2cf082439ad04eb84b96b2922e45082476452aec))
- **picking:** support advanced picking API: `layer.pick({x, y})` ([3e22f21](https://github.com/antvis/L7/commit/3e22f21a5c658e4ade31c0506bd77ae787ec2fcc))
- **picking:** support PixelPickingPass and highlight the picked feature ([ff0ffa0](https://github.com/antvis/L7/commit/ff0ffa057e2f533dc6ac92f40d3892f9dd57fafb))
- **point image:** add point image ([89b2513](https://github.com/antvis/L7/commit/89b25133a17f308c3e884c49baebcd3cc7a9470a))
- **post-processing:** add some post processing effects ([1d8e15c](https://github.com/antvis/L7/commit/1d8e15cec11abc62785bc68c8281550732550839))
- **scene:** scene service inTransientScope ([ccf1ff4](https://github.com/antvis/L7/commit/ccf1ff464e1b220650e61c0999846725b075ef3a))
- **schema-validation:** support validation for layer's options ([9c5766d](https://github.com/antvis/L7/commit/9c5766d0e37958d67f7072d465f51e2aa3d53939))
