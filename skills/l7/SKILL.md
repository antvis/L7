---
name: antv-l7
description: |
  Comprehensive guide for AntV L7 geospatial visualization library. Use when users need to:
  (1) Create interactive maps with WebGL rendering
  (2) Visualize geographic data (points, lines, polygons, heatmaps)
  (3) Build location-based data dashboards
  (4) Add map layers, interactions, or animations
  (5) Process and display GeoJSON, CSV, or other spatial data
  (6) Integrate maps with AMap (GaodeMap), Mapbox, Maplibre, or standalone L7 Map
  (7) Optimize performance for large-scale geographic datasets
license: MIT
---

# AntV L7 Geospatial Visualization

AntV L7 是基于 WebGL 的大规模地理空间数据可视化引擎，支持多种地图底图和丰富的可视化图层类型。

## Quick Start

创建最简单的 L7 地图应用：

```javascript
import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

// 1. 初始化场景
const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [120.19, 30.26],
    zoom: 10,
    style: 'light',
  }),
});

// 2. 添加图层
scene.on('loaded', () => {
  const pointLayer = new PointLayer()
    .source(data, {
      parser: { type: 'json', x: 'lng', y: 'lat' },
    })
    .shape('circle')
    .size(10)
    .color('#5B8FF9');

  scene.addLayer(pointLayer);
});
```

## Core Workflow

L7 的典型开发流程：

```
1. 场景初始化 (Scene) → 2. 数据准备 → 3. 创建图层 (Layer) → 4. 添加交互 → 5. 优化性能
```

## 📚 Reference Documentation

详细文档按领域组织，根据需要加载：

### 基础功能 (references/core/)

- **[scene.md](references/core/scene.md)** - Scene 初始化、生命周期、方法
- **[map-types.md](references/core/map-types.md)** - GaodeMap、Mapbox、Maplibre、Map 的配置

### 数据处理 (references/data/)

- **[geojson.md](references/data/geojson.md)** - GeoJSON 格式、解析、转换
- **[csv.md](references/data/csv.md)** - CSV 数据加载和处理
- **[json.md](references/data/json.md)** - JSON 数据、OD 数据、路径数据
- **[parser.md](references/data/parser.md)** - Parser 配置、Transform 转换

### 图层类型 (references/layers/)

- **[point.md](references/layers/point.md)** - 点图层：散点、气泡、3D 柱状
- **[line.md](references/layers/line.md)** - 线图层：路径、弧线、流线
- **[polygon.md](references/layers/polygon.md)** - 面图层：填充、3D 建筑、choropleth
- **[heatmap.md](references/layers/heatmap.md)** - 热力图：密度分布、网格热力
- **[image.md](references/layers/image.md)** - 图片图层：卫星图、航拍图、平面图
- **[raster.md](references/layers/raster.md)** - 栅格瓦片图层：XYZ/TMS 瓦片服务
- **[other-layers.md](references/layers/other-layers.md)** - 其他图层类型

### 视觉映射 (references/visual/)

- **[mapping.md](references/visual/mapping.md)** - 颜色、大小、形状映射
- **[style.md](references/visual/style.md)** - 透明度、描边、纹理等样式

### 交互组件 (references/interaction/)

- **[events.md](references/interaction/events.md)** - 点击、悬停、选中事件
- **[components.md](references/interaction/components.md)** - Popup、Marker、Controls、Legend

### 动画效果 (references/animation/)

- **[layer-animation.md](references/animation/layer-animation.md)** - 图层动画、轨迹动画

### 性能优化 (references/performance/)

- **[optimization.md](references/performance/optimization.md)** - 数据过滤、聚合、图层管理

## 使用指南

### 按用户需求选择文档

| 用户请求示例   | 加载的文档                       |
| -------------- | -------------------------------- |
| "创建一个地图" | core/scene.md                    |
| "显示点位数据" | layers/point.md, data/geojson.md |
| "绘制路径"     | layers/line.md                   |
| "热力图"       | layers/heatmap.md                |
| "添加点击事件" | interaction/events.md            |
| "显示弹窗"     | interaction/components.md        |

### 技能组合模式

复杂需求需要组合多个技能：

```
城市可视化 = scene + polygon + point + events + popup
轨迹动画 = scene + line + animation
热力分析 = scene + heatmap + data/json
```

### 依赖检查

使用 `metadata/skill-dependency.json` 检查技能依赖关系：

```json
{
  "point-layer": {
    "requires": ["scene-initialization"],
    "optional": ["source-geojson", "color-mapping"],
    "nextSteps": ["event-handling", "popup"]
  }
}
```

## 版本信息

- **当前版本**: L7 2.x
- **浏览器支持**: Chrome ≥60, Firefox ≥60, Safari ≥12
- **坐标系**: WGS84 (地理坐标) / Plane coordinates (独立 Map)
- **底图**: 高德地图、Mapbox、Maplibre、L7 Map (独立)

## 最佳实践

1. **场景初始化优先**: 始终从创建 Scene 开始
2. **数据格式规范**: 优先使用 GeoJSON 标准格式
3. **性能优先**: 大数据量时使用数据过滤和聚合
4. **渐进增强**: 先实现基础功能，再添加交互和动画
5. **错误处理**: 添加事件监听和数据验证

## 快速参考

### 常用导入

```javascript
// 核心
import { Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

// 图层
import { PointLayer, LineLayer, PolygonLayer, HeatmapLayer } from '@antv/l7';

// 组件
import { Popup, Marker } from '@antv/l7';
```

### 地图样式选项

- `'light'` - 浅色风格
- `'dark'` - 深色风格
- `'normal'` - 标准风格
- `'satellite'` - 卫星影像
- `'blank'` - 空白底图（独立 Map）

### 坐标格式

```javascript
[经度, 纬度]; // [120.19, 30.26]
// 经度: -180 ~ 180
// 纬度: -90 ~ 90
```

## 元数据

- **skill-dependency.json** - 技能依赖关系图
- **skill-tags.json** - 中英文标签检索
- **version-compatibility.json** - 版本兼容性信息

查看 [index.md](index.md) 获取完整技能列表和导航。
