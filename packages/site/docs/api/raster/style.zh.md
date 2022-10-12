---
title: Style
order: 4
---

`markdown:docs/common/style.md`

### style

- `clampLow`: `Boolean` 默认 false, 设置为 true，低于 domain 的数据将不显示
- `clampHigh`: `Boolean` 默认 false, 设置为 true，高于 domain 的数据将不显示
- `opacity`: `Number`, 默认值为 0.8 透明度
- `domain`: [ 0, 8000 ] 数据映射区间
- `noDataValue` `Number` noDataValue 不会显示
- `rampColors`: {

  `colors`: [ '#FF4818', '#F7B74A', '#FFF598', '#91EABC', '#2EA9A1', '#206C7C' ],

  `positions`: [ 0, 0.2, 0.4, 0.6, 0.8, 1.0 ]

  } // 色带

  ⚠️ `color`, `position` 的长度要相同

[在线案例](/zh/examples/raster/basic#light)
