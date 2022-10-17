---
title: Style
order: 4
---

`markdown:docs/common/style.md`

### style

| style         | 类型          | 描述 & 生效图层                             | 默认值  |
| ------------- | ------------ | -------------------------------- | ------- |
| opacity       | `number`     | 图形的透明度 `all`                 | 1       |
| depth         | `boolean`    | 图形是否开启深度检测 [3D 柱图](/zh/docs/api/point_layer/shape#3d-柱图)|  true |
| stroke        | `string`   | 图形边框颜色 [2D 符号图](/zh/docs/api/point_layer/shape#2d-符号图)、`simple`、`text` | #fff |
| strokeWidth   | `number`     | 图形边框颜色 [2D 符号图](/zh/docs/api/point_layer/shape#2d-符号图)、`simple`、`text`| 0 |
| strokeOpacity | `number`     | 图形边框宽度 [2D 符号图](/zh/docs/api/point_layer/shape#2d-符号图)  、`simple` | 1 |
| blur          | `number`     | 图形模糊半径 [2D 符号图](/zh/docs/api/point_layer/shape#2d-符号图)    | 0 |
| textOffset    | `[number, number]` | [文字的偏移 `text` | `[0, 0]` |
| textAnchor    | `anchorType` | 文字对齐锚点](/zh/docs/api/point_layer/style#anchortype) `text` | `center` |
| spacing    | `number` | 文字间隔 `text`                       | `2` |
| padding    | `[number, number]` | 文字的偏移 `text`                       | [0, 0] |
| halo    | `[number, number]` | 文字的偏移 `text`                       | [0, 0] |
| gamma    | `[number, number]` | 文字的偏移 `text`                       | [0, 0] |
| fontWeight    | `[number, number]` | 文字的偏移 `text`                       | [0, 0] |
| fontFamily    | `[number, number]` | 文字的偏移 `text`                       | [0, 0] |
| textAllowOverlap    | `[number, number]` | 文字的偏移 `text`                       | [0, 0] |
| raisingHeight    | `[number, number]` | 文字的偏移 `text`                       | [0, 0] |
| heightfixed    | `[number, number]` | 文字的偏移 `text`                       | [0, 0] |
| pickLight    | `[number, number]` | 文字的偏移 `text`                       | [0, 0] |
| cylinder    | `[number, number]` | 文字的偏移 `text`                       | [0, 0] |
| sourceColor    | `[number, number]` | 文字的偏移 `text`                       | [0, 0] |
| targetColor    | `[number, number]` | 文字的偏移 `text`                       | [0, 0] |
| opacityLinear    | `[number, number]` | 文字的偏移 `text`                       | [0, 0] |
| lightEnable    | `[number, number]` | 文字的偏移 `text`                       | [0, 0] |
| offsets    | `[number, number]` | 文字的偏移 `text`                       | [0, 0] |
| unit    | `[number, number]` | 文字的偏移 `text`                       | [0, 0] |
| rotation    | `[number, number]` | 文字的偏移 `text`                       | [0, 0] |
| speed    | `[number, number]` | 文字的偏移 `text`                       | [0, 0] |

#### anchorType

文字对齐锚点

```javascript
export enum anchorType {
  'CENTER' = 'center',
  'TOP' = 'top',
  'TOP-LEFT' = 'top-left',
  'TOP-RIGHT' = 'top-right',
  'BOTTOM' = 'bottom',
  'BOTTOM-LEFT' = 'bottom-left',
  'LEFT' = 'left',
  'RIGHT' = 'right',
}
```
