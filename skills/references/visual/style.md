---
skill_id: layer-style
skill_name: 图层样式配置
category: visual
difficulty: beginner
tags: [style, opacity, stroke, texture, blend, animation]
dependencies: [scene-initialization]
version: 2.x
---

# 图层样式配置

## 技能描述

配置图层的视觉样式属性，包括透明度、描边、纹理、混合模式等，提升可视化效果。

## 何时使用

- ✅ 调整图层透明度（叠加图层、突出重点）
- ✅ 添加描边效果（边界清晰、视觉层次）
- ✅ 使用纹理填充（特殊视觉效果）
- ✅ 设置混合模式（光晕效果、数据叠加）
- ✅ 配置动画效果（动态展示、吸引注意）

## 前置条件

- 已完成[场景初始化](../01-core/scene-initialization.md)
- 已创建图层实例

## 代码示例

### 基础样式配置

```javascript
import { PointLayer } from '@antv/l7';

const layer = new PointLayer()
  .source(data, { parser: { type: 'json', x: 'lng', y: 'lat' } })
  .shape('circle')
  .size(10)
  .color('#5B8FF9')
  .style({
    opacity: 0.8, // 透明度
    strokeWidth: 2, // 描边宽度
    stroke: '#fff', // 描边颜色
    strokeOpacity: 1.0, // 描边透明度
  });

scene.addLayer(layer);
```

## 样式属性详解

### 1. 透明度 (Opacity)

#### 整体透明度

```javascript
layer.style({
  opacity: 0.8, // 0 完全透明，1 完全不透明
});
```

#### 动态透明度（数据驱动）

```javascript
layer.style({
  opacity: (feature) => {
    return feature.value / 100; // 根据数值动态调整
  },
});
```

### 2. 描边样式 (Stroke)

#### 基础描边

```javascript
// 点图层描边
const pointLayer = new PointLayer()
  .source(data, { parser: { type: 'json', x: 'lng', y: 'lat' } })
  .shape('circle')
  .size(15)
  .color('#5B8FF9')
  .style({
    strokeWidth: 2, // 描边宽度（像素）
    stroke: '#ffffff', // 描边颜色
    strokeOpacity: 1.0, // 描边透明度
  });

// 面图层描边
const polygonLayer = new PolygonLayer()
  .source(data, { parser: { type: 'geojson' } })
  .shape('fill')
  .color('#5B8FF9')
  .style({
    opacity: 0.6,
    strokeWidth: 1,
    stroke: '#333',
    strokeOpacity: 0.8,
  });

// 线图层样式
const lineLayer = new LineLayer()
  .source(data, { parser: { type: 'geojson' } })
  .shape('line')
  .color('#5B8FF9')
  .size(2)
  .style({
    opacity: 0.8,
    lineType: 'solid', // solid | dash
  });
```

#### 虚线样式

```javascript
const lineLayer = new LineLayer()
  .source(data, { parser: { type: 'geojson' } })
  .shape('line')
  .color('#FF6B6B')
  .size(3)
  .style({
    lineType: 'dash',
    dashArray: [5, 5], // [实线长度, 间隔长度]
  });
```

### 3. 混合模式 (Blend)

```javascript
const layer = new PointLayer({
  blend: 'additive', // normal | additive | subtractive | max
})
  .source(data, { parser: { type: 'json', x: 'lng', y: 'lat' } })
  .shape('circle')
  .size(20)
  .color('#FF6B6B')
  .style({
    opacity: 0.6,
  });
```

#### 混合模式说明

| 模式          | 效果     | 适用场景           |
| ------------- | -------- | ------------------ |
| `normal`      | 默认混合 | 常规图层           |
| `additive`    | 叠加变亮 | 热力效果、光晕效果 |
| `subtractive` | 叠加变暗 | 阴影效果           |
| `max`         | 取最大值 | 密度分析           |

### 4. 纹理填充

```javascript
// 使用图片纹理
const polygonLayer = new PolygonLayer()
  .source(data, { parser: { type: 'geojson' } })
  .shape('fill')
  .style({
    texture: 'https://example.com/pattern.png',
    textureBlend: 'normal',
    opacity: 0.8,
  });
```

### 5. 3D 效果样式

#### 3D 柱状图

```javascript
const layer = new PointLayer()
  .source(data, { parser: { type: 'json', x: 'lng', y: 'lat' } })
  .shape('cylinder')
  .size('value', [0, 500]) // 高度
  .color('value', ['#ffffcc', '#800026'])
  .style({
    opacity: 0.8,
    coverage: 0.8, // 覆盖度（柱子粗细）
    angle: 0, // 旋转角度
  });
```

#### 3D 建筑

