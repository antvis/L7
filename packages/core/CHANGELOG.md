# Change Log

## 3.0.0-beta.1

### Minor Changes

- [`af62247`](https://github.com/antvis/L7/commit/af622479123a01437e6d498bf4b06402f99de57f) Thanks [@lzxue](https://github.com/lzxue)! - refactor(core): add EncodeStyleKind type for encode-style channels (stage-3 3.3)

  P4 阶段 3 第二刀（3.3，core 侧，minor）。

  新增 `export type EncodeStyleKind = 'shader' | 'data'`
  （`services/layer/ILayerService.ts`），标样式属性参与数据映射的通道：

  - `'shader'`：shader 端 uniform 注入（历史 `enableShaderEncodeStyles`）
  - `'data'`：数据层数据映射（历史 `enableDataEncodeStyles`）

  `ILayer.enableShaderEncodeStyles` / `enableDataEncodeStyles` 公开数组契约
  **保留不变**（外部 `layer.enableShaderEncodeStyles` 读取维持数组），补 JSDoc
  指明其为「公开数组 getter 桥接，内部单一真源 `encodeStyles: Map`」。

  配套 layers 侧声明同步见 `refactor-layers-encode-styles-converge` changeset。
  验证：core eslint 0 error、prettier 通过、core father build 98 files。

- [`15c19a3`](https://github.com/antvis/L7/commit/15c19a3a0b297cac02533dccb8b11f00a374e047) Thanks [@lzxue](https://github.com/lzxue)! - refactor(core): type encodeStyleAttribute via IEncodedStyleMap (stage-3 3.2)

  P4 阶段 3 第一刀（3.2，core 侧 typing 子集，minor）。

  PLAN 3.2 列举四项替 `any`：经审 `sourceOption`/`shapeOption`/`defaultSourceConfig`
  已在历史阶段各自定型为 `ISourceOption`/`IShapeOption`/`IDefaultSourceConfig`
  （PLAN 草拟时未及同步），故本轮仅收编真正剩余的 `encodeStyleAttribute:
Record<string, any>` 缺口。

  新增（`services/layer/ILayerService.ts`，minor 依据）：

  - `export interface IEncodedStyleValue` — 单条数据映射样式值，对齐
    `updateStyleAttribute` 的 `field`/`values` 形参（值键名历史为 `value`
    单数）；`field?: StyleAttributeField`、`value?: StyleAttributeOption`，
    保留 `[key: string]: any` 索引签名兼容历史透传的额外字段（非破坏性收窄）。
  - `export type IEncodedStyleMap = Record<string, IEncodedStyleValue>`。

  `ILayer.encodeStyleAttribute: Record<string, any>` → `IEncodedStyleMap`。

  **向后兼容**：`any`→具名类型是收窄但非破坏——写入侧 `encodeStyle(options: {[k]:any})`
  的 `options[key]`（`any`）仍可赋值 `IEncodedStyleValue`；读取侧 `getDynamicStyleInject`
  形参 `Record<string, any>` 接受 `IEncodedStyleMap`。

  配套 layers 侧声明同步见 `refactor-layers-encoded-style-map` changeset。
  `getScale(name)` 泛型化归后续 scale delegate 专属刀（3.2 剩余子项），本刀聚焦
  `encodeStyleAttribute` 缺口。

  验证：core eslint 0 error、prettier 通过、core father build 98 files（d.ts 类型检查）。

- [`8ce2a7a`](https://github.com/antvis/L7/commit/8ce2a7aeb0cba7d82f405d3ae38bf80154efabfc) Thanks [@lzxue](https://github.com/lzxue)! - refactor(core): genericize ILayer.getScale with IStyleScale default (stage-3 3.2)

  P4 阶段 3 第二刀收尾（3.2，core 侧，minor）。

  `ILayer.getScale(name: string): any` →
  `getScale<T = IStyleScale>(name: string): T`（`ILayerService.ts`）。
  默认 `IStyleScale` 为该返回路径的实际语义结构
  （`scale`/`field`/`type`/`option`，见 `IStyleAttributeService`），
  比 `any` 严格且对未指定 `T` 的调用方保持类型安全；调用方可显式 opt-in
  泛型。底层 `styleAttributeService.getLayerAttributeScale(name)` 仍返
  `any`（scaler 结构未具名，归后续 scale service 专属刀），经 `as T`
  透传不引入类型错误。

  运行时零行为变化，仅类型面收紧。配套 layers 侧实现同步见
  `refactor-layers-getscale-generic` changeset。

  验证：core eslint 0 error、prettier 通过、core father build 98 files
  （d.ts 生成、类型检查通过）。

- [`a642560`](https://github.com/antvis/L7/commit/a64256031aead81f30d6c4cea6ab78d3d365f14a) Thanks [@lzxue](https://github.com/lzxue)! - refactor(core): add optional metadata to ILayerPlugin (stage-2 2.2)

  P4 阶段 2 第二刀（2.2，跨包 core 侧，minor）。

  给 `ILayerPlugin` 接口（`services/layer/ILayerService.ts`）补三个可选元数据字段，
  为 `LayerPluginRegistry`（2.1）的声明式排序与按名替换提供契约基础：

  - `name?: string` — 插件名（kebab-case，唯一标识符）。供 `LayerPluginRegistry.replace(name, plugin)` / `getByName(name)` 按名索引，亦便于调试日志与 `addPlugin` 顺序观测。
  - `order?: number` — 声明式排序优先级（升序）。`LayerPluginRegistry.sortByOrder()` 据此稳定排序；缺省视 `Infinity` 兜底，相同 order（含均为 undefined）保持插入序。
  - `initStage?: 'init' | 'afterInit'` — 初始化阶段标记。当前 14 内置插件均为 `'init'`，字段为未来按阶段分流的 registry 改造预留（2.2 仅声明，不改 apply 时序）。

  **向后兼容**：三字段均为可选，既有 `implements ILayerPlugin` 类不声明元数据也编译通过。
  配套 layers 侧改动见 `refactor-layers-p4-stage2-plugin-metadata` changeset。

  验证：core eslint 0 error、prettier 通过、core father build 98 files（含 declaration d.ts 真实类型检查）。

- [`fa33b9d`](https://github.com/antvis/L7/commit/fa33b9dbd9efd52dda38c741e8e7f47951167086) Thanks [@lzxue](https://github.com/lzxue)! - refactor(core): tighten IBaseTileLayer + make ILayer.tileLayer optional (stage-5 5.1)

  P4 阶段 5 第一刀（5.1，core 侧，minor）。

  `ILayer.tileLayer` 原声明为非可选 `IBaseTileLayer`，但运行时
  对非瓦片图层始终为 `undefined`（`Scene.initTileLayer` 仅在
  `source.isTile` 时赋值；mock 一律传 `undefined`）。非可选契约被
  实现侧 `any | undefined` 长期掩盖。本刀将其改为
  `tileLayer: IBaseTileLayer | undefined`，使接口如实反映「瓦片图层
  才有、其余为 undefined」的语义。

  同时向 `IBaseTileLayer` 补 `reload(): void` —— `BaseTileLayer` 已
  实现该方法且 `BaseLayer.onSourceUpdate` 经 `this.tileLayer.reload()`
  外部调用，属公共能力，补入接口使其成为正式契约（additive，非破坏）。

  下游实现侧（`@antv/l7-layers` `BaseLayer.tileLayer`）由 `any` 对齐
  为 `IBaseTileLayer | undefined`，见 `refactor-layers-tilelayer-type`
  changeset。

  运行时零行为变化，仅类型面收紧/修正。所有 `.tileLayer` 消费点均经
  真值守护或可选链（`LayerPickService` / `BaseLayer.render|destroy|
onSourceUpdate` / `Tile.getMaskLayer` / `DataSourcePlugin` /
  `LayerMaskPlugin`），可选化不引入新空指针面。

  验证：core eslint 0 error、prettier 通过、core father build 98
  files（d.ts OK）。layers + scene father build 均通过（279 / 66
  files），非 GL jest 子集 25 suites / 158 passed 与基线一致。

### Patch Changes

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

- Updated dependencies [[`d45cb50`](https://github.com/antvis/L7/commit/d45cb50516a57be2b63237385050a9716901211f)]:
  - @antv/l7-utils@3.0.0-beta.1

## 2.30.0-beta.0

### Patch Changes

- Updated dependencies []:
  - @antv/l7-utils@2.30.0-beta.0

## 2.29.1

### Patch Changes

- chore: upgrade deprecated dependencies and pnpm to v11
- Updated dependencies []:
  - @antv/l7-utils@2.29.1

## 2.28.14

### Patch Changes

- Release 2.28.14.

- Updated dependencies []:
  - @antv/l7-utils@2.28.14

## 2.28.13

### Patch Changes

- Release 2.28.13.

- Updated dependencies []:
  - @antv/l7-utils@2.28.13

## 2.28.12

### Patch Changes

- Updated dependencies []:
  - @antv/l7-utils@2.28.12

## 2.25.9

### Patch Changes

- fix: revert to version 2.25.4 and fix text rendering issue

- Updated dependencies []:
  - @antv/l7-utils@2.25.9

## 2.25.4

### Patch Changes

- Updated dependencies []:
  - @antv/l7-utils@2.25.4

## 2.23.3-beta.3

### Patch Changes

- revert: 回滚事件系统到 hammerjs 实现，修复移除 hammerjs 后的兼容性问题

- Updated dependencies []:
  - @antv/l7-utils@2.23.3-beta.3

## 2.23.3-beta.2

### Patch Changes

- fix: 修复移除 hammerjs 后的事件系统兼容性问题
  - 修复 triggerHover 方法签名与接口不符，补全 lngLat 和 type 参数，解决 layer.pick() 拾取失效问题
  - SceneService 补充 Press 事件监听，保持长按事件向后兼容
  - amap-next: 修复 wrapper 容器定位上下文和高度初始化问题

- Updated dependencies []:
  - @antv/l7-utils@2.23.3-beta.2

## 2.23.3-beta.1

### Patch Changes

- 版本更新

- Updated dependencies []:
  - @antv/l7-utils@2.23.3-beta.1

## 2.23.3-beta.0

### Patch Changes

- [`8248e26`](https://github.com/antvis/L7/commit/8248e264c6cad611547c7f9730540ab0729115ac) Thanks [@lzxue](https://github.com/lzxue)! - patch 版本

- Updated dependencies [[`8248e26`](https://github.com/antvis/L7/commit/8248e264c6cad611547c7f9730540ab0729115ac)]:
  - @antv/l7-utils@2.23.3-beta.0

## 2.23.2

### Patch Changes

- [`a3e9a44`](https://github.com/antvis/L7/commit/a3e9a440e43030a297ee8dd32aabb32c10624e7d) Thanks [@lzxue](https://github.com/lzxue)! - rename source

- Updated dependencies [[`a3e9a44`](https://github.com/antvis/L7/commit/a3e9a440e43030a297ee8dd32aabb32c10624e7d)]:
  - @antv/l7-utils@2.23.2

## 2.23.1

### Patch Changes

- [`7932838`](https://github.com/antvis/L7/commit/79328384d8b1deb547ff2422aaa4366201dfe9b2) Thanks [@lzxue](https://github.com/lzxue)! - 更新demo

- [`4f690b8`](https://github.com/antvis/L7/commit/4f690b837a322bc9923baf2b387ea43d37ba1e5d) Thanks [@lzxue](https://github.com/lzxue)! - 移动端事件

- Updated dependencies [[`7932838`](https://github.com/antvis/L7/commit/79328384d8b1deb547ff2422aaa4366201dfe9b2), [`4f690b8`](https://github.com/antvis/L7/commit/4f690b837a322bc9923baf2b387ea43d37ba1e5d)]:
  - @antv/l7-utils@2.23.1

## 2.22.6

### Patch Changes

- [#2726](https://github.com/antvis/L7/pull/2726) [`c357dc8`](https://github.com/antvis/L7/commit/c357dc8520e1d3f53af60e4a325096da2d4e223c) Thanks [@lzxue](https://github.com/lzxue)! - 相对坐标系支持

- Updated dependencies []:
  - @antv/l7-utils@2.22.6

## 2.22.5

### Patch Changes

- [#2680](https://github.com/antvis/L7/pull/2680) [`42134f3`](https://github.com/antvis/L7/commit/42134f3aac3f2814e167bedca3c84b98766ebd6e) Thanks [@XinyueDu](https://github.com/XinyueDu)! - update version

- Updated dependencies [[`42134f3`](https://github.com/antvis/L7/commit/42134f3aac3f2814e167bedca3c84b98766ebd6e)]:
  - @antv/l7-utils@2.22.5

## 2.22.4

### Patch Changes

- [#2631](https://github.com/antvis/L7/pull/2631) [`8a9413f`](https://github.com/antvis/L7/commit/8a9413fa842397d7eb2beae18e896ffddc9abdf4) Thanks [@lzxue](https://github.com/lzxue)! - raster tile extent

- Updated dependencies [[`8a9413f`](https://github.com/antvis/L7/commit/8a9413fa842397d7eb2beae18e896ffddc9abdf4)]:
  - @antv/l7-utils@2.22.4

## 2.22.3

### Patch Changes

- Updated dependencies []:
  - @antv/l7-utils@2.22.3

## 2.22.2

### Patch Changes

- [#2631](https://github.com/antvis/L7/pull/2631) [`8a9413f`](https://github.com/antvis/L7/commit/8a9413fa842397d7eb2beae18e896ffddc9abdf4) Thanks [@lzxue](https://github.com/lzxue)! - raster tile extent

- Updated dependencies [[`8a9413f`](https://github.com/antvis/L7/commit/8a9413fa842397d7eb2beae18e896ffddc9abdf4)]:
  - @antv/l7-utils@2.22.2

## 2.22.1

### Patch Changes

- Updated dependencies []:
  - @antv/l7-utils@2.22.1

## 2.22.0

### Patch Changes

- [#2529](https://github.com/antvis/L7/pull/2529) [`ce90571`](https://github.com/antvis/L7/commit/ce90571ba77686790b2476936b9466657e187ae8) Thanks [@lvisei](https://github.com/lvisei)! - fix: 在 WebGL2 拾取事件冒泡延迟问题

- [#2529](https://github.com/antvis/L7/pull/2529) [`ce90571`](https://github.com/antvis/L7/commit/ce90571ba77686790b2476936b9466657e187ae8) Thanks [@lvisei](https://github.com/lvisei)! - fix: Mapbox/Maplibre 20 层级以上数据偏移问题
  fix: 修复点图层部分 shape 中心点计算有误
  fix: 修复立体面图层光照计算有误
- Updated dependencies []:
  - @antv/l7-utils@2.22.0

## 2.21.11-beta.7

### Patch Changes

- Updated dependencies []:
  - @antv/l7-utils@2.21.11-beta.7

## 2.21.11-beta.6

### Patch Changes

- Updated dependencies []:
  - @antv/l7-utils@2.21.11-beta.6

## 2.21.11-beta.5

### Patch Changes

- Updated dependencies []:
  - @antv/l7-utils@2.21.11-beta.5

## 2.21.11-beta.4

### Patch Changes

- Updated dependencies []:
  - @antv/l7-utils@2.21.11-beta.4

## 2.21.11-beta.3

### Patch Changes

- [#2511](https://github.com/antvis/L7/pull/2511) [`a5f57ed`](https://github.com/antvis/L7/commit/a5f57eda52dab160fe076f252ad52cd51b8f456a) Thanks [@lvisei](https://github.com/lvisei)! - fix: 在 WebGL2 拾取事件冒泡延迟问题

- Updated dependencies []:
  - @antv/l7-utils@2.21.11-beta.3

## 2.21.11-beta.2

### Patch Changes

- Updated dependencies []:
  - @antv/l7-utils@2.21.11-beta.2

## 2.21.11-beta.1

### Patch Changes

- Updated dependencies []:
  - @antv/l7-utils@2.21.11-beta.1

## 2.21.11-beta.0

### Patch Changes

- Updated dependencies []:
  - @antv/l7-utils@2.21.11-beta.0

## 2.21.10

### Patch Changes

- Updated dependencies []:
  - @antv/l7-utils@2.21.10

## 2.21.9

### Patch Changes

- Updated dependencies []:
  - @antv/l7-utils@2.21.9

## 2.21.8

### Patch Changes

- Updated dependencies []:
  - @antv/l7-utils@2.21.8

## 2.21.7

### Patch Changes

- [#2420](https://github.com/antvis/L7/pull/2420) [`bb0af05`](https://github.com/antvis/L7/commit/bb0af057acafeeafd7eb52224ff2863c4a1c302a) Thanks [@lzxue](https://github.com/lzxue)! - fix regl bool uniform

- Updated dependencies [[`bb0af05`](https://github.com/antvis/L7/commit/bb0af057acafeeafd7eb52224ff2863c4a1c302a)]:
  - @antv/l7-utils@2.21.7

## 2.21.6

### Patch Changes

- Updated dependencies []:
  - @antv/l7-utils@2.21.6

## 2.21.5

### Patch Changes

- Updated dependencies []:
  - @antv/l7-utils@2.21.5

## 2.21.4

### Patch Changes

- Updated dependencies []:
  - @antv/l7-utils@2.21.4

## [2.1.12](https://github.com/antvis/L7/compare/v2.1.11...v2.1.12) (2020-04-10)

### Bug Fixes

- 绘制组件高德地图mousedown事件不能监听的问题 ([1eb3313](https://github.com/antvis/L7/commit/1eb3313919b2c7c9162bee70a249846b897ef4b4))
- 采用非偏移坐标系坐标系解决高德地图中国区域抖动的问题 ([124a1d2](https://github.com/antvis/L7/commit/124a1d27aa97c9a6af1de6d041785c420f02ce4c))

## [2.1.11](https://github.com/antvis/L7/compare/v2.1.10...v2.1.11) (2020-04-07)

### Bug Fixes

- marker event ([ce6eefd](https://github.com/antvis/L7/commit/ce6eefdeb87935f48d7ca2779837270f1498f3a5))

## [2.1.8](https://github.com/antvis/L7/compare/v2.1.7...v2.1.8) (2020-03-26)

### Bug Fixes

- 拾取 invalid x offset ([8282007](https://github.com/antvis/L7/commit/82820077f40998e156337b266623309eff6b2d60))

## [2.1.7](https://github.com/antvis/L7/compare/v2.1.6...v2.1.7) (2020-03-26)

**Note:** Version bump only for package @antv/l7-core

## [2.1.5](https://github.com/antvis/L7/compare/v2.1.4...v2.1.5) (2020-03-20)

### Bug Fixes

- picking ([d6c6694](https://github.com/antvis/L7/commit/d6c66941323fb21e6810e1d72d5b43e40867be71))

## [2.1.3](https://github.com/antvis/L7/compare/v2.0.36...v2.1.3) (2020-03-17)

### Bug Fixes

- ios 12 点击事件问题 & regl 版本锁定 ([ad52e8e](https://github.com/antvis/L7/commit/ad52e8e8fde4a7b4b3e16d86a6035bd7c07fb80c))
- ios touchstart && double touch ([4fc3a11](https://github.com/antvis/L7/commit/4fc3a11de953918a9f5ba13d767c00429d1711cd))
- mapbox 光照问题 ([20d2a6d](https://github.com/antvis/L7/commit/20d2a6d8b803ca3ad87cc1ef69a59d1e3d348cef))
- merge conflict ([89c8cb2](https://github.com/antvis/L7/commit/89c8cb2c0250eb5a28d96d82c87b804bf3db4c30))

## [2.1.2](https://github.com/antvis/L7/compare/v2.0.36...v2.1.2) (2020-03-15)

### Bug Fixes

- ios 12 点击事件问题 & regl 版本锁定 ([ad52e8e](https://github.com/antvis/L7/commit/ad52e8e8fde4a7b4b3e16d86a6035bd7c07fb80c))
- ios touchstart && double touch ([4fc3a11](https://github.com/antvis/L7/commit/4fc3a11de953918a9f5ba13d767c00429d1711cd))
- mapbox 光照问题 ([20d2a6d](https://github.com/antvis/L7/commit/20d2a6d8b803ca3ad87cc1ef69a59d1e3d348cef))
- merge conflict ([89c8cb2](https://github.com/antvis/L7/commit/89c8cb2c0250eb5a28d96d82c87b804bf3db4c30))

## [2.1.1](https://github.com/antvis/L7/compare/v2.0.36...v2.1.1) (2020-03-15)

### Bug Fixes

- ios 12 点击事件问题 & regl 版本锁定 ([ad52e8e](https://github.com/antvis/L7/commit/ad52e8e8fde4a7b4b3e16d86a6035bd7c07fb80c))
- mapbox 光照问题 ([20d2a6d](https://github.com/antvis/L7/commit/20d2a6d8b803ca3ad87cc1ef69a59d1e3d348cef))

## [2.0.34](https://github.com/antvis/L7/compare/v2.0.32...v2.0.34) (2020-03-02)

**Note:** Version bump only for package @antv/l7-core

# [2.0.0-beta.28](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.28) (2020-01-02)

### Bug Fixes

- layer style storkeColor->stroke ([27f66a9](https://github.com/antvis/L7/commit/27f66a9918a3568f7f591af161953ac498d2dcba))
- mapbox token 校验问题 ([6c1f934](https://github.com/antvis/L7/commit/6c1f93425676c5baad90e464b3915068ba4157e2))
- merge master fix conflict ([652e5d1](https://github.com/antvis/L7/commit/652e5d1cafc350fe98d569f32bf6c592c6a79b89))
- source 聚合方法接口定义问题 ([27bdd02](https://github.com/antvis/L7/commit/27bdd02e76f3374b3e1568553ca20455ee7c1511))
- 高德地图底图模式,事件交互注册顺序的问题导致不生效 ([2ad4289](https://github.com/antvis/L7/commit/2ad4289e75519f956a9cb1b44a7231b1151c88fb))
- **layer:** fix default model config ([2301419](https://github.com/antvis/L7/commit/2301419aadf00a887fc22728b9797e6c1149bead))
- **lint:** igonre lint test data lint ([1782893](https://github.com/antvis/L7/commit/178289348a26586b1ccbc8f75baa3b7312693a8c))
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
- **source:** add join transfroms ([ec3cae2](https://github.com/antvis/L7/commit/ec3cae2f5fd0491a895cf4ba3953da94b5af2c84))
- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
- **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))

# [2.0.0-beta.27](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.27) (2020-01-01)

### Bug Fixes

- layer style storkeColor->stroke ([27f66a9](https://github.com/antvis/L7/commit/27f66a9918a3568f7f591af161953ac498d2dcba))
- mapbox token 校验问题 ([6c1f934](https://github.com/antvis/L7/commit/6c1f93425676c5baad90e464b3915068ba4157e2))
- merge master fix conflict ([652e5d1](https://github.com/antvis/L7/commit/652e5d1cafc350fe98d569f32bf6c592c6a79b89))
- source 聚合方法接口定义问题 ([27bdd02](https://github.com/antvis/L7/commit/27bdd02e76f3374b3e1568553ca20455ee7c1511))
- 高德地图底图模式,事件交互注册顺序的问题导致不生效 ([2ad4289](https://github.com/antvis/L7/commit/2ad4289e75519f956a9cb1b44a7231b1151c88fb))
- **layer:** fix default model config ([2301419](https://github.com/antvis/L7/commit/2301419aadf00a887fc22728b9797e6c1149bead))
- **lint:** igonre lint test data lint ([1782893](https://github.com/antvis/L7/commit/178289348a26586b1ccbc8f75baa3b7312693a8c))
- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- point text add overlap ([98869d8](https://github.com/antvis/L7/commit/98869d876b0e98dd9258c97b9be9f5a69c0a1612))
- polygon 支持text ([f5a1546](https://github.com/antvis/L7/commit/f5a15465e230e6f58c92bec5f12b132bc9a9ae91))
- **layer:** add blend 效果配置支持 normal,additive ([e0ab4cd](https://github.com/antvis/L7/commit/e0ab4cd386f53ba4e93aaebfb1fa05b6e438710e))
- **layer:** add citybuildinglayer & add line add animate ([d657286](https://github.com/antvis/L7/commit/d657286d58c795ba968ae930eb382ca422bdbd08))
- **layer:** add setSelect setActive 方法 & refactor color util ([5c27d66](https://github.com/antvis/L7/commit/5c27d66a6401192f5e0406a2f4c3e0983dc2867c))
- **layer:** pointLayer add text model ([84a9193](https://github.com/antvis/L7/commit/84a9193e3a8a311bb52bbedabc8847eabba7dc9a))
- scene 实例化支持传入地图实例 & 更新文档 ([cb1d4b6](https://github.com/antvis/L7/commit/cb1d4b6c7d0e65a5e15138ae01adb56cd1b6ee43))
- **source:** add join transfroms ([ec3cae2](https://github.com/antvis/L7/commit/ec3cae2f5fd0491a895cf4ba3953da94b5af2c84))
- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
- **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))

# [2.0.0-alpha.28](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-alpha.28) (2020-01-01)

### Bug Fixes

- layer style storkeColor->stroke ([27f66a9](https://github.com/antvis/L7/commit/27f66a9918a3568f7f591af161953ac498d2dcba))
- mapbox token 校验问题 ([6c1f934](https://github.com/antvis/L7/commit/6c1f93425676c5baad90e464b3915068ba4157e2))
- merge master fix conflict ([652e5d1](https://github.com/antvis/L7/commit/652e5d1cafc350fe98d569f32bf6c592c6a79b89))
- source 聚合方法接口定义问题 ([27bdd02](https://github.com/antvis/L7/commit/27bdd02e76f3374b3e1568553ca20455ee7c1511))
- 高德地图底图模式,事件交互注册顺序的问题导致不生效 ([2ad4289](https://github.com/antvis/L7/commit/2ad4289e75519f956a9cb1b44a7231b1151c88fb))
- **layer:** fix default model config ([2301419](https://github.com/antvis/L7/commit/2301419aadf00a887fc22728b9797e6c1149bead))
- **lint:** igonre lint test data lint ([1782893](https://github.com/antvis/L7/commit/178289348a26586b1ccbc8f75baa3b7312693a8c))
- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- point text add overlap ([98869d8](https://github.com/antvis/L7/commit/98869d876b0e98dd9258c97b9be9f5a69c0a1612))
- polygon 支持text ([f5a1546](https://github.com/antvis/L7/commit/f5a15465e230e6f58c92bec5f12b132bc9a9ae91))
- **layer:** add blend 效果配置支持 normal,additive ([e0ab4cd](https://github.com/antvis/L7/commit/e0ab4cd386f53ba4e93aaebfb1fa05b6e438710e))
- **layer:** add citybuildinglayer & add line add animate ([d657286](https://github.com/antvis/L7/commit/d657286d58c795ba968ae930eb382ca422bdbd08))
- **layer:** add setSelect setActive 方法 & refactor color util ([5c27d66](https://github.com/antvis/L7/commit/5c27d66a6401192f5e0406a2f4c3e0983dc2867c))
- **layer:** pointLayer add text model ([84a9193](https://github.com/antvis/L7/commit/84a9193e3a8a311bb52bbedabc8847eabba7dc9a))
- scene 实例化支持传入地图实例 & 更新文档 ([cb1d4b6](https://github.com/antvis/L7/commit/cb1d4b6c7d0e65a5e15138ae01adb56cd1b6ee43))
- **source:** add join transfroms ([ec3cae2](https://github.com/antvis/L7/commit/ec3cae2f5fd0491a895cf4ba3953da94b5af2c84))
- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
- **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))

# [2.0.0-alpha.27](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-alpha.27) (2019-12-31)

### Bug Fixes

- layer style storkeColor->stroke ([27f66a9](https://github.com/antvis/L7/commit/27f66a9918a3568f7f591af161953ac498d2dcba))
- mapbox token 校验问题 ([6c1f934](https://github.com/antvis/L7/commit/6c1f93425676c5baad90e464b3915068ba4157e2))
- merge master fix conflict ([652e5d1](https://github.com/antvis/L7/commit/652e5d1cafc350fe98d569f32bf6c592c6a79b89))
- source 聚合方法接口定义问题 ([27bdd02](https://github.com/antvis/L7/commit/27bdd02e76f3374b3e1568553ca20455ee7c1511))
- 高德地图底图模式,事件交互注册顺序的问题导致不生效 ([2ad4289](https://github.com/antvis/L7/commit/2ad4289e75519f956a9cb1b44a7231b1151c88fb))
- **layer:** fix default model config ([2301419](https://github.com/antvis/L7/commit/2301419aadf00a887fc22728b9797e6c1149bead))
- **lint:** igonre lint test data lint ([1782893](https://github.com/antvis/L7/commit/178289348a26586b1ccbc8f75baa3b7312693a8c))
- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- point text add overlap ([98869d8](https://github.com/antvis/L7/commit/98869d876b0e98dd9258c97b9be9f5a69c0a1612))
- polygon 支持text ([f5a1546](https://github.com/antvis/L7/commit/f5a15465e230e6f58c92bec5f12b132bc9a9ae91))
- **layer:** add blend 效果配置支持 normal,additive ([e0ab4cd](https://github.com/antvis/L7/commit/e0ab4cd386f53ba4e93aaebfb1fa05b6e438710e))
- **layer:** add citybuildinglayer & add line add animate ([d657286](https://github.com/antvis/L7/commit/d657286d58c795ba968ae930eb382ca422bdbd08))
- **layer:** add setSelect setActive 方法 & refactor color util ([5c27d66](https://github.com/antvis/L7/commit/5c27d66a6401192f5e0406a2f4c3e0983dc2867c))
- **layer:** pointLayer add text model ([84a9193](https://github.com/antvis/L7/commit/84a9193e3a8a311bb52bbedabc8847eabba7dc9a))
- scene 实例化支持传入地图实例 & 更新文档 ([cb1d4b6](https://github.com/antvis/L7/commit/cb1d4b6c7d0e65a5e15138ae01adb56cd1b6ee43))
- **source:** add join transfroms ([ec3cae2](https://github.com/antvis/L7/commit/ec3cae2f5fd0491a895cf4ba3953da94b5af2c84))
- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
- **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))

# [2.0.0-beta.26](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.26) (2019-12-30)

### Bug Fixes

- layer style storkeColor->stroke ([27f66a9](https://github.com/antvis/L7/commit/27f66a9918a3568f7f591af161953ac498d2dcba))
- mapbox token 校验问题 ([6c1f934](https://github.com/antvis/L7/commit/6c1f93425676c5baad90e464b3915068ba4157e2))
- merge master fix conflict ([652e5d1](https://github.com/antvis/L7/commit/652e5d1cafc350fe98d569f32bf6c592c6a79b89))
- source 聚合方法接口定义问题 ([27bdd02](https://github.com/antvis/L7/commit/27bdd02e76f3374b3e1568553ca20455ee7c1511))
- 高德地图底图模式,事件交互注册顺序的问题导致不生效 ([2ad4289](https://github.com/antvis/L7/commit/2ad4289e75519f956a9cb1b44a7231b1151c88fb))
- **layer:** fix default model config ([2301419](https://github.com/antvis/L7/commit/2301419aadf00a887fc22728b9797e6c1149bead))
- **lint:** igonre lint test data lint ([1782893](https://github.com/antvis/L7/commit/178289348a26586b1ccbc8f75baa3b7312693a8c))
- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- point text add overlap ([98869d8](https://github.com/antvis/L7/commit/98869d876b0e98dd9258c97b9be9f5a69c0a1612))
- polygon 支持text ([f5a1546](https://github.com/antvis/L7/commit/f5a15465e230e6f58c92bec5f12b132bc9a9ae91))
- **layer:** add blend 效果配置支持 normal,additive ([e0ab4cd](https://github.com/antvis/L7/commit/e0ab4cd386f53ba4e93aaebfb1fa05b6e438710e))
- **layer:** add citybuildinglayer & add line add animate ([d657286](https://github.com/antvis/L7/commit/d657286d58c795ba968ae930eb382ca422bdbd08))
- **layer:** add setSelect setActive 方法 & refactor color util ([5c27d66](https://github.com/antvis/L7/commit/5c27d66a6401192f5e0406a2f4c3e0983dc2867c))
- **layer:** pointLayer add text model ([84a9193](https://github.com/antvis/L7/commit/84a9193e3a8a311bb52bbedabc8847eabba7dc9a))
- scene 实例化支持传入地图实例 & 更新文档 ([cb1d4b6](https://github.com/antvis/L7/commit/cb1d4b6c7d0e65a5e15138ae01adb56cd1b6ee43))
- **source:** add join transfroms ([ec3cae2](https://github.com/antvis/L7/commit/ec3cae2f5fd0491a895cf4ba3953da94b5af2c84))
- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
- **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))

# [2.0.0-beta.25](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.25) (2019-12-27)

### Bug Fixes

- 高德地图底图模式,事件交互注册顺序的问题导致不生效 ([2ad4289](https://github.com/antvis/L7/commit/2ad4289e75519f956a9cb1b44a7231b1151c88fb))
- layer style storkeColor->stroke ([27f66a9](https://github.com/antvis/L7/commit/27f66a9918a3568f7f591af161953ac498d2dcba))
- **layer:** fix default model config ([2301419](https://github.com/antvis/L7/commit/2301419aadf00a887fc22728b9797e6c1149bead))
- mapbox token 校验问题 ([6c1f934](https://github.com/antvis/L7/commit/6c1f93425676c5baad90e464b3915068ba4157e2))
- merge master fix conflict ([652e5d1](https://github.com/antvis/L7/commit/652e5d1cafc350fe98d569f32bf6c592c6a79b89))
- source 聚合方法接口定义问题 ([27bdd02](https://github.com/antvis/L7/commit/27bdd02e76f3374b3e1568553ca20455ee7c1511))
- **lint:** igonre lint test data lint ([1782893](https://github.com/antvis/L7/commit/178289348a26586b1ccbc8f75baa3b7312693a8c))
- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- **layer:** add blend 效果配置支持 normal,additive ([e0ab4cd](https://github.com/antvis/L7/commit/e0ab4cd386f53ba4e93aaebfb1fa05b6e438710e))
- **layer:** add citybuildinglayer & add line add animate ([d657286](https://github.com/antvis/L7/commit/d657286d58c795ba968ae930eb382ca422bdbd08))
- **layer:** add setSelect setActive 方法 & refactor color util ([5c27d66](https://github.com/antvis/L7/commit/5c27d66a6401192f5e0406a2f4c3e0983dc2867c))
- **layer:** pointLayer add text model ([84a9193](https://github.com/antvis/L7/commit/84a9193e3a8a311bb52bbedabc8847eabba7dc9a))
- scene 实例化支持传入地图实例 & 更新文档 ([cb1d4b6](https://github.com/antvis/L7/commit/cb1d4b6c7d0e65a5e15138ae01adb56cd1b6ee43))
- **source:** add join transfroms ([ec3cae2](https://github.com/antvis/L7/commit/ec3cae2f5fd0491a895cf4ba3953da94b5af2c84))
- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
- **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))

# [2.0.0-beta.24](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.24) (2019-12-23)

### Bug Fixes

- **layer:** fix default model config ([2301419](https://github.com/antvis/L7/commit/2301419aadf00a887fc22728b9797e6c1149bead))
- mapbox token 校验问题 ([6c1f934](https://github.com/antvis/L7/commit/6c1f93425676c5baad90e464b3915068ba4157e2))
- merge master fix conflict ([652e5d1](https://github.com/antvis/L7/commit/652e5d1cafc350fe98d569f32bf6c592c6a79b89))
- source 聚合方法接口定义问题 ([27bdd02](https://github.com/antvis/L7/commit/27bdd02e76f3374b3e1568553ca20455ee7c1511))
- **lint:** igonre lint test data lint ([1782893](https://github.com/antvis/L7/commit/178289348a26586b1ccbc8f75baa3b7312693a8c))
- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- **layer:** add blend 效果配置支持 normal,additive ([e0ab4cd](https://github.com/antvis/L7/commit/e0ab4cd386f53ba4e93aaebfb1fa05b6e438710e))
- **layer:** add setSelect setActive 方法 & refactor color util ([5c27d66](https://github.com/antvis/L7/commit/5c27d66a6401192f5e0406a2f4c3e0983dc2867c))
- scene 实例化支持传入地图实例 & 更新文档 ([cb1d4b6](https://github.com/antvis/L7/commit/cb1d4b6c7d0e65a5e15138ae01adb56cd1b6ee43))
- **source:** add join transfroms ([ec3cae2](https://github.com/antvis/L7/commit/ec3cae2f5fd0491a895cf4ba3953da94b5af2c84))
- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
- **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))

# [2.0.0-beta.23](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.23) (2019-12-23)

### Bug Fixes

- **layer:** fix default model config ([2301419](https://github.com/antvis/L7/commit/2301419aadf00a887fc22728b9797e6c1149bead))
- mapbox token 校验问题 ([6c1f934](https://github.com/antvis/L7/commit/6c1f93425676c5baad90e464b3915068ba4157e2))
- merge master fix conflict ([652e5d1](https://github.com/antvis/L7/commit/652e5d1cafc350fe98d569f32bf6c592c6a79b89))
- source 聚合方法接口定义问题 ([27bdd02](https://github.com/antvis/L7/commit/27bdd02e76f3374b3e1568553ca20455ee7c1511))
- **lint:** igonre lint test data lint ([1782893](https://github.com/antvis/L7/commit/178289348a26586b1ccbc8f75baa3b7312693a8c))
- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- **layer:** add blend 效果配置支持 normal,additive ([e0ab4cd](https://github.com/antvis/L7/commit/e0ab4cd386f53ba4e93aaebfb1fa05b6e438710e))
- **layer:** add setSelect setActive 方法 & refactor color util ([5c27d66](https://github.com/antvis/L7/commit/5c27d66a6401192f5e0406a2f4c3e0983dc2867c))
- scene 实例化支持传入地图实例 & 更新文档 ([cb1d4b6](https://github.com/antvis/L7/commit/cb1d4b6c7d0e65a5e15138ae01adb56cd1b6ee43))
- **source:** add join transfroms ([ec3cae2](https://github.com/antvis/L7/commit/ec3cae2f5fd0491a895cf4ba3953da94b5af2c84))
- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
- **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))

# [2.0.0-beta.21](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.21) (2019-12-18)

### Bug Fixes

- mapbox token 校验问题 ([6c1f934](https://github.com/antvis/L7/commit/6c1f93425676c5baad90e464b3915068ba4157e2))
- merge master fix conflict ([652e5d1](https://github.com/antvis/L7/commit/652e5d1cafc350fe98d569f32bf6c592c6a79b89))
- source 聚合方法接口定义问题 ([27bdd02](https://github.com/antvis/L7/commit/27bdd02e76f3374b3e1568553ca20455ee7c1511))
- **lint:** igonre lint test data lint ([1782893](https://github.com/antvis/L7/commit/178289348a26586b1ccbc8f75baa3b7312693a8c))
- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- **layer:** add blend 效果配置支持 normal,additive ([e0ab4cd](https://github.com/antvis/L7/commit/e0ab4cd386f53ba4e93aaebfb1fa05b6e438710e))
- **layer:** add setSelect setActive 方法 & refactor color util ([5c27d66](https://github.com/antvis/L7/commit/5c27d66a6401192f5e0406a2f4c3e0983dc2867c))
- scene 实例化支持传入地图实例 & 更新文档 ([cb1d4b6](https://github.com/antvis/L7/commit/cb1d4b6c7d0e65a5e15138ae01adb56cd1b6ee43))
- **source:** add join transfroms ([ec3cae2](https://github.com/antvis/L7/commit/ec3cae2f5fd0491a895cf4ba3953da94b5af2c84))
- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
- **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))

# [2.0.0-beta.20](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.20) (2019-12-12)

### Bug Fixes

- **lint:** igonre lint test data lint ([1782893](https://github.com/antvis/L7/commit/178289348a26586b1ccbc8f75baa3b7312693a8c))
- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- **source:** add join transfroms ([ec3cae2](https://github.com/antvis/L7/commit/ec3cae2f5fd0491a895cf4ba3953da94b5af2c84))
- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
- **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))

# [2.0.0-beta.19](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.19) (2019-12-08)

### Bug Fixes

- **lint:** igonre lint test data lint ([1782893](https://github.com/antvis/L7/commit/178289348a26586b1ccbc8f75baa3b7312693a8c))
- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))

# [2.0.0-beta.18](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.18) (2019-12-08)

### Bug Fixes

- **lint:** igonre lint test data lint ([1782893](https://github.com/antvis/L7/commit/178289348a26586b1ccbc8f75baa3b7312693a8c))
- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))

# [2.0.0-beta.17](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.17) (2019-12-08)

### Bug Fixes

- **lint:** igonre lint test data lint ([1782893](https://github.com/antvis/L7/commit/178289348a26586b1ccbc8f75baa3b7312693a8c))
- **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))

### Features

- **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))

# [2.0.0-beta.16](https://github.com/antvis/L7/compare/v2.0.0-beta.15...v2.0.0-beta.16) (2019-11-29)

**Note:** Version bump only for package @antv/l7-core

# [2.0.0-beta.15](https://github.com/antvis/L7/compare/v2.0.0-beta.14...v2.0.0-beta.15) (2019-11-29)

### Bug Fixes

- **map:** temporarily closed amap offset coordinate ([9a20f64](https://github.com/antvis/L7/commit/9a20f6480321c9297ff27fe4cfe6af9032fcb969))

# [2.0.0-beta.13](https://github.com/antvis/L7/compare/v2.0.0-beta.12...v2.0.0-beta.13) (2019-11-28)

**Note:** Version bump only for package @antv/l7-core

# [2.0.0-beta.12](https://github.com/antvis/L7/compare/v2.0.0-beta.11...v2.0.0-beta.12) (2019-11-28)

### Bug Fixes

- **component:** fix marker ([14d4818](https://github.com/antvis/L7/commit/14d48184a1579241b077110ed51a8358de25e010))

# 2.0.0-beta.11 (2019-11-28)

### Bug Fixes

- **component:** rename IPopupService ([a553111](https://github.com/antvis/L7/commit/a553111340065525be993b6a8df2754653880c59))
- **demo:** bugs ([5a857f9](https://github.com/antvis/L7/commit/5a857f9c1b707c91cbc07b0fc4878be3fe56011b))
- **demo:** gatsby ([5faac23](https://github.com/antvis/L7/commit/5faac2306c34ac8f3a02fdc61ad18337a4df7f49))
- **demo:** gatsby ([b6a1785](https://github.com/antvis/L7/commit/b6a1785a0ba432134495f6d9ac65f92ecc045fe8))
- **doc:** file name lowercase ([3cbdc9c](https://github.com/antvis/L7/commit/3cbdc9c7f1d9be34e9c917f05531323946993eb4))
- **fix confilict:** conflict ([8a09ae2](https://github.com/antvis/L7/commit/8a09ae24bef7ba845e5b16759b3ecac210e472c5))
- **fix css:** fix css png ([f7e5376](https://github.com/antvis/L7/commit/f7e5376b7d6c64b2b078dca8f2a230f4fce14c68))
- **layer:** fix merge conflict ([6f33e5f](https://github.com/antvis/L7/commit/6f33e5f72bc9e72202db12a059dcd6c88da41084))
- **layer render:** scene 创建完成字段调用render方法 ([b5112a5](https://github.com/antvis/L7/commit/b5112a575083add0be1b770f7dafbc3644339230))
- **layers:** heatmap 3d effect ([38d1736](https://github.com/antvis/L7/commit/38d173610fbf729dfc3a6fae94ad27bb68f33cb8))
- **layers:** heatmap 3d effect ([c99bb27](https://github.com/antvis/L7/commit/c99bb27d94ad9b6b1e85b7b153953dd2a7455db8))
- **layerservice:** fix init bugs in layer service ([8cbbf7b](https://github.com/antvis/L7/commit/8cbbf7b28d63f4df16f061a4ae21726f243e7108))
- **map:** amap contanier creat new amap div ([bf43136](https://github.com/antvis/L7/commit/bf4313678501ec9c96da43de87b3b8dbf7be4c18))
- **master:** merge master branch fix conflict ([2ea903e](https://github.com/antvis/L7/commit/2ea903ee3f17bfdb670abfb1d252de8b6222b19f))
- **merge:** fix conflict ([07e8505](https://github.com/antvis/L7/commit/07e85059ebd40506623253feb624ee3083f393ae))
- **merge:** merge next branch ([30597d9](https://github.com/antvis/L7/commit/30597d9a45a728dac230f30ad18c787c7beb4163))
- **merge branch:** fix confilt ([e7a46a6](https://github.com/antvis/L7/commit/e7a46a691d9e67a03d733fd565c6b152ee8715b6))
- **packages:** remove sub modules node_modules ([132b99e](https://github.com/antvis/L7/commit/132b99e4d2bef7ec5565a0b18c5659e8b246944b))
- **raster layer:** update raster triangle ([b0f6265](https://github.com/antvis/L7/commit/b0f6265cd3b16c6ff39d0a6693788a25fca7bda2))
- **render:** gl type ([f0d49d9](https://github.com/antvis/L7/commit/f0d49d915717c6799faabcb149339ec73923e616))
- **rm cache:** rm cache ([51ea07e](https://github.com/antvis/L7/commit/51ea07ea664229f775b7c191cfde68299cc8c2d5))
- **tslint:** fix tslint error ([aed5e9e](https://github.com/antvis/L7/commit/aed5e9e51b5dd214cc19baece7dd0138b336a5d5))

### Features

- **add l7 site:** add websites ([0463ff8](https://github.com/antvis/L7/commit/0463ff874eab1c484b593e8c02f73c85a02c000c))
- **add point demo:** add demo ([cfecc93](https://github.com/antvis/L7/commit/cfecc930454c7b0a49884d383464c3d579ff8bf1))
- **add point demo:** add demo ([90f6945](https://github.com/antvis/L7/commit/90f6945feb4818842c6231f5b5683db6cda15a73))
- **chart:** add chart demo ([2a19b07](https://github.com/antvis/L7/commit/2a19b07c1bca7dfbf191618f15ab06a18c262148))
- **component:** add layer control ([7f4646e](https://github.com/antvis/L7/commit/7f4646efd3b0004fde4e9f6860e618c7668af1a7))
- **component:** add scale ,zoom, popup, marker map method ([a6baef4](https://github.com/antvis/L7/commit/a6baef4954c11d9c6582c27de2ba667f18538460))
- **core:** add map method ([853c190](https://github.com/antvis/L7/commit/853c1901fbb8559a9d3bdb3631ec13a7dcaf0ea7))
- **demo:** add point chart demo ([8c2e4a8](https://github.com/antvis/L7/commit/8c2e4a82bf7a49b29004d5e261d8e9c46cd0bd9d))
- **layer:** 新增sourceplugin, attribute 增加类型判断 ([2570b8c](https://github.com/antvis/L7/commit/2570b8c242af29bae07640b1ec7eaadfb04ec9d6))
- **layer:** add imagelayer ([a995815](https://github.com/antvis/L7/commit/a995815284652ca5d6e013c547b617fa52039ddc))
- **layer:** add point line polygon image layer ([54f28be](https://github.com/antvis/L7/commit/54f28be495af94a39313b7840c69725be16dc1e2))
- **layer:** point layer ([3da72c8](https://github.com/antvis/L7/commit/3da72c83ff0577455a29ba98df4bb7cd8838328a))
- **layers:** add heatmap layer ([e04b3b2](https://github.com/antvis/L7/commit/e04b3b268b9fdc4bea150d2db1fdaae227f51fc8))
- **layers:** add polygon3d , pointimagelayer ([75f2eaa](https://github.com/antvis/L7/commit/75f2eaa083064ff21c8bbe13f5f6770682c23241))
- **map:** adjust Scene API, use @antv/l7-maps instead ([77b8f21](https://github.com/antvis/L7/commit/77b8f21b0bcf8b06e88d8e0bef213935bf32b957)), closes [#86](https://github.com/antvis/L7/issues/86)
- **multi-pass:** support TAA(Temporal Anti-Aliasing) ([2cf0824](https://github.com/antvis/L7/commit/2cf082439ad04eb84b96b2922e45082476452aec))
- **picking:** support advanced picking API: `layer.pick({x, y})` ([3e22f21](https://github.com/antvis/L7/commit/3e22f21a5c658e4ade31c0506bd77ae787ec2fcc))
- **picking:** support PixelPickingPass and highlight the picked feature ([ff0ffa0](https://github.com/antvis/L7/commit/ff0ffa057e2f533dc6ac92f40d3892f9dd57fafb))
- **point image:** add point image ([89b2513](https://github.com/antvis/L7/commit/89b25133a17f308c3e884c49baebcd3cc7a9470a))
- **post-processing:** add some post processing effects ([1d8e15c](https://github.com/antvis/L7/commit/1d8e15cec11abc62785bc68c8281550732550839))
- **scene:** scene service inTransientScope ([ccf1ff4](https://github.com/antvis/L7/commit/ccf1ff464e1b220650e61c0999846725b075ef3a))
- **schema-validation:** support validation for layer's options ([9c5766d](https://github.com/antvis/L7/commit/9c5766d0e37958d67f7072d465f51e2aa3d53939))
