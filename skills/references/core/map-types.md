---
skill_id: map-types
skill_name: 地图引擎配置
category: core
difficulty: beginner
tags: [map, gaode, mapbox, maplibre, map-engine]
dependencies: []
version: 2.x
---

# 地图引擎配置

## 技能描述

L7 支持多种地图引擎作为底图，包括高德地图、Mapbox、MapLibre 以及独立的 Map 引擎。选择合适的地图引擎是创建 L7 可视化项目的第一步。

## 何时使用

- 🗺️ **高德地图（GaodeMap）**：国内项目，需要国内地图服务和 POI 数据
- 🌍 **Mapbox**：国际项目，需要精美的国际地图样式
- 🆓 **MapLibre**：开源项目，离线部署，自定义地图服务
- 📐 **Map（独立引擎）**：室内地图、游戏地图、不需要地理底图的场景

## 前置条件

- 已安装 `@antv/l7`
- 已安装对应的地图库（如 `@antv/l7-maps`）

## 地图引擎对比

| 特性       | GaodeMap | Mapbox     | MapLibre   | Map        |
| ---------- | -------- | ---------- | ---------- | ---------- |
| 国内服务   | ✅ 优秀  | ❌ 需翻墙  | ✅ 可用    | ✅ 不依赖  |
| 国际服务   | ❌ 较弱  | ✅ 优秀    | ✅ 优秀    | ✅ 不依赖  |
| 需要 Token | ✅ 是    | ✅ 是      | ❌ 否      | ❌ 否      |
| 离线部署   | ❌ 否    | ❌ 否      | ✅ 是      | ✅ 是      |
| POI 数据   | ✅ 丰富  | ✅ 有      | ❌ 无      | ❌ 无      |
| 自定义样式 | ⭐⭐⭐   | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 坐标系统   | 经纬度   | 经纬度     | 经纬度     | 平面坐标   |
| 适用场景   | 国内地理 | 国际地理   | 自建服务   | 非地理场景 |

## 代码示例

### 1. 高德地图（GaodeMap）- 推荐国内使用

高德地图是国内最常用的地图服务，提供丰富的 POI 数据和路网信息。

#### 基础用法

```javascript
import { Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'dark', // 地图样式: dark | light | normal | satellite
    center: [120.19, 30.26], // 中心点 [经度, 纬度]
    pitch: 0, // 倾斜角度 0-60
    zoom: 10, // 缩放级别 0-22
    token: 'your-amap-key', // 高德地图 Key（可选，建议配置）
  }),
});

scene.on('loaded', () => {
  console.log('地图加载完成');
  // 添加图层
});
```

#### 申请高德地图 Token