```javascript
const buildingLayer = new PolygonLayer()
  .source(buildingData, { parser: { type: 'geojson' } })
  .shape('extrude')
  .size('height')
  .color('#5B8FF9')
  .style({
    opacity: 0.8,
    pickingBuffer: 5, // 拾取缓冲区
    heightfixed: true, // 高度固定
  });
```

### 6. 光晕效果

```javascript
const layer = new PointLayer({
  blend: 'additive',
})
  .source(data, { parser: { type: 'json', x: 'lng', y: 'lat' } })
  .shape('circle')
  .size(30)
  .color('#FF6B6B')
  .style({
    opacity: 0.3,
    blur: 0.9, // 模糊程度，0-1
  });
```

## 图层级别配置

### zIndex (层叠顺序)

```javascript
const baseLayer = new PolygonLayer({ zIndex: 1 }).source(data).shape('fill').color('#f0f0f0');

const highlightLayer = new PolygonLayer({ zIndex: 2 })
  .source(highlightData)
  .shape('fill')
  .color('#FF6B6B');

scene.addLayer(baseLayer);
scene.addLayer(highlightLayer); // 显示在 baseLayer 上方
```

### 图层可见性

```javascript
// 隐藏/显示图层
layer.hide();
layer.show();

// 检查可见性
const isVisible = layer.isVisible();

// 切换可见性
layer.toggleVisible();
```

### 图层拾取控制

```javascript
layer.style({
  pickingBuffer: 5, // 拾取缓冲区大小（像素），增大可提高点击精度
});
```

## 常见场景

### 1. 半透明图层叠加

```javascript
// 底层：行政区划
const districtLayer = new PolygonLayer({ zIndex: 1 })
  .source(districtData, { parser: { type: 'geojson' } })
  .shape('fill')
  .color('name', ['#FEF0D9', '#FDD49E', '#FDBB84', '#FC8D59'])
  .style({
    opacity: 0.6,
  });

// 上层：道路网络
const roadLayer = new LineLayer({ zIndex: 2 })
  .source(roadData, { parser: { type: 'geojson' } })
  .shape('line')
  .color('#333333')
  .size(2)
  .style({
    opacity: 0.8,
  });

scene.addLayer(districtLayer);
scene.addLayer(roadLayer);
```

### 2. 高亮选中效果

```javascript
const normalLayer = new PolygonLayer()
  .source(data, { parser: { type: 'geojson' } })
  .shape('fill')
  .color('#5B8FF9')
  .style({
    opacity: 0.6,
    strokeWidth: 1,
    stroke: '#fff',
  });

const highlightLayer = new PolygonLayer()
  .source([], { parser: { type: 'geojson' } })
  .shape('fill')
  .color('#FF6B6B')
  .style({
    opacity: 0.8,
    strokeWidth: 3,
    stroke: '#fff',
  });

scene.addLayer(normalLayer);
scene.addLayer(highlightLayer);

// 点击高亮
normalLayer.on('click', (e) => {
  highlightLayer.setData(e.feature);
});
```

### 3. 热力光晕效果

```javascript
const heatLayer = new PointLayer({
  blend: 'additive',
  zIndex: 2,
})
  .source(data, { parser: { type: 'json', x: 'lng', y: 'lat' } })
  .shape('circle')
  .size('value', [20, 100])
  .color('value', ['#440154', '#31688e', '#35b779', '#fde724'])
  .style({
    opacity: 0.5,
    blur: 0.8,
  });
```

### 4. 动画样式

```javascript
// 呼吸动画
const layer = new PointLayer()
  .source(data, { parser: { type: 'json', x: 'lng', y: 'lat' } })
  .shape('circle')
  .size(15)
  .color('#FF6B6B')
  .animate(true); // 开启动画

// 自定义动画
layer.animate({
  enable: true,
  type: 'wave', // wave | ripple
  duration: 2000, // 动画时长（毫秒）
  speed: 0.5, // 动画速度
  rings: 3, // 波纹圈数
});
```

### 5. 边界强调

```javascript
const boundaryLayer = new LineLayer()
  .source(boundaryData, { parser: { type: 'geojson' } })
  .shape('line')
  .color('#333')
  .size(3)
  .style({
    opacity: 1.0,
    lineType: 'solid',
  });

// 添加外发光效果
const glowLayer = new LineLayer({
  blend: 'additive',
})
  .source(boundaryData, { parser: { type: 'geojson' } })
  .shape('line')
  .color('#FF6B6B')
  .size(8)
  .style({
    opacity: 0.3,
    blur: 0.8,
  });

scene.addLayer(glowLayer);
scene.addLayer(boundaryLayer);
```

## 样式动态更新

### 运行时更新

