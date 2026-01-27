---
skill_id: event-handling
skill_name: 事件处理
category: interaction
difficulty: beginner
tags: [event, click, mousemove, interaction]
dependencies: [scene-initialization]
version: 2.x
---

# 事件处理

## 技能描述

为图层添加交互事件监听，响应用户操作（点击、鼠标移动、悬停等）。

## 何时使用

- ✅ 点击要素查看详情
- ✅ 鼠标悬停高亮显示
- ✅ 右键显示菜单
- ✅ 双击缩放定位
- ✅ 实现自定义交互逻辑

## 支持的事件类型

| 事件          | 说明     | 常用场景           |
| ------------- | -------- | ------------------ |
| `click`       | 单击     | 查看详情、选中要素 |
| `dblclick`    | 双击     | 缩放定位           |
| `mousemove`   | 鼠标移动 | Tooltip、高亮      |
| `mouseenter`  | 鼠标进入 | 高亮、改变样式     |
| `mouseleave`  | 鼠标离开 | 取消高亮           |
| `mousedown`   | 鼠标按下 | 拖拽开始           |
| `mouseup`     | 鼠标抬起 | 拖拽结束           |
| `contextmenu` | 右键菜单 | 自定义菜单         |

## 代码示例

### 基础用法 - 点击事件

```javascript
layer.on('click', (e) => {
  console.log('点击位置:', e.lngLat);
  console.log('要素数据:', e.feature);
  console.log('要素属性:', e.feature.properties);
});
```

### 点击显示详情

```javascript
import { Popup } from '@antv/l7';

layer.on('click', (e) => {
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

### 鼠标悬停高亮

```javascript
let hoveredFeatureId = null;

// 鼠标进入
layer.on('mouseenter', (e) => {
  // 重置之前的高亮
  if (hoveredFeatureId !== null) {
    layer.setActive(hoveredFeatureId, false);
  }

  // 高亮当前要素
  hoveredFeatureId = e.featureId;
  layer.setActive(hoveredFeatureId, true);

  // 改变鼠标样式
  scene.setMapStatus({ dragEnable: false });
  document.body.style.cursor = 'pointer';
});

// 鼠标离开
layer.on('mouseleave', () => {
  // 取消高亮
  if (hoveredFeatureId !== null) {
    layer.setActive(hoveredFeatureId, false);
    hoveredFeatureId = null;
  }

  // 恢复鼠标样式
  scene.setMapStatus({ dragEnable: true });
  document.body.style.cursor = 'default';
});

// 配置高亮样式
layer.style({
  selectColor: '#FF0000',
});
```

### 鼠标移动显示 Tooltip

```javascript
let popup = null;

layer.on('mousemove', (e) => {
  const { name, value } = e.feature.properties;

  // 移除旧的 Tooltip
  if (popup) {
    popup.remove();
  }

  // 创建新的 Tooltip
  popup = new Popup({
    closeButton: false,
    closeOnClick: false,
    anchor: 'bottom',
    offsets: [0, -10],
  }).setLnglat(e.lngLat).setHTML(`
      <div style="padding: 5px 10px; font-size: 12px;">
        ${name}: ${value}
      </div>
    `);

  scene.addPopup(popup);
});

layer.on('mouseleave', () => {
  if (popup) {
    popup.remove();
    popup = null;
  }
});
```

### 右键菜单

```javascript
layer.on('contextmenu', (e) => {
  e.originalEvent.preventDefault(); // 阻止默认右键菜单

  const { name, id } = e.feature.properties;

  // 显示自定义菜单
  showContextMenu(e.x, e.y, [
    {
      label: '查看详情',
      onClick: () => showDetail(id),
    },
    {
      label: '编辑',
      onClick: () => editFeature(id),
    },
    {
      label: '删除',
      onClick: () => deleteFeature(id),
    },
  ]);
});
```

### 双击定位

```javascript
layer.on('dblclick', (e) => {
  const { lng, lat } = e.lngLat;

  // 缩放并定位到点击位置
  scene.setZoomAndCenter(12, [lng, lat], {
    duration: 1000, // 动画时长 1 秒
  });
});
```

### 点击选中/取消选中

```javascript
let selectedFeatureId = null;

layer.on('click', (e) => {
  // 如果点击的是已选中的要素，取消选中
  if (selectedFeatureId === e.featureId) {
    layer.setActive(selectedFeatureId, false);
    selectedFeatureId = null;
    return;
  }

  // 取消之前的选中
  if (selectedFeatureId !== null) {
    layer.setActive(selectedFeatureId, false);
  }

  // 选中当前要素
  selectedFeatureId = e.featureId;
  layer.setActive(selectedFeatureId, true);

  console.log('选中:', e.feature.properties.name);
});
```

### 多选功能

```javascript
const selectedFeatures = new Set();

layer.on('click', (e) => {
  const featureId = e.featureId;

  if (e.originalEvent.ctrlKey || e.originalEvent.metaKey) {
    // 按住 Ctrl/Cmd 多选
    if (selectedFeatures.has(featureId)) {
      selectedFeatures.delete(featureId);
      layer.setActive(featureId, false);
    } else {
      selectedFeatures.add(featureId);
      layer.setActive(featureId, true);
    }
  } else {
    // 单选，清除其他选中
    selectedFeatures.forEach((id) => {
      layer.setActive(id, false);
    });
    selectedFeatures.clear();

    selectedFeatures.add(featureId);
    layer.setActive(featureId, true);
  }

  console.log('已选中:', selectedFeatures.size, '个要素');
});
```

### 拖拽事件

```javascript
let isDragging = false;
let dragStartPos = null;

