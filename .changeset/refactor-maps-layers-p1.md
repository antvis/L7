---
'@antv/l7-maps': patch
'@antv/l7-layers': patch
---

refactor(maps,layers): gaode alias dedupe, source listener leak fix, raster parser guards

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
