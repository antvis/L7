---
'@antv/l7-layers': patch
---

refactor(layers): document sublayer fields + surface isTileLayer/tileMask (stage-5 5.3)

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
