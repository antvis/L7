# L7 Components Reference

本文档整合了 L7 的所有交互组件使用指南。

## Popup - 信息弹窗

详见 [popup.md](popup.md) - 完整的 Popup 组件使用指南，包括基础用法、高级配置、样式定制等。

### 快速示例

```javascript
import { Popup } from '@antv/l7';

const popup = new Popup({
  closeButton: true,
})
  .setLnglat([120.19, 30.26])
  .setHTML('<h3>标题</h3><p>内容</p>');

scene.addPopup(popup);
```

### 事件绑定

```javascript
layer.on('click', (e) => {
  const popup = new Popup().setLnglat(e.lnglat).setHTML(`<div>${e.feature.properties.name}</div>`);
  scene.addPopup(popup);
});
```

## Marker - 标注点

自定义 HTML 标注，支持拖拽。

### 基础用法

```javascript
import { Marker } from '@antv/l7';

const marker = new Marker().setLnglat([120.19, 30.26]);

scene.addMarker(marker);
```

### 自定义样式

```javascript
const el = document.createElement('div');
el.className = 'custom-marker';
el.innerHTML = '<i class="icon"></i>';

const marker = new Marker({
  element: el,
}).setLnglat([120.19, 30.26]);

scene.addMarker(marker);
```

### 拖拽标注

```javascript
const marker = new Marker({
  draggable: true,
}).setLnglat([120.19, 30.26]);

marker.on('dragend', () => {
  const lnglat = marker.getLnglat();
  console.log('新位置:', lnglat);
});

scene.addMarker(marker);
```

## Controls - 地图控件

L7 提供多种内置控件。

### Zoom Control - 缩放控件

```javascript
import { Zoom } from '@antv/l7';

const zoom = new Zoom({
  position: 'topright',
});

scene.addControl(zoom);
```

### Scale Control - 比例尺

```javascript
import { Scale } from '@antv/l7';

const scale = new Scale({
  position: 'bottomleft',
});

scene.addControl(scale);
```

### Layer Control - 图层控制

```javascript
import { LayerControl } from '@antv/l7';

const layerControl = new LayerControl({
  layers: [
    { layer: pointLayer, name: '点图层' },
    { layer: lineLayer, name: '线图层' },
  ],
});

scene.addControl(layerControl);
```

## Legend - 图例

自定义图例组件。

### 基础图例

```javascript
import { Legend } from '@antv/l7';

const legend = new Legend({
  position: 'bottomright',
  items: [
    { color: '#5B8FF9', value: '类型A' },
    { color: '#5AD8A6', value: '类型B' },
    { color: '#FF6B3B', value: '类型C' },
  ],
});

scene.addControl(legend);
```

### 渐变图例

```javascript
const legend = new Legend({
  position: 'bottomright',
  type: 'gradient',
  items: [
    { color: '#FFF5B8', value: '0' },
    { color: '#FFAB5C', value: '50' },
    { color: '#FF6B3B', value: '100' },
  ],
});

scene.addControl(legend);
```

## 组件组合使用

实际应用中通常组合使用多个组件：

```javascript
import { Scene, PointLayer, Popup, Marker, Zoom, Scale } from '@antv/l7';

// 添加控件
scene.addControl(new Zoom({ position: 'topright' }));
scene.addControl(new Scale({ position: 'bottomleft' }));

// 添加标注
const marker = new Marker().setLnglat([120.19, 30.26]);
scene.addMarker(marker);

// 点击显示 Popup
layer.on('click', (e) => {
  const popup = new Popup().setLnglat(e.lnglat).setHTML(`<h3>${e.feature.properties.name}</h3>`);
  scene.addPopup(popup);
});
```

## 常见问题

### 1. Popup 位置偏移

使用 `offset` 调整位置：

```javascript
const popup = new Popup({
  offset: [0, -10], // x, y 偏移量
});
```

### 2. Marker 自定义图标

```javascript
const el = document.createElement('div');
el.style.backgroundImage = 'url(icon.png)';
el.style.width = '32px';
el.style.height = '32px';

const marker = new Marker({ element: el });
```

### 3. 控件位置

支持的位置：

- `'topleft'` - 左上角
- `'topright'` - 右上角
- `'bottomleft'` - 左下角
- `'bottomright'` - 右下角

## 相关文档

- [events.md](events.md) - 事件处理详细指南
- [popup.md](popup.md) - Popup 完整文档
