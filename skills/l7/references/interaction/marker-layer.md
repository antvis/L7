---
skill_id: marker-layer
skill_name: MarkerLayer 标注图层
category: interaction
difficulty: intermediate
tags: [marker, marker-layer, annotation, dom, cluster]
dependencies: [scene-initialization, marker, popup]
version: 2.x
---

# MarkerLayer 标注图层

## 技能描述

掌握 MarkerLayer 的使用方法，这是一个用于统一管理大量 DOM 标注的组件。MarkerLayer 是 Marker 的升级版，支持批量添加、聚合显示、统一样式管理等功能，适合需要高度自定义标注样式的场景。

## 何时使用

- ✅ 需要添加大量自定义 DOM 标注
- ✅ 需要实现标注聚合显示
- ✅ 需要统一管理多个 Marker 的样式
- ✅ 需要标注支持复杂的 HTML/CSS 样式
- ✅ 需要标注支持点击、拖拽等交互

## 前置条件

- 已完成 [场景初始化](../core/scene.md)
- 了解 [Marker](./components.md) 基础用法
- 准备好标注数据和样式

## 核心概念

### Marker vs MarkerLayer vs PointLayer

| 对比项       | Marker     | MarkerLayer    | PointLayer  |
| ------------ | ---------- | -------------- | ----------- |
| **渲染方式** | DOM        | DOM 批量管理   | WebGL       |
| **性能**     | 低（<100） | 中（100-1000） | 高（>1000） |
| **自定义性** | 高         | 高             | 低          |
| **聚合支持** | ❌         | ✅             | ✅          |
| **适用场景** | 少量标注   | 中等数量标注   | 海量点位    |

### 技术差异

```javascript
// Marker - 独立的地图标注
const marker = new Marker().setLnglat([lng, lat]);
scene.addMarker(marker);

// MarkerLayer - 统一管理多个 Marker
const markerLayer = new MarkerLayer();
markers.forEach((m) => markerLayer.addMarker(m));
scene.addMarkerLayer(markerLayer);

// PointLayer - WebGL 绘制
const pointLayer = new PointLayer().source(data).shape('circle');
scene.addLayer(pointLayer);
```

## 基础用法

### 1. 最简单的用法

创建 MarkerLayer 并添加标注：

```javascript
import { Scene, Marker, MarkerLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [120, 30],
    zoom: 10,
  }),
});

scene.on('loaded', () => {
  // 创建 MarkerLayer
  const markerLayer = new MarkerLayer();

  // 添加标注
  const marker1 = new Marker().setLnglat([120.1, 30.1]);
  const marker2 = new Marker().setLnglat([120.2, 30.2]);

  markerLayer.addMarker(marker1);
  markerLayer.addMarker(marker2);

  // 添加到场景
  scene.addMarkerLayer(markerLayer);
});
```

### 2. 自定义标注样式

使用 HTML/CSS 自定义标注：

```javascript
const markerLayer = new MarkerLayer();

// 创建自定义标注
const data = [
  { lng: 120.1, lat: 30.1, name: '点位 1', type: 'A' },
  { lng: 120.2, lat: 30.2, name: '点位 2', type: 'B' },
];

data.forEach((item) => {
  // 创建自定义 DOM 元素
  const el = document.createElement('div');
  el.className = 'custom-marker';
  el.innerHTML = `
    <div class="marker-content">
      <span class="marker-icon">${item.type}</span>
      <span class="marker-label">${item.name}</span>
    </div>
  `;

  // 设置样式
  el.style.cssText = `
    cursor: pointer;
    transform: translate(-50%, -100%);
  `;

  // 创建 Marker
  const marker = new Marker({ element: el }).setLnglat([item.lng, item.lat]);

  // 添加点击事件
  marker.on('click', () => {
    console.log('Clicked:', item.name);
  });

  markerLayer.addMarker(marker);
});

scene.addMarkerLayer(markerLayer);
```

### 3. 使用 markerOption 统一样式

通过 markerOption 设置默认样式：

```javascript
const markerLayer = new MarkerLayer({
  markerOption: {
    color: '#ff5722', // 默认颜色
    style: {
      width: '28px',
      height: '28px',
      borderRadius: '50%',
    },
    className: 'demo-marker', // 自定义 class
  },
});

// 添加的 Marker 会自动应用默认样式
const marker = new Marker().setLnglat([lng, lat]);
markerLayer.addMarker(marker);

scene.addMarkerLayer(markerLayer);
```

