---
'@antv/l7-maps': patch
---

fix(maps): 补全 BMap/TMap SDK 类型声明，修复 father dts 生成失败

PR #2878 将 bmap/tmap 迁移到 BaseMap 后，maps 包全量 build 在
father 的 declaration 生成阶段中断 (exit 1)，阻塞 fixed group
整体发布。根因是第三方 SDK 类型缺失运行时存在、但 .d.ts 未声明的
成员：

- @types/bmapgl 的 BMapGL.Map 未声明 on/off/getMinZoom/getMaxZoom
  (bmap/map.ts 直接 this.map.on(...)/getMinZoom() 调用报 TS2339/2551)
- @map-component/tmap-types 的 TMap.Map 未声明 getContainer/panBy
  (tmap/map.ts 7 处 getContainer + panBy 报 TS2339，连带
  addEventListener 回调 e 隐式 any)

修法 (补类型声明，非 as any 投机转换):

- 新增 packages/maps/map-sdk-augmentation.d.ts (ambient，与现有
  style.d.ts 同级，tsconfig 默认 include 覆盖):
  通过 namespace 接口合并为 BMapGL.Map 补 on/off/getMinZoom/
  getMaxZoom，为 TMap.Map 补 getContainer()/panBy([x,y])。
  无运行时代码，仅声明增强。
- bmap/map.ts: 补 public version: string = BMAP_VERSION 声明
  (对齐 maplibre/map.ts、map/map.ts 惯例；此前只赋值未声明)
- bmap/tmap map.ts: handleCameraChanged 中
  this.cameraChangedCallback(...) 改 ?. 可选调用，与 BaseMap
  updateView 一致 (cameraChangedCallback 为可选属性)

验证: pnpm --filter @antv/l7-maps build 0 error (48 files)，
pnpm 全量 build 通过 (fixed group 解除阻塞)，eslint 0 error。
无运行时行为变更。
