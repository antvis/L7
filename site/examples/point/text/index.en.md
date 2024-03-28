---
title: label
order: 1
---

文本标注图层

## 使用

### shape

- text
  文本渲染需要将指定字段的shape设置成 text

```javascript
layer.shape('name', 'text');
```

### color

同layer color

### size

同layer size

### style

- textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
- textOffset: [ 0, 0 ], // 文本相对锚点的偏移量 [水平, 垂直]
- spacing: 2, // 字符间距
- padding: [ 1, 1 ], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
- stroke: '#ffffff', // 描边颜色
- strokeWidth: 0.3, // 描边宽度
- strokeOpacity: 1.0