### 4. 启用聚合显示

开启聚合功能，自动聚合附近的标注：

```javascript
const markerLayer = new MarkerLayer({
  cluster: true, // 启用聚合
  clusterOption: {
    radius: 40, // 聚合半径（像素）
    minZoom: 0, // 最小聚合级别
    maxZoom: 16, // 最大聚合级别
    field: 'value', // 统计字段
    method: 'sum', // 统计方法：sum|max|min|mean
    element: (feature) => {
      // 自定义聚合元素
      const el = document.createElement('div');
      el.className = 'cluster-marker';
      el.innerHTML = `
        <div class="cluster-count">${feature.point_count}</div>
      `;
      el.style.cssText = `
        width: 40px;
        height: 40px;
        background: #1890ff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
      `;
      return el;
    },
  },
});

// 添加带 extData 的 Marker
data.forEach((item) => {
  const marker = new Marker({
    extData: item, // 业务数据
  }).setLnglat([item.lng, item.lat]);

  markerLayer.addMarker(marker);
});

scene.addMarkerLayer(markerLayer);
```

### 5. 添加 Popup 弹窗

为 Marker 添加 Popup：

```javascript
const markerLayer = new MarkerLayer();

data.forEach((item) => {
  const marker = new Marker().setLnglat([item.lng, item.lat]);

  // 创建 Popup
  const popup = new Popup({
    closeButton: true,
    offsets: [0, 10],
  }).setHTML(`
    <h3>${item.name}</h3>
    <p>类型：${item.type}</p>
    <p>数值：${item.value}</p>
  `);

  // 为 Marker 设置 Popup
  marker.setPopup(popup);

  markerLayer.addMarker(marker);
});

scene.addMarkerLayer(markerLayer);
```

## 配置选项

### MarkerLayer 配置

```typescript
interface IMarkerLayerOption {
  cluster?: boolean; // 是否启用聚合
  clusterOption?: Partial<IMarkerStyleOption>; // 聚合配置
  markerOption?: {
    // 默认 Marker 选项
    color?: string; // 默认颜色
    style?: CSSStyleDeclaration; // 默认样式
    className?: string; // 默认 class
  };
}
```

### clusterOption 聚合配置

```typescript
interface IMarkerStyleOption {
  element?: Function; // 聚合元素生成函数
  style?: object | Function; // 聚合样式
  className?: string; // 自定义类名
  field?: string; // 聚合统计字段
  method?: 'sum' | 'max' | 'min' | 'mean'; // 统计方法
  radius?: number; // 聚合半径（默认 40）
  maxZoom?: number; // 最大聚合级别（默认 20）
  minZoom?: number; // 最小聚合级别（默认 0）
  zoom?: number; // 当前缩放级别
}
```

## 方法

### addMarker(marker: IMarker)

添加单个标注：

```javascript
const marker = new Marker().setLnglat([lng, lat]);
markerLayer.addMarker(marker);
```

### removeMarker(marker: IMarker)

移除标注：

```javascript
const markers = markerLayer.getMarkers();
if (markers.length > 0) {
  markerLayer.removeMarker(markers[0]);
}
```

⚠️ **注意**：`removeMarker` 会销毁 Marker，如需临时隐藏请使用 `hide()`/`show()`。

### getMarkers(): IMarker[]

获取所有标注：

```javascript
const markers = markerLayer.getMarkers();
console.log('标注数量:', markers.length);

// 获取所有标注的业务数据
const dataList = markers.map((m) => m.getExtData());
```

### clear()

清除所有标注：

```javascript
markerLayer.clear();
```

### destroy()

销毁 MarkerLayer：

```javascript
markerLayer.destroy();
```

## Marker 方法

### hide() / show()

隐藏/显示标注：

```javascript
const marker = markerLayer.getMarkers()[0];

marker.hide(); // 隐藏
marker.show(); // 显示
```

### setPopup(popup: IPopup)

设置 Popup：

```javascript
const popup = new Popup().setHTML('<h3>标题</h3><p>内容</p>');
marker.setPopup(popup);

// 打开/关闭 Popup
marker.openPopup();
marker.closePopup();
```

