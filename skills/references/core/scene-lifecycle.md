---
skill_id: scene-lifecycle
skill_name: 场景生命周期管理
category: core
difficulty: intermediate
tags: [scene, lifecycle, events, destroy]
dependencies: [scene-initialization]
version: 2.x
---

# 场景生命周期管理

## 技能描述

管理 L7 场景的完整生命周期，包括场景加载、运行时事件监听、以及场景销毁。理解和正确使用生命周期事件对于构建稳定的地图应用至关重要。

## 何时使用

- ✅ 需要在场景加载完成后执行初始化操作
- ✅ 监听地图的缩放、平移等交互事件
- ✅ 监听容器大小变化，实现响应式布局
- ✅ 页面卸载或组件销毁时清理资源
- ✅ 调试时需要开启/关闭实时渲染

## 前置条件

- 已完成[场景初始化](./scene.md)

## 核心概念

### 生命周期阶段

L7 场景的生命周期分为三个主要阶段：

1. **初始化阶段**：创建 Scene 实例
2. **运行阶段**：场景加载完成，可以添加图层、监听事件
3. **销毁阶段**：场景被销毁，释放资源

```
创建 Scene → loaded 事件 → 添加图层/监听事件 → 销毁 Scene
```

## 代码示例

### 场景加载事件

#### loaded 事件 - 场景初始化完成

最重要的生命周期事件，所有图层和组件都应该在此事件后添加。

```javascript
import { Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [120.19, 30.26],
    zoom: 10,
  }),
});

// 场景加载完成后执行
scene.on('loaded', () => {
  console.log('场景已加载完成，可以添加图层');

  // 在这里添加图层
  const pointLayer = new PointLayer()
    .source(data, { parser: { type: 'json', x: 'lng', y: 'lat' } })
    .shape('circle')
    .size(10)
    .color('#5B8FF9');

  scene.addLayer(pointLayer);
});
```

#### resize 事件 - 容器大小变化

当地图容器大小改变时触发，适用于响应式布局。

```javascript
scene.on('resize', () => {
  console.log('地图容器大小已改变');
  // 可以在这里重新布局或调整图层
});
```

**常见场景**：

```javascript
// 监听窗口大小变化，自动调整地图
window.addEventListener('resize', () => {
  // Scene 会自动触发 resize 事件
});
```

### 地图交互事件

#### 缩放事件

```javascript
// 缩放级别更改后触发
scene.on('zoomchange', (e) => {
  console.log('当前缩放级别:', scene.getZoom());
});

// 缩放开始时触发
scene.on('zoomstart', () => {
  console.log('开始缩放');
});

// 缩放停止时触发
scene.on('zoomend', () => {
  console.log('缩放结束');
});
```

#### 地图移动事件

```javascript
// 地图平移时触发
scene.on('mapmove', () => {
  console.log('地图正在移动');
});

// 地图平移开始时触发
scene.on('movestart', () => {
  console.log('开始移动');
});

// 地图移动结束后触发（包括平移和缩放导致的中心点变化）
scene.on('moveend', () => {
  const center = scene.getCenter();
  console.log('移动结束，当前中心点:', center);
});
```

#### 拖拽事件

```javascript
// 开始拖拽地图时触发
scene.on('dragstart', (e) => {
  console.log('开始拖拽');
});

// 拖拽地图过程中触发
scene.on('dragging', (e) => {
  console.log('正在拖拽');
});

// 停止拖拽地图时触发
scene.on('dragend', (e) => {
  console.log('拖拽结束');
});
```

### 鼠标事件

```javascript
// 鼠标点击
scene.on('click', (e) => {
  console.log('点击位置:', e.lngLat);
});

// 鼠标双击
scene.on('dblclick', (e) => {
  console.log('双击位置:', e.lngLat);
});

// 鼠标移动
scene.on('mousemove', (e) => {
  // 高频事件，注意性能
});

// 鼠标右键
scene.on('contextmenu', (e) => {
  e.preventDefault(); // 阻止默认右键菜单
  console.log('右键点击位置:', e.lngLat);
});

// 鼠标进入/离开地图容器
scene.on('mouseover', () => {
  console.log('鼠标进入地图');
});

scene.on('mouseout', () => {
  console.log('鼠标离开地图');
});

// 鼠标按下/抬起
scene.on('mousedown', (e) => {
  console.log('鼠标按下');
});

scene.on('mouseup', (e) => {
  console.log('鼠标抬起');
});

// 鼠标滚轮
scene.on('mousewheel', (e) => {
  console.log('鼠标滚轮缩放');
});
```

### 移除事件监听

```javascript
// 定义事件处理函数
const handleClick = (e) => {
  console.log('点击位置:', e.lngLat);
};

// 绑定事件
scene.on('click', handleClick);

// 移除事件监听
scene.off('click', handleClick);
```

### 场景销毁

#### destroy 方法

离开页面或不再需要地图时，必须调用 destroy 方法释放资源。

```javascript
// 销毁场景
scene.destroy();
```

**React 示例**：

