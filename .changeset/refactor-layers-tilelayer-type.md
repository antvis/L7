---
'@antv/l7-layers': patch
---

refactor(layers): type BaseLayer.tileLayer as IBaseTileLayer | undefined (stage-5 5.1)

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
