---
title: 文本标注
order: 4
---

`markdown:docs/common/style.md`

为图层添加文本标注

## 使用

地图标注需要添加一个新的图层的实现

```javascript
import { PointLayer } from '@antv/l7';
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*7blvQ4v7Q1UAAAAAAAAAAABkARQnAQ'>

### shape

- field 标注的字段名称
- shapeType 'text'

```javascript
layer.shape('name', 'text');
```

### style

- opacity `number`
- textAnchor `string` 文本相对锚点的位置
  `'right' | 'top-right' | 'left' | 'bottom-right' | 'left' | 'top-left' | 'bottom-left' | 'bottom' | 'bottom-right' | 'bottom-left' | 'top' | 'top-right' | 'top-left' | 'center';`
- padding: `number` 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
- spacing: number 文本间隔
- stroke: `string`; 描边颜色
- strokeWidth `number` 描边宽度
- strokeOpacity `number` 描边透明度
- fontWeight `string` 字体粗细
- fontFamily `string` 字号
- textOffset `[number, number]` 文本偏移量
- textAllowOverlap: `boolean` 是否允许文字遮盖

[在线案例](../../../examples/point/text#point_text)

## 额外的 style 配置

- raisingHeight 设置 3D 填充图的抬升高度

`markdown:docs/common/layer/base.md`