### setLnglat(lnglat: ILngLat)

更新标注位置：

```javascript
marker.setLnglat([newLng, newLat]);
```

### setDraggable(draggable: boolean)

设置是否可拖拽：

```javascript
marker.setDraggable(true);

marker.on('dragend', (e) => {
  console.log('新位置:', e.target.getLnglat());
});
```

### setExtData(data: any)

设置业务数据：

```javascript
marker.setExtData({
  id: 1,
  name: '点位 1',
  value: 100,
});

// 获取业务数据
const data = marker.getExtData();
```

## 实际应用场景

### 1. 店铺标注

```javascript
const shopMarkerLayer = new MarkerLayer({
  markerOption: {
    color: '#faad14',
    style: {
      width: '32px',
      height: '32px',
    },
  },
});

shops.forEach((shop) => {
  const el = document.createElement('div');
  el.className = 'shop-marker';
  el.innerHTML = `
    <div class="shop-icon">🏪</div>
    <div class="shop-name">${shop.name}</div>
  `;
  el.style.cssText = `
    cursor: pointer;
    white-space: nowrap;
  `;

  const marker = new Marker({ element: el }).setLnglat([shop.lng, shop.lat]);

  // 添加 Popup
  const popup = new Popup({
    offsets: [0, -10],
  }).setHTML(`
    <h3>${shop.name}</h3>
    <p>评分：${'⭐'.repeat(shop.rating)}</p>
    <p>人均：¥${shop.price}</p>
    <p>地址：${shop.address}</p>
  `);

  marker.setPopup(popup);
  shopMarkerLayer.addMarker(marker);
});

scene.addMarkerLayer(shopMarkerLayer);
```

### 2. 轨迹点标注

```javascript
const trackMarkerLayer = new MarkerLayer();

trackPoints.forEach((point, index) => {
  const el = document.createElement('div');
  el.className = 'track-point';
  el.innerHTML = `${index + 1}`;
  el.style.cssText = `
    width: 24px;
    height: 24px;
    background: #1890ff;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
  `;

  const marker = new Marker({ element: el }).setLnglat([point.lng, point.lat]);

  marker.setExtData({
    index: index + 1,
    time: point.time,
    speed: point.speed,
  });

  trackMarkerLayer.addMarker(marker);
});

scene.addMarkerLayer(trackMarkerLayer);
```

### 3. 聚合统计展示

```javascript
const clusterMarkerLayer = new MarkerLayer({
  cluster: true,
  clusterOption: {
    radius: 50,
    field: 'gdp',
    method: 'sum',
    element: (feature) => {
      const el = document.createElement('div');
      el.className = 'cluster-marker';

      // 根据聚合数量设置大小
      const count = feature.point_count;
      const size = Math.min(40 + count * 2, 80);

      el.innerHTML = `
        <div class="cluster-value">¥${(feature.point_sum / 10000).toFixed(1)}万亿</div>
        <div class="cluster-count">${count}个城市</div>
      `;

      el.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, #1890ff 0%, #096dd9 100%);
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      `;

      return el;
    },
  },
});

cities.forEach((city) => {
  const marker = new Marker({
    extData: {
      name: city.name,
      gdp: city.gdp,
      population: city.population,
    },
  }).setLnglat([city.lng, city.lat]);

  clusterMarkerLayer.addMarker(marker);
});

scene.addMarkerLayer(clusterMarkerLayer);
```

### 4. 动态更新标注

```javascript
class DynamicMarkerLayer {
  constructor(scene) {
    this.scene = scene;
    this.markerLayer = new MarkerLayer();
    this.markers = new Map(); // 用 Map 存储 marker
    this.scene.addMarkerLayer(this.markerLayer);
  }

  // 添加或更新标注
  updateMarker(id, data) {
    if (this.markers.has(id)) {
      // 更新现有标注
      const marker = this.markers.get(id);
      marker.setLnglat([data.lng, data.lat]);
      marker.setExtData(data);
    } else {
      // 创建新标注
      const el = this.createMarkerElement(data);
      const marker = new Marker({ element: el }).setLnglat([data.lng, data.lat]).setExtData(data);

      this.markerLayer.addMarker(marker);
      this.markers.set(id, marker);
    }
  }