```javascript
import { useEffect } from 'react';
import { Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

function MapComponent() {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [120.19, 30.26],
        zoom: 10,
      }),
    });

    scene.on('loaded', () => {
      // 添加图层
    });

    // 组件卸载时销毁场景
    return () => {
      scene.destroy();
    };
  }, []);

  return <div id="map" style={{ height: '500px' }} />;
}
```

**Vue 示例**：

```javascript
import { onMounted, onBeforeUnmount } from 'vue';
import { Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

export default {
  setup() {
    let scene = null;

    onMounted(() => {
      scene = new Scene({
        id: 'map',
        map: new GaodeMap({
          center: [120.19, 30.26],
          zoom: 10,
        }),
      });

      scene.on('loaded', () => {
        // 添加图层
      });
    });

    onBeforeUnmount(() => {
      if (scene) {
        scene.destroy();
      }
    });

    return {};
  },
};
```

#### destroy 事件

场景销毁时触发的事件。

```javascript
scene.on('destroy', () => {
  console.log('场景已销毁');
  // 可以在这里执行额外的清理工作
});

scene.destroy();
```

### 调试相关事件

#### 开启/关闭实时渲染

L7 默认按需重绘以节省资源。调试时可以开启实时渲染，便于使用 SpectorJS 等工具捕捉帧渲染。

```javascript
// 开启实时渲染（用于调试）
scene.startAnimate();

// 停止实时渲染
scene.stopAnimate();
```

#### WebGL 上下文丢失

```javascript
scene.on('webglcontextlost', () => {
  console.error('WebGL 上下文丢失');
  // 可以提示用户刷新页面
});
```

## 实际应用场景

### 1. 响应式地图

```javascript
const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [120.19, 30.26],
    zoom: 10,
  }),
});

scene.on('loaded', () => {
  addLayers();
});

// 容器大小变化时重新布局
scene.on('resize', () => {
  // 根据新尺寸调整图层或控件
  updateLayout();
});
```

### 2. 缩放级别联动

```javascript
scene.on('loaded', () => {
  const layer = new PointLayer().source(data).shape('circle').size(10).color('#5B8FF9');

  scene.addLayer(layer);
});

// 根据缩放级别调整图层显示
scene.on('zoomchange', () => {
  const zoom = scene.getZoom();

  if (zoom < 10) {
    // 小级别显示聚合数据
    layer.hide();
    clusterLayer.show();
  } else {
    // 大级别显示详细数据
    layer.show();
    clusterLayer.hide();
  }
});
```

### 3. 地图移动加载数据

```javascript
scene.on('moveend', () => {
  const bounds = scene.getBounds();

  // 根据可视范围加载数据
  fetchDataInBounds(bounds).then((data) => {
    layer.setData(data);
  });
});
```

### 4. 交互提示

```javascript
scene.on('loaded', () => {
  const layer = new PointLayer().source(data).shape('circle').size(10).color('#5B8FF9');

  scene.addLayer(layer);

  // 图层点击事件
  layer.on('click', (e) => {
    console.log('点击了点:', e.feature.properties);
  });
});

// 全局点击事件
scene.on('click', (e) => {
  console.log('点击了地图:', e.lngLat);
});
```

## 常见问题

### Q: 为什么必须在 loaded 事件后添加图层？

A: 场景需要完成初始化（包括 WebGL 上下文、地图底图等）才能正确渲染图层。在 loaded 之前添加图层可能导致渲染失败。

### Q: 如何避免内存泄漏？

A: 确保在页面/组件卸载时调用 `scene.destroy()`，并移除所有事件监听器。

```javascript
// ❌ 错误：忘记销毁
useEffect(() => {
  const scene = new Scene({...});
  // 没有返回清理函数
}, []);

// ✅ 正确：销毁场景
useEffect(() => {
  const scene = new Scene({...});
  return () => scene.destroy();
}, []);
```

### Q: 事件监听器会自动移除吗？

A: 调用 `scene.destroy()` 时会自动移除所有事件监听器。但如果需要临时移除某个监听器，应该手动调用 `scene.off()`。

### Q: resize 事件什么时候触发？

A: 当地图容器的 DOM 元素大小改变时触发。通常由以下情况引起：

- 窗口大小改变
- 父容器大小改变
- CSS 样式动态修改

### Q: 场景销毁后还能重新使用吗？

A: 不能。销毁后的 Scene 实例无法恢复，需要重新创建新的 Scene 实例。

## 注意事项

⚠️ **性能优化**：避免在高频事件（mousemove、mapmove）中执行复杂计算

⚠️ **内存管理**：确保销毁场景时同时销毁所有图层和组件

⚠️ **事件顺序**：某些事件有先后顺序，如 zoomstart → zoomchange → zoomend

⚠️ **异步操作**：在 loaded 事件中进行异步数据加载时注意错误处理

## 相关技能

- [场景初始化](./scene.md)
- [场景方法](./scene-methods.md)
- [事件处理](../interaction/events.md)
- [点图层](../layers/point.md)

## 在线示例

查看更多示例：[L7 官方示例](https://l7.antv.antgroup.com/examples)