```javascript
const layer = new PointLayer()
  .source(data, { parser: { type: 'json', x: 'lng', y: 'lat' } })
  .shape('circle')
  .size(10)
  .color('#5B8FF9')
  .style({
    opacity: 0.8,
  });

scene.addLayer(layer);

// 更新样式
function updateOpacity(value) {
  layer.style({ opacity: value });
  scene.render();
}

// UI 滑块控制
document.getElementById('opacity-slider').addEventListener('input', (e) => {
  updateOpacity(parseFloat(e.target.value));
});
```

### 批量样式更新

```javascript
function updateLayerStyle(options) {
  layer.style({
    opacity: options.opacity || 0.8,
    strokeWidth: options.strokeWidth || 2,
    stroke: options.stroke || '#fff',
  });
  scene.render();
}

// 使用
updateLayerStyle({
  opacity: 0.6,
  strokeWidth: 3,
  stroke: '#333',
});
```

## 性能优化

### 1. 避免频繁样式更新

```javascript
// ❌ 不好的做法
setInterval(() => {
  layer.style({ opacity: Math.random() });
  scene.render();
}, 16);

// ✅ 好的做法：使用动画
layer.animate({
  enable: true,
  interval: 0.5,
  duration: 2000,
});
```

### 2. 简化样式计算

```javascript
// ❌ 复杂的回调函数
layer.style({
  opacity: (feature) => {
    // 大量计算...
    return complexCalculation(feature);
  },
});

// ✅ 预处理数据
data.forEach((d) => (d.opacityValue = complexCalculation(d)));
layer.color('opacityValue', [0.1, 1.0]);
```

### 3. 合理使用混合模式

```javascript
// additive 模式会增加渲染负担，仅在需要时使用
const layer = new PointLayer({
  blend: 'normal', // 默认模式性能最好
});
```

## 注意事项

⚠️ **透明度范围**：opacity 值范围 0-1，超出会被裁剪

⚠️ **描边性能**：大量数据时描边会影响性能，考虑简化

⚠️ **混合模式**：additive 模式对性能有影响，谨慎使用

⚠️ **样式更新**：更新样式后需调用 `scene.render()` 才能生效

⚠️ **zIndex 范围**：建议使用 0-999，过大可能导致问题

⚠️ **3D 效果**：3D 图层的渲染成本高于 2D 图层

## 常见问题

### Q: 修改样式后不生效？

A: 确保调用了 `scene.render()` 触发重绘

### Q: 描边看不清？

A: 增大 `strokeWidth`，或使用对比色作为描边颜色

### Q: 如何实现闪烁效果？

A: 使用 `animate()` 方法或自定义定时器更新透明度

### Q: 图层顺序错乱？

A: 设置合适的 `zIndex` 值，数值越大越在上层

### Q: 如何实现阴影效果？

A: 创建两个图层，下层使用 `subtractive` 混合模式

### Q: 纹理图片不显示？

A: 检查图片 URL 是否可访问，是否有 CORS 问题

## 完整示例

### 多层次可视化

```javascript
// 1. 底图图层
const baseLayer = new PolygonLayer({ zIndex: 1 })
  .source(baseData, { parser: { type: 'geojson' } })
  .shape('fill')
  .color('#f5f5f5')
  .style({
    opacity: 0.8,
  });

// 2. 数据填充层
const dataLayer = new PolygonLayer({ zIndex: 2 })
  .source(valueData, { parser: { type: 'geojson' } })
  .shape('fill')
  .color('value', ['#ffffcc', '#c7e9b4', '#7fcdbb', '#1d91c0', '#0c2c84'])
  .style({
    opacity: 0.7,
    strokeWidth: 0.5,
    stroke: '#fff',
  });

// 3. 高亮热点层（光晕效果）
const hotspotLayer = new PointLayer({
  blend: 'additive',
  zIndex: 3,
})
  .source(hotspots, { parser: { type: 'json', x: 'lng', y: 'lat' } })
  .shape('circle')
  .size(50)
  .color('#FF6B6B')
  .style({
    opacity: 0.4,
    blur: 0.9,
  });

// 4. 标注层
const labelLayer = new PointLayer({ zIndex: 4 })
  .source(labels, { parser: { type: 'json', x: 'lng', y: 'lat' } })
  .shape('name', 'text')
  .size(14)
  .color('#333')
  .style({
    textAnchor: 'center',
    textOffset: [0, 0],
    strokeWidth: 2,
    stroke: '#fff',
  });

scene.addLayer(baseLayer);
scene.addLayer(dataLayer);
scene.addLayer(hotspotLayer);
scene.addLayer(labelLayer);
```

## 相关技能

- [视觉映射](./mapping.md)
- [图层动画](../06-animation/layer-animation.md)
- [点图层](../03-layers/point-layer.md)
- [线图层](../03-layers/line-layer.md)
- [面图层](../03-layers/polygon-layer.md)

## 在线示例

查看更多示例: [L7 官方示例](https://l7.antv.antgroup.com/examples)