  // 移除标注
  removeMarker(id) {
    const marker = this.markers.get(id);
    if (marker) {
      this.markerLayer.removeMarker(marker);
      this.markers.delete(id);
    }
  }

  // 创建标注元素
  createMarkerElement(data) {
    const el = document.createElement('div');
    el.className = 'dynamic-marker';
    el.innerHTML = `
      <div class="marker-icon">${data.icon || '📍'}</div>
      <div class="marker-label">${data.name}</div>
    `;
    return el;
  }

  // 清空所有标注
  clear() {
    this.markerLayer.clear();
    this.markers.clear();
  }
}

// 使用
const dynamicLayer = new DynamicMarkerLayer(scene);

// 实时更新
setInterval(() => {
  vehicles.forEach((vehicle) => {
    dynamicLayer.updateMarker(vehicle.id, {
      lng: vehicle.lng,
      lat: vehicle.lat,
      name: vehicle.name,
      icon: '🚗',
    });
  });
}, 1000);
```

### 5. 带动画的标注

```javascript
const animatedMarkerLayer = new MarkerLayer();

data.forEach((item) => {
  const el = document.createElement('div');
  el.className = 'pulse-marker';
  el.innerHTML = `
    <div class="pulse-ring"></div>
    <div class="pulse-dot"></div>
  `;

  // 添加 CSS 动画
  const style = document.createElement('style');
  style.textContent = `
    .pulse-marker {
      position: relative;
      width: 20px;
      height: 20px;
    }
    .pulse-dot {
      position: absolute;
      width: 10px;
      height: 10px;
      background: #ff4d4f;
      border-radius: 50%;
      top: 5px;
      left: 5px;
    }
    .pulse-ring {
      position: absolute;
      width: 20px;
      height: 20px;
      border: 2px solid #ff4d4f;
      border-radius: 50%;
      animation: pulse 1.5s ease-out infinite;
    }
    @keyframes pulse {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      100% {
        transform: scale(3);
        opacity: 0;
      }
    }
  `;
  el.appendChild(style);

  const marker = new Marker({ element: el }).setLnglat([item.lng, item.lat]);

  animatedMarkerLayer.addMarker(marker);
});

scene.addMarkerLayer(animatedMarkerLayer);
```

### 6. 标注筛选

```javascript
const filterableMarkerLayer = new MarkerLayer();
const markerMap = new Map();

// 添加所有标注
categories.forEach((category) => {
  const markers = category.data.map((item) => {
    const el = document.createElement('div');
    el.className = `marker marker-${category.id}`;
    el.innerHTML = item.name;

    const marker = new Marker({ element: el }).setLnglat([item.lng, item.lat]);

    marker.setExtData({ category: category.id });
    filterableMarkerLayer.addMarker(marker);
    markerMap.set(item.id, marker);

    return marker;
  });
});

scene.addMarkerLayer(filterableMarkerLayer);

// 筛选函数
function filterMarkers(categoryIds) {
  markerMap.forEach((marker, id) => {
    const data = marker.getExtData();
    if (categoryIds.includes(data.category)) {
      marker.show();
    } else {
      marker.hide();
    }
  });
}

// 使用
document.getElementById('filter').addEventListener('change', (e) => {
  const selectedCategories = Array.from(e.target.selectedOptions).map((opt) => opt.value);
  filterMarkers(selectedCategories);
});
```

## 性能优化

### 1. 控制标注数量

```javascript
// 只添加视野范围内的标注
function addMarkersInView(bounds, markers) {
  const markerLayer = new MarkerLayer();

  markers.forEach((item) => {
    if (isInBounds([item.lng, item.lat], bounds)) {
      const marker = new Marker().setLnglat([item.lng, item.lat]);
      markerLayer.addMarker(marker);
    }
  });

  scene.addMarkerLayer(markerLayer);
}