1. 访问 [高德开放平台](https://lbs.amap.com/)
2. 注册账号并创建应用
3. 获取 Web 端（JS API）Key
4. 在代码中配置 `token` 参数

⚠️ **注意**：虽然 token 是可选的，但建议配置以避免服务限制。

#### 地图样式

高德地图支持多种内置样式：

```javascript
// 暗色主题（适合数据可视化）
map: new GaodeMap({ style: 'dark' });

// 亮色主题
map: new GaodeMap({ style: 'light' });

// 标准主题
map: new GaodeMap({ style: 'normal' });

// 卫星影像
map: new GaodeMap({ style: 'satellite' });

// 自定义样式（使用高德平台的自定义样式）
map: new GaodeMap({
  style: 'amap://styles/你的样式ID?isPublic=true',
});
```

#### 3D 视角配置

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

#### 传入已有高德地图实例

如果项目中已经创建了高德地图实例，可以直接传入：

```javascript
// 先创建高德地图实例
const map = new AMap.Map('map', {
  viewMode: '3D', // 3D 模式
  resizeEnable: true,
  zoom: 11,
  center: [116.397428, 39.90923],
});

// 传入 L7 Scene
const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    mapInstance: map, // 传入地图实例
  }),
});
```

⚠️ **注意**：

- Scene 的 id 参数需要与地图容器一致
- 需要自行引入高德地图 API
- 建议设置 `viewMode: '3D'`（高德 2.0 支持 2D 模式）

#### 使用高德地图插件

```javascript
const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [116.475, 39.99],
    zoom: 13,
    plugin: ['AMap.ToolBar', 'AMap.LineSearch'], // 注册插件
  }),
});

scene.on('loaded', () => {
  // 使用插件
  window.AMap.plugin(['AMap.ToolBar', 'AMap.LineSearch'], () => {
    // 添加工具条
    scene.map.addControl(new AMap.ToolBar());

    // 使用公交线路搜索
    const linesearch = new AMap.LineSearch({
      pageIndex: 1,
      city: '北京',
      extensions: 'all',
    });
  });
});
```

### 2. 独立地图引擎（Map）- 推荐无底图场景

Map 是 L7 内置的独立地图引擎，完全不依赖第三方地图服务，适合室内地图、游戏地图等场景。

#### 基础用法

```javascript
import { Scene } from '@antv/l7';
import { Map } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Map({
    center: [0, 0], // 使用平面坐标，不是经纬度
    zoom: 3,
    style: 'blank', // 空白背景
    minZoom: 0,
    maxZoom: 18,
  }),
});

scene.on('loaded', () => {
  // Map 使用平面坐标系统
  const data = [
    { x: 100, y: 100, value: 10 },
    { x: 200, y: 200, value: 20 },
    { x: 300, y: 150, value: 15 },
  ];

  const pointLayer = new PointLayer()
    .source(data, {
      parser: {
        type: 'json',
        x: 'x', // 平面 X 坐标
        y: 'y', // 平面 Y 坐标
      },
    })
    .shape('circle')
    .size(10)
    .color('value', ['#ffffcc', '#800026']);

  scene.addLayer(pointLayer);
});
```

#### Map 的特点

✅ **优势**：

- 无需第三方地图服务（高德、Mapbox）Key
- 完全离线可用
- 使用平面坐标系统，不受经纬度限制
- 适合室内地图、游戏地图、抽象数据可视化
- 可以自由添加瓦片底图

❌ **限制**：

- 没有内置地理数据和 POI
- 需要自己提供底图（或使用空白背景）

#### 添加自定义瓦片底图

```javascript
import { Scene, RasterLayer } from '@antv/l7';
import { Map } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Map({
    center: [120.19, 30.26],
    zoom: 10,
  }),
});

scene.on('loaded', () => {
  // 添加高德地图瓦片作为底图
  const layer = new RasterLayer();
  layer.source(
    'https://webrd0{1-3}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
    {
      parser: {
        type: 'rasterTile',
        tileSize: 256,
        minZoom: 2,
        maxZoom: 18,
      },
    },
  );
  scene.addLayer(layer);
});
```

#### 室内地图示例

```javascript
const scene = new Scene({
  id: 'map',
  map: new Map({
    center: [0, 0],
    zoom: 4,
    style: 'blank',
  }),
});

scene.on('loaded', () => {
  // 加载室内地图数据（平面坐标）
  fetch('/indoor-map.json')
    .then((res) => res.json())
    .then((data) => {
      const polygonLayer = new PolygonLayer()
        .source(data, {
          parser: {
            type: 'json',
            coordinates: 'coordinates', // 平面坐标数组
          },
        })
        .shape('fill')
        .color('type', {
          会议室: '#4575b4',
          办公区: '#74add1',
          休息区: '#fee090',
        })
        .style({
          opacity: 0.8,
        });

      scene.addLayer(polygonLayer);
    });
});
```

### 3. Mapbox（国际项目）

```javascript
import { Scene } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    style: 'mapbox://styles/mapbox/streets-v11', // Mapbox 样式
    center: [120.19, 30.26],
    zoom: 10,
    token: 'your-mapbox-token', // Mapbox Token（必需）
  }),
});
```

#### 申请 Mapbox Token

1. 访问 [Mapbox 官网](https://www.mapbox.com/)
2. 注册账号
3. 在 Account 页面获取 Access Token
4. 配置 `token` 参数

### 4. MapLibre（开源方案）

```javascript
import { Scene } from '@antv/l7';
import { Maplibre } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Maplibre({
    style: 'https://your-server.com/style.json', // 自定义样式 JSON
    center: [120.19, 30.26],
    zoom: 10,
  }),
});
```

MapLibre 完全开源，不需要 Token，适合自建地图服务。

## 地图配置参数

所有地图引擎支持的通用配置参数：

| 参数      | 类型             | 默认值  | 说明                              |
| --------- | ---------------- | ------- | --------------------------------- |
| `center`  | [number, number] | [0, 0]  | 地图中心点 [经度, 纬度] 或 [x, y] |
| `zoom`    | number           | 0       | 缩放级别 (0-22)                   |
| `pitch`   | number           | 0       | 倾斜角度 (0-60)                   |
| `bearing` | number           | 0       | 旋转角度 (0-360)                  |
| `minZoom` | number           | 0       | 最小缩放级别                      |
| `maxZoom` | number           | 22      | 最大缩放级别                      |
| `style`   | string           | 'light' | 地图样式                          |

### 高德地图特有参数

| 参数          | 类型     | 说明                     |
| ------------- | -------- | ------------------------ |
| `token`       | string   | 高德地图 Key（推荐配置） |
| `plugin`      | string[] | 要加载的高德插件数组     |
| `mapInstance` | AMap.Map | 已有的高德地图实例       |

### Mapbox 特有参数

| 参数    | 类型   | 说明                        |
| ------- | ------ | --------------------------- |
| `token` | string | Mapbox Access Token（必需） |

## 选择建议

### 国内项目推荐：GaodeMap

```javascript
✅ 优势：
- 国内服务稳定快速
- 丰富的 POI 和路网数据
- 支持多种地图样式
- 完善的中文文档

❌ 限制：
- 需要申请 Token
- 国际数据相对较弱
```

### 无底图场景推荐：Map

```javascript
✅ 优势：
- 完全离线可用
- 不需要任何 Token
- 使用灵活的平面坐标
- 可自定义底图

❌ 限制：
- 没有内置地理数据
- 需要自己处理坐标系统
```

### 国际项目推荐：Mapbox 或 MapLibre

```javascript
✅ Mapbox 优势：
- 精美的地图样式
- 全球数据完善
- 强大的自定义能力

✅ MapLibre 优势：
- 完全开源免费
- 不需要 Token
- 支持离线部署
```

## 实际应用场景

### 1. 国内城市可视化（使用 GaodeMap）

```javascript
import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'dark',
    center: [116.404, 39.915], // 北京
    zoom: 10,
    token: 'your-amap-key',
  }),
});

scene.on('loaded', () => {
  // 显示 POI 数据
  const poiLayer = new PointLayer()
    .source(poiData, {
      parser: { type: 'json', x: 'lng', y: 'lat' },
    })
    .shape('circle')
    .size(8)
    .color('category', ['#FF6B6B', '#4ECDC4', '#95E1D3']);

  scene.addLayer(poiLayer);
});
```

### 2. 室内导航（使用 Map）

```javascript
import { Scene, LineLayer } from '@antv/l7';
import { Map } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Map({
    center: [0, 0],
    zoom: 5,
    style: 'blank',
  }),
});

scene.on('loaded', () => {
  // 加载室内地图
  fetch('/indoor-layout.json')
    .then((res) => res.json())
    .then((data) => {
      // 使用平面坐标绘制室内布局
      const layoutLayer = new PolygonLayer()
        .source(data)
        .shape('fill')
        .color('roomType', colorMap)
        .style({ opacity: 0.6 });

      scene.addLayer(layoutLayer);
    });
});
```

### 3. 游戏地图（使用 Map）

```javascript
const scene = new Scene({
  id: 'map',
  map: new Map({
    center: [500, 500], // 游戏世界中心
    zoom: 4,
    style: 'blank',
    minZoom: 2,
    maxZoom: 8,
  }),
});

scene.on('loaded', () => {
  // 绘制游戏元素（使用平面坐标）
  const playerLayer = new PointLayer()
    .source(players, {
      parser: {
        type: 'json',
        x: 'posX',
        y: 'posY',
      },
    })
    .shape('player-icon')
    .size(20);

  scene.addLayer(playerLayer);
});
```

## 常见问题

### Q: 如何选择地图引擎？

A:

- **国内地理项目** → GaodeMap
- **室内地图/游戏** → Map
- **国际项目** → Mapbox 或 MapLibre
- **自建服务/离线** → Map 或 MapLibre

### Q: 高德地图不配置 Token 会怎样？

A: 可以正常使用，但可能有请求限制。建议申请 Token 以获得更稳定的服务。

### Q: Map 引擎可以显示地理地图吗？

A: 可以，通过 RasterLayer 加载地图瓦片服务作为底图即可。

### Q: 坐标系统有什么区别？

A:

- **GaodeMap/Mapbox/MapLibre**：使用经纬度坐标（WGS84）
  - 经度范围：-180 ~ 180
  - 纬度范围：-90 ~ 90
- **Map**：使用平面坐标
  - 任意数值范围
  - 适合非地理场景

### Q: 切换地图引擎会影响图层代码吗？

A: 基本不会。L7 统一了不同底图的接口，图层代码基本相同。唯一区别是坐标系统（经纬度 vs 平面坐标）。

### Q: 可以在运行时切换地图样式吗？

A: 可以，使用 `scene.setMapStyle(style)` 方法：

```javascript
// 切换为暗色主题
scene.setMapStyle('dark');

// 切换为自定义样式
scene.setMapStyle('amap://styles/your-style-id');
```

## 注意事项

⚠️ **Token 安全**：不要在公开的代码仓库中暴露 Token，建议使用环境变量

⚠️ **坐标系统**：确保数据坐标系统与地图引擎匹配

⚠️ **网络依赖**：GaodeMap、Mapbox 需要网络连接；Map 可完全离线

⚠️ **性能考虑**：Map 引擎在大数据量时性能更好，因为没有底图渲染开销

## 相关技能

- [场景初始化](./scene.md)
- [场景生命周期](./scene-lifecycle.md)
- [场景方法](./scene-methods.md)
- [点图层](../layers/point.md)

## 在线示例

- [高德地图示例](https://l7.antv.antgroup.com/examples/tutorial/map#amap)
- [Map 引擎示例](https://l7.antv.antgroup.com/examples/tutorial/map#map)
