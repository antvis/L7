---
skill_id: scene-initialization
skill_name: 场景初始化
category: core
difficulty: beginner
tags: [scene, initialization, map, setup]
dependencies: []
version: 2.x
---

# 场景初始化

## 技能描述

创建 L7 场景对象（Scene），这是使用 L7 的第一步。Scene 是包含地图、图层、组件的全局容器。

## 何时使用

- 开始任何 L7 可视化项目
- 需要在页面中嵌入地图
- 需要管理多个图层

## 前置条件

- HTML 页面中存在用于地图渲染的 DOM 容器
- 已安装 `@antv/l7` 和地图底图库（如 `@antv/l7-maps`）

## 输入参数

### 必需参数

| 参数  | 类型                  | 说明                                             |
| ----- | --------------------- | ------------------------------------------------ |
| `id`  | string \| HTMLElement | DOM 容器 ID 或 DOM 元素                          |
| `map` | MapInstance           | 地图实例 (GaodeMap \| Mapbox \| Maplibre \| Map) |

### 地图配置参数

| 参数      | 类型             | 默认值  | 说明                                            |
| --------- | ---------------- | ------- | ----------------------------------------------- |
| `style`   | string           | 'light' | 地图样式 (dark \| light \| normal \| satellite) |
| `center`  | [number, number] | [0, 0]  | 地图中心点 [经度, 纬度]                         |
| `zoom`    | number           | 0       | 缩放级别 (0-22)                                 |
| `pitch`   | number           | 0       | 倾斜角度 (0-60)                                 |
| `bearing` | number           | 0       | 旋转角度 (0-360)                                |
| `minZoom` | number           | 0       | 最小缩放级别                                    |
| `maxZoom` | number           | 22      | 最大缩放级别                                    |

### 场景配置参数

| 参数                    | 类型    | 默认值       | 说明                         |
| ----------------------- | ------- | ------------ | ---------------------------- |
| `logoVisible`           | boolean | true         | 是否显示 L7 Logo             |
| `logoPosition`          | string  | 'bottomleft' | Logo 位置                    |
| `antialias`             | boolean | true         | 是否开启抗锯齿               |
| `stencil`               | boolean | false        | 是否开启裁剪（遮罩功能需要） |
| `preserveDrawingBuffer` | boolean | false        | 是否保留缓冲区数据           |

## 输出

返回 `Scene` 实例，可以用于：

- 添加图层: `scene.addLayer(layer)`
- 添加组件: `scene.addControl(control)`
- 监听事件: `scene.on('loaded', callback)`
- 获取地图: `scene.getMapService()`

## 代码示例

### 基础用法 - 高德地图

```javascript
import { Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

// 确保 HTML 中有对应的容器
// <div id="map"></div>

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'dark',
    center: [120.19382669582967, 30.258134],
    pitch: 0,
    zoom: 12,
  }),
});

// 等待场景加载完成
scene.on('loaded', () => {
  console.log('地图加载完成');
  // 在这里添加图层
});
```

### 使用 Mapbox

```javascript
import { Scene } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [120.19, 30.26],
    zoom: 10,
    token: 'your-mapbox-token',
  }),
});
```

### 使用 MapLibre（离线部署）

```javascript
import { Scene } from '@antv/l7';
import { Maplibre } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Maplibre({
    style: 'https://your-server.com/style.json',
    center: [120.19, 30.26],
    zoom: 10,
  }),
});
```

### 使用独立地图 Map（无第三方依赖）

Map 是 L7 内置的独立地图引擎，不依赖任何第三方地图服务，适合室内地图、游戏地图等场景。

```javascript
import { Scene } from '@antv/l7';
import { Map } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Map({
    center: [0, 0], // 使用平面坐标
    zoom: 3,
    style: 'blank', // 空白背景
  }),
});

scene.on('loaded', () => {
  // Map 使用平面坐标系统，不是经纬度
  const data = [
    { x: 100, y: 100, value: 10 },
    { x: 200, y: 200, value: 20 },
  ];

  const pointLayer = new PointLayer()
    .source(data, {
      parser: {
        type: 'json',
        x: 'x',
        y: 'y',
      },
    })
    .shape('circle')
    .size(10)
    .color('#5B8FF9');

  scene.addLayer(pointLayer);
});
```

