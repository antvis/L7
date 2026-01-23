---
skill_id: popup
skill_name: 弹窗组件
category: components
difficulty: beginner
tags: [popup, tooltip, info, interaction]
dependencies: [scene-initialization]
version: 2.x
---

# 弹窗组件

## 技能描述

在地图上显示信息弹窗，用于展示详细信息、提示文本等。

## 何时使用

- ✅ 点击要素显示详情
- ✅ 鼠标悬停显示 Tooltip
- ✅ 显示固定位置的说明信息
- ✅ 展示表格、图表等复杂内容
- ✅ 自定义交互提示

## 前置条件

- 已完成[场景初始化](../01-core/scene-initialization.md)

## 代码示例

### 基础用法 - 简单弹窗

```javascript
import { Popup } from '@antv/l7';

const popup = new Popup({
  offsets: [0, 10], // 偏移量 [x, y]
  closeButton: true, // 显示关闭按钮
})
  .setLnglat([120.19, 30.26])
  .setHTML('<div>这是一个弹窗</div>');

scene.addPopup(popup);
```

### 点击图层显示弹窗

```javascript
import { PointLayer } from '@antv/l7';
import { Popup } from '@antv/l7';

const pointLayer = new PointLayer()
  .source(data, {
    parser: {
      type: 'json',
      x: 'lng',
      y: 'lat',
    },
  })
  .shape('circle')
  .size(10)
  .color('#5B8FF9');

scene.addLayer(pointLayer);

// 点击显示弹窗
pointLayer.on('click', (e) => {
  const { name, value, category } = e.feature.properties;

  const popup = new Popup({
    offsets: [0, 10],
  }).setLnglat(e.lngLat).setHTML(`
      <div style="padding: 10px;">
        <h3>${name}</h3>
        <p>类别: ${category}</p>
        <p>数值: ${value}</p>
      </div>
    `);

  scene.addPopup(popup);
});
```

### 鼠标悬停显示 Tooltip

```javascript
let popup = null;

layer.on('mousemove', (e) => {
  const { name, value } = e.feature.properties;

  // 移除旧弹窗
  if (popup) {
    popup.remove();
  }

  // 创建新弹窗
  popup = new Popup({
    closeButton: false,
    closeOnClick: false,
  })
    .setLnglat(e.lngLat)
    .setHTML(`<div>${name}: ${value}</div>`);

  scene.addPopup(popup);
});

layer.on('mouseleave', () => {
  if (popup) {
    popup.remove();
    popup = null;
  }
});
```

### 自定义样式的弹窗

```javascript
const popup = new Popup({
  offsets: [0, 10],
  closeButton: true,
  className: 'custom-popup', // 自定义 CSS 类名
}).setLnglat([120.19, 30.26]).setHTML(`
    <div class="popup-content">
      <div class="popup-title">杭州市</div>
      <div class="popup-body">
        <p>人口: 1200万</p>
        <p>GDP: 18000亿</p>
      </div>
    </div>
  `);

scene.addPopup(popup);
```

对应 CSS:

```css
.custom-popup {
  max-width: 300px;
}

.custom-popup .popup-content {
  padding: 15px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.custom-popup .popup-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.custom-popup .popup-body {
  font-size: 14px;
  color: #666;
}

.custom-popup .popup-body p {
  margin: 5px 0;
}
```

### 使用 DOM 元素创建弹窗

```javascript
const el = document.createElement('div');
el.className = 'my-popup';
el.innerHTML = `
  <h3>自定义内容</h3>
  <button onclick="alert('点击了按钮')">点击我</button>
`;

const popup = new Popup({
  offsets: [0, 10],
})
  .setLnglat([120.19, 30.26])
  .setDOMContent(el);

scene.addPopup(popup);
```

### 显示图表的弹窗

```javascript
import { Popup } from '@antv/l7';
import { Chart } from '@antv/g2';

layer.on('click', (e) => {
  const { name, data } = e.feature.properties;

  // 创建容器
  const container = document.createElement('div');
  container.style.width = '400px';
  container.style.height = '300px';

  const popup = new Popup({
    offsets: [0, 10],
    closeButton: true,
  })
    .setLnglat(e.lngLat)
    .setDOMContent(container);

  scene.addPopup(popup);

  // 在弹窗中渲染图表
  const chart = new Chart({
    container: container,
    autoFit: true,
  });

  chart.data(data);
  chart.interval().position('month*value');
  chart.render();
});
```

### 只允许显示一个弹窗

```javascript
let currentPopup = null;

layer.on('click', (e) => {
  // 关闭之前的弹窗
  if (currentPopup) {
    currentPopup.remove();
  }

  // 创建新弹窗
  currentPopup = new Popup({
    offsets: [0, 10],
  })
    .setLnglat(e.lngLat)
    .setHTML(`<div>${e.feature.properties.name}</div>`);

  scene.addPopup(currentPopup);
});
```

### 固定位置的说明弹窗

```javascript
// 在地图右上角显示固定说明
const infoPopup = new Popup({
  anchor: 'top-left',
  closeButton: false,
  closeOnClick: false,
}).setLnglat([120.25, 30.3]).setHTML(`
    <div style="padding: 10px; background: rgba(255,255,255,0.9);">
      <h4>数据说明</h4>
      <p>数据来源: XXX</p>
      <p>更新时间: 2024-01-01</p>
    </div>
  `);

scene.addPopup(infoPopup);
```