// 监听视野变化
scene.on('moveend', () => {
  const bounds = scene.getBounds();
  // 重新加载视野范围内的标注
});
```

### 2. 根据缩放级别显示

```javascript
scene.on('zoomchange', () => {
  const zoom = scene.getZoom();

  markers.forEach((marker) => {
    const data = marker.getExtData();

    // 根据缩放级别控制显示
    if (zoom < 10 && data.type === 'city') {
      marker.show();
    } else if (zoom >= 10 && zoom < 14 && data.type === 'district') {
      marker.show();
    } else if (zoom >= 14 && data.type === 'poi') {
      marker.show();
    } else {
      marker.hide();
    }
  });
});
```

### 3. 使用虚拟滚动

```javascript
class VirtualMarkerLayer {
  constructor(scene, maxCount = 500) {
    this.scene = scene;
    this.maxCount = maxCount;
    this.markerLayer = new MarkerLayer();
    this.allMarkers = [];
    this.visibleMarkers = [];

    this.scene.addMarkerLayer(this.markerLayer);
    this.scene.on('moveend', () => this.updateVisibleMarkers());
  }

  setMarkers(markers) {
    this.allMarkers = markers;
    this.updateVisibleMarkers();
  }

  updateVisibleMarkers() {
    const bounds = this.scene.getBounds();
    const center = this.scene.getCenter();

    // 计算距离，只显示最近的 maxCount 个
    const sorted = this.allMarkers
      .filter((m) => isInBounds([m.lng, m.lat], bounds))
      .map((m) => ({
        ...m,
        distance: this.calculateDistance(center, [m.lng, m.lat]),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, this.maxCount);

    // 更新标注
    this.markerLayer.clear();
    sorted.forEach((item) => {
      const marker = new Marker().setLnglat([item.lng, item.lat]);
      this.markerLayer.addMarker(marker);
    });
  }

  calculateDistance(point1, point2) {
    const [lng1, lat1] = point1;
    const [lng2, lat2] = point2;
    return Math.sqrt(Math.pow(lng2 - lng1, 2) + Math.pow(lat2 - lat1, 2));
  }
}
```

## 常见问题

### Q: MarkerLayer 和 PointLayer 如何选择？

A:

- **MarkerLayer**：需要高度自定义样式、支持 HTML/CSS、数量 < 1000
- **PointLayer**：追求性能、样式相对简单、数量 > 1000

### Q: 聚合标注不显示怎么办？

A: 检查以下几点：

1. `cluster` 是否设置为 `true`
2. `clusterOption` 配置是否正确
3. Marker 是否添加了 `extData`
4. 缩放级别是否在聚合范围内

### Q: 如何获取聚合标注的原始数据？

A: 通过 `getClustersLeaves` 方法：

```javascript
markerLayer.on('click', (e) => {
  if (e.feature && e.feature.cluster) {
    const leaves = markerLayer.getSource().getClustersLeaves(e.feature.cluster_id);
    console.log('聚合包含的原始数据:', leaves);
  }
});
```

### Q: 如何自定义聚合样式？

A: 使用 `clusterOption.element` 回调：

```javascript
clusterOption: {
  element: (feature) => {
    const el = document.createElement('div');
    el.innerHTML = `<div>${feature.point_count}</div>`;
    el.style.cssText = '...';
    return el;
  },
}
```

### Q: Marker 拖拽后如何获取新位置？

A: 监听 `dragend` 事件：

```javascript
marker.setDraggable(true);
marker.on('dragend', (e) => {
  const newLngLat = e.target.getLnglat();
  console.log('新位置:', newLngLat);
});
```

### Q: 如何批量更新标注位置？

A: 遍历更新：

```javascript
markers.forEach((marker, index) => {
  const newData = updatedData[index];
  marker.setLnglat([newData.lng, newData.lat]);
});
```

## 注意事项

⚠️ **性能限制**：MarkerLayer 使用 DOM 渲染，建议标注数量控制在 1000 以内

⚠️ **内存管理**：移除 MarkerLayer 时调用 `destroy()` 清理资源

⚠️ **样式冲突**：自定义 class 注意避免与 L7 内部样式冲突

⚠️ **事件绑定**：在添加到 MarkerLayer 之前绑定事件

⚠️ **聚合数据**：使用聚合时需要为 Marker 设置 `extData`

⚠️ **单点显示**：当聚合只包含 1 个点时，会显示原始 Marker 而非聚合元素

## 相关技能

- [Marker](./components.md) - 基础标注组件
- [Popup](./popup.md) - 弹窗组件
- [点图层](../layers/point.md) - WebGL 点图层
- [事件处理](./events.md) - 事件监听

## 在线示例

查看更多示例：[L7 MarkerLayer 示例](https://l7.antv.antgroup.com/examples/point/marker#markerlayer)