**Map 的特点**：

- ✅ 无需第三方地图服务（高德、Mapbox）Key
- ✅ 完全离线可用
- ✅ 使用平面坐标系统
- ✅ 适合室内地图、游戏地图、抽象数据可视化

### 3D 视角配置

```javascript
const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'dark',
    center: [120.19, 30.26],
    zoom: 14,
    pitch: 45, // 倾斜角度，用于 3D 效果
    bearing: 30, // 旋转角度
  }),
});
```

### 自定义 Logo 位置

```javascript
const scene = new Scene({
  id: 'map',
  logoVisible: true,
  logoPosition: 'bottomright', // bottomleft | topright | bottomleft | topleft
  map: new GaodeMap({
    style: 'light',
    center: [120.19, 30.26],
    zoom: 10,
  }),
});
```

### 开启遮罩功能

```javascript
const scene = new Scene({
  id: 'map',
  stencil: true, // 必须开启才能使用 Mask 功能
  map: new GaodeMap({
    style: 'dark',
    center: [120.19, 30.26],
    zoom: 10,
  }),
});
```

### 使用 DOM 元素

```javascript
const mapContainer = document.getElementById('my-map');

const scene = new Scene({
  id: mapContainer,
  map: new GaodeMap({
    center: [120.19, 30.26],
    zoom: 10,
  }),
});
```

## HTML 页面配置

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>L7 地图</title>
    <style>
      #map {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="your-script.js"></script>
  </body>
</html>
```

## 常见问题

**地理地图**（GaodeMap、Mapbox、Maplibre）使用 **WGS84** 坐标系统（经纬度）：

- 经度范围: -180 ~ 180
- 纬度范围: -90 ~ 90
- 格式: [经度, 纬度] 或 [lng, lat]

中国常用城市坐标参考：

- 北京: [116.404, 39.915]
- 上海: [121.473, 31.230]
- 杭州: [120.155, 30.274]
- 深圳: [114.057, 22.543]

**独立地图**（Map）使用**平面坐标系统**：

- X 轴：横向坐标（任意数值）
- Y 轴：纵向坐标（任意数值）
- 格式: [x, y]
- 适合室内地图、游戏地图等非地理场景
  document.addEventListener('DOMContentLoaded', () => {
  const scene = new Scene({
  id: 'map',
  map: new GaodeMap({...})
  });
  });

````

### 2. 高德地图 Key 配置

高德地图需要申请 Key：

```javascript
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'dark',
    center: [120, 30],
    zoom: 10,
    token: 'your-amap-key'  // 高德地图 Key
  })
});
````

### 3. 地图未显示

**检查清单**:

- ✅ 容器是否有高度（必须设置具体高度，不能为 0）
- ✅ 是否正确引入了底图库
- ✅ 控制台是否有错误信息
- ✅ 网络是否正常（在线底图需要联网）

### 4. 坐标系统

L7 使用 **WGS84** 坐标系统（经纬度）：

- 经度范围: -180 ~ 180
- 纬度范围: -90 ~ 90
- 格式: [经度, 纬度] 或 [lng, lat]

中国常用城市坐标参考：

- 北京: [116.404, 39.915]
- 上海: [121.473, 31.230]
- 杭州: [120.155, 30.274]
- 深圳: [114.057, 22.543]

## 场景生命周期事件

```javascript
// 场景加载完成
scene.on('loaded', () => {
  console.log('场景加载完成');
});

// 场景销毁
scene.on('destroy', () => {
  console.log('场景已销毁');
});
```

## 相关技能

- [场景生命周期管理](./scene-lifecycle.md)
- [场景方法](./scene-methods.md)
- [添加图层](../layers/point.md)

## 下一步

场景初始化完成后，你可以：

1. [添加点图层显示数据](../layers/point.md)
2. [添加交互控件](../interaction/components.md)
3. [处理用户交互事件](../interaction/events.md)