## 配置参数

### 构造函数参数

| 参数              | 类型             | 默认值   | 说明             |
| ----------------- | ---------------- | -------- | ---------------- |
| `closeButton`     | boolean          | true     | 是否显示关闭按钮 |
| `closeOnClick`    | boolean          | true     | 点击地图是否关闭 |
| `closeOnEsc`      | boolean          | true     | 按 ESC 是否关闭  |
| `maxWidth`        | string           | '240px'  | 最大宽度         |
| `offsets`         | [number, number] | [0, 0]   | 偏移量 [x, y]    |
| `anchor`          | string           | 'bottom' | 锚点位置         |
| `className`       | string           | ''       | 自定义 CSS 类名  |
| `stopPropagation` | boolean          | true     | 是否阻止事件传播 |

### 锚点位置 (anchor)

- `center`: 中心
- `top`: 上方
- `bottom`: 下方
- `left`: 左侧
- `right`: 右侧
- `top-left`: 左上
- `top-right`: 右上
- `bottom-left`: 左下
- `bottom-right`: 右下

```javascript
const popup = new Popup({
  anchor: 'top', // 弹窗出现在点的上方
});
```

## 实例方法

| 方法                | 说明           | 示例                               |
| ------------------- | -------------- | ---------------------------------- |
| `setLnglat(lnglat)` | 设置位置       | `popup.setLnglat([120, 30])`       |
| `setHTML(html)`     | 设置 HTML 内容 | `popup.setHTML('<div>内容</div>')` |
| `setText(text)`     | 设置纯文本内容 | `popup.setText('文本内容')`        |
| `setDOMContent(el)` | 设置 DOM 元素  | `popup.setDOMContent(element)`     |
| `remove()`          | 移除弹窗       | `popup.remove()`                   |
| `isOpen()`          | 是否打开       | `popup.isOpen()`                   |
| `addTo(scene)`      | 添加到场景     | `popup.addTo(scene)`               |

## 常见问题

### 1. 弹窗位置不对

**原因**: 偏移量设置不合适

**解决方案**:

```javascript
const popup = new Popup({
  offsets: [0, -20], // 向上偏移 20 像素
  anchor: 'bottom', // 设置锚点位置
});
```

### 2. 弹窗内容被截断

**原因**: 宽度限制

**解决方案**:

```javascript
const popup = new Popup({
  maxWidth: '400px'  // 增加最大宽度
});

// 或使用 CSS
.l7-popup {
  max-width: 400px !important;
}
```

### 3. 弹窗事件冲突

**问题**: 点击弹窗内的按钮触发了地图事件

**解决方案**:

```javascript
const popup = new Popup({
  stopPropagation: true, // 阻止事件传播
});
```

### 4. 多个弹窗管理

**问题**: 同时显示多个弹窗，需要统一管理

**解决方案**:

```javascript
class PopupManager {
  constructor() {
    this.popups = [];
  }

  add(popup) {
    this.popups.push(popup);
  }

  removeAll() {
    this.popups.forEach((popup) => popup.remove());
    this.popups = [];
  }

  removeLast() {
    const popup = this.popups.pop();
    if (popup) {
      popup.remove();
    }
  }
}

const manager = new PopupManager();

layer.on('click', (e) => {
  const popup = new Popup().setLnglat(e.lngLat).setHTML(`<div>${e.feature.properties.name}</div>`);

  scene.addPopup(popup);
  manager.add(popup);
});

// 清除所有弹窗
manager.removeAll();
```

## 高级用法

### 响应式弹窗

```javascript
function createResponsivePopup(data, lnglat) {
  const isMobile = window.innerWidth < 768;

  const popup = new Popup({
    maxWidth: isMobile ? '200px' : '400px',
    offsets: isMobile ? [0, 5] : [0, 10],
  }).setLnglat(lnglat).setHTML(`
      <div style="padding: ${isMobile ? '8px' : '15px'};">
        <h3 style="font-size: ${isMobile ? '14px' : '16px'};">${data.name}</h3>
        <p style="font-size: ${isMobile ? '12px' : '14px'};">${data.value}</p>
      </div>
    `);

  return popup;
}
```

### 带加载状态的弹窗

```javascript
layer.on('click', async (e) => {
  // 显示加载状态
  const popup = new Popup({
    offsets: [0, 10],
  })
    .setLnglat(e.lngLat)
    .setHTML('<div>加载中...</div>');

  scene.addPopup(popup);

  // 异步加载数据
  try {
    const data = await fetchDetailData(e.feature.properties.id);

    // 更新内容
    popup.setHTML(`
      <div style="padding: 15px;">
        <h3>${data.name}</h3>
        <p>${data.description}</p>
      </div>
    `);
  } catch (error) {
    popup.setHTML('<div>加载失败</div>');
  }
});
```

## 相关技能

- [场景初始化](../01-core/scene-initialization.md)
- [事件处理](../05-interaction/event-handling.md)
- [标注组件](./marker.md)
- [点图层](../03-layers/point-layer.md)

## 在线示例

查看更多示例: [L7 官方示例 - Popup](https://l7.antv.antgroup.com/examples/component/popup)