layer.on('mousedown', (e) => {
  isDragging = true;
  dragStartPos = e.lngLat;
  console.log('开始拖拽');
});

layer.on('mousemove', (e) => {
  if (isDragging) {
    console.log('拖拽中:', e.lngLat);
  }
});

layer.on('mouseup', (e) => {
  if (isDragging) {
    isDragging = false;
    console.log('结束拖拽');
    console.log('拖拽距离:', calculateDistance(dragStartPos, e.lngLat));
  }
});
```

### 节流优化 - 高频事件

```javascript
import { throttle } from 'lodash';

// 使用节流优化 mousemove 事件
const handleMouseMove = throttle((e) => {
  console.log('鼠标移动:', e.lngLat);
  // 更新 UI
}, 100); // 每 100ms 最多执行一次

layer.on('mousemove', handleMouseMove);
```

## 事件对象属性

### 事件对象 (e)

| 属性            | 类型             | 说明         |
| --------------- | ---------------- | ------------ |
| `lngLat`        | {lng, lat}       | 地理坐标     |
| `x`             | number           | 屏幕 X 坐标  |
| `y`             | number           | 屏幕 Y 坐标  |
| `feature`       | Object           | 要素对象     |
| `featureId`     | string \| number | 要素 ID      |
| `originalEvent` | Event            | 原生事件对象 |

### feature 对象

```javascript
layer.on('click', (e) => {
  console.log(e.feature);
  // {
  //   type: 'Feature',
  //   properties: { name: '杭州', value: 100 },
  //   geometry: { type: 'Point', coordinates: [120, 30] }
  // }
});
```

## 移除事件监听

```javascript
// 添加事件监听
const handleClick = (e) => {
  console.log('点击');
};

layer.on('click', handleClick);

// 移除特定事件监听
layer.off('click', handleClick);

// 移除所有事件监听
layer.off('click');
```

## 场景事件

除了图层事件，Scene 也支持事件监听：

```javascript
// 场景加载完成
scene.on('loaded', () => {
  console.log('场景加载完成');
});

// 地图移动
scene.on('mapmove', () => {
  console.log('地图移动');
});

// 地图缩放
scene.on('zoom', (e) => {
  console.log('缩放级别:', e.zoom);
});

// 地图点击（未点击到图层）
scene.on('click', (e) => {
  console.log('点击地图:', e.lngLat);
});
```

## 常见问题

### 1. 事件不触发

**检查清单**:

- ✅ 图层是否已添加到场景
- ✅ 图层是否可见
- ✅ 事件名称是否正确
- ✅ 是否有其他图层遮挡

```javascript
// 调试代码
console.log('图层是否可见:', layer.isVisible());
console.log('图层层级:', layer.zIndex);
```

### 2. 事件触发多次

**原因**: 可能添加了多个相同的监听器

**解决方案**:

```javascript
// 移除旧的监听器
layer.off('click');

// 添加新的监听器
layer.on('click', handler);
```

### 3. 性能问题 - mousemove 卡顿

**原因**: mousemove 事件频率太高

**解决方案**: 使用节流

```javascript
import { throttle } from 'lodash';

const handler = throttle((e) => {
  // 处理逻辑
}, 100);

layer.on('mousemove', handler);
```

### 4. 阻止事件冒泡

```javascript
layer.on('click', (e) => {
  e.originalEvent.stopPropagation(); // 阻止冒泡

  // 你的逻辑
});
```

## 高级用法

### 事件委托 - 统一处理

```javascript
class LayerEventManager {
  constructor(layers) {
    this.layers = layers;
    this.selectedFeatures = new Map();
  }

  bindClickEvents() {
    this.layers.forEach((layer) => {
      layer.on('click', (e) => {
        this.handleClick(layer, e);
      });
    });
  }

  handleClick(layer, e) {
    console.log(`图层 ${layer.id} 被点击`);
    console.log('要素:', e.feature.properties);

    // 统一的选中逻辑
    this.selectFeature(layer, e.featureId);
  }

  selectFeature(layer, featureId) {
    // 清除其他图层的选中
    this.clearAllSelections();

    // 选中当前要素
    layer.setActive(featureId, true);
    this.selectedFeatures.set(layer.id, featureId);
  }

  clearAllSelections() {
    this.selectedFeatures.forEach((featureId, layerId) => {
      const layer = this.layers.find((l) => l.id === layerId);
      if (layer) {
        layer.setActive(featureId, false);
      }
    });
    this.selectedFeatures.clear();
  }
}

// 使用
const manager = new LayerEventManager([layer1, layer2, layer3]);
manager.bindClickEvents();
```

### 条件事件触发

```javascript
layer.on('click', (e) => {
  // 只处理特定类型的要素
  if (e.feature.properties.type === 'important') {
    handleImportantFeature(e);
  } else {
    handleNormalFeature(e);
  }
});
```

## 相关技能

- [场景初始化](../core/scene.md)
- [弹窗组件](./popup.md)
- [标注组件](./components.md)

## 在线示例

查看更多示例: [L7 官方示例 - 交互](https://l7.antv.antgroup.com/examples/interaction/select)
