# L7 Skill Index

> 从这里开始使用 L7 技能库 - 按需加载详细文档

## 🚀 Quick Start

**最简示例** - 查看 [SKILL.md](SKILL.md)

## 📚 按领域查找文档

### 核心功能 (Core)

- **[scene.md](references/core/scene.md)** - Scene 初始化、生命周期、方法
- **[map-types.md](references/core/map-types.md)** - 地图类型配置

### 数据处理 (Data)

- **[geojson.md](references/data/geojson.md)** - GeoJSON 格式和解析
- **[csv.md](references/data/csv.md)** - CSV 数据加载
- **[json.md](references/data/json.md)** - JSON 数据源
- **[parser.md](references/data/parser.md)** - 数据解析配置

### 图层类型 (Layers)

- **[point.md](references/layers/point.md)** - 点图层
- **[line.md](references/layers/line.md)** - 线图层
- **[polygon.md](references/layers/polygon.md)** - 面图层
- **[heatmap.md](references/layers/heatmap.md)** - 热力图
- **[image.md](references/layers/image.md)** - 图片图层
- **[raster.md](references/layers/raster.md)** - 栅格瓦片图层
- **[other-layers.md](references/layers/other-layers.md)** - 其他图层

### 视觉映射 (Visual)

- **[mapping.md](references/visual/mapping.md)** - 颜色、大小、形状映射
- **[style.md](references/visual/style.md)** - 样式配置

### 交互组件 (Interaction)

- **[events.md](references/interaction/events.md)** - 事件处理
- **[popup.md](references/interaction/popup.md)** - Popup 弹窗
- **[components.md](references/interaction/components.md)** - Marker、Controls、Legend

### 动画效果 (Animation)

- **[layer-animation.md](references/animation/layer-animation.md)** - 图层动画、轨迹动画

### 性能优化 (Performance)

- **[optimization.md](references/performance/optimization.md)** - 数据过滤、聚合、图层管理
  🎯 按场景查找

| 用户需求       | 推荐文档                                                                          | 难度   |
| -------------- | --------------------------------------------------------------------------------- | ------ | --- |
| "创建地图"     | [scene.md](references/core/scene.md)                                              | ⭐     |
| "显示点位"     | [point.md](references/layers/point.md) + [geojson.md](references/data/geojson.md) | ⭐     |
| "绘制路径"     | [line.md](references/layers/line.md)                                              | ⭐     |
| "区域填充"     | [polygon.md](references/layers/polygon.md)                                        | ⭐     |
| "热力图"       | [heatmap.md](references/layers/heatmap.md)                                        | ⭐⭐   |
| "添加点击事件" | [events.md](references/interaction/events.md)                                     | ⭐⭐   |
| "显示弹窗"     | [popup.md](references/interaction/popup.md)                                       | ⭐⭐   |
| "轨迹动画"     | [layer-animation.md](references/animation/layer-animation.md)                     | ⭐⭐   |
| "性能优化"     | [optimization.md](references/performance/optimization.md)                         | ⭐⭐⭐ | )   |

2. [事件交互](05-interaction/event-handling.md)
3. [弹窗组件](06-components/popup.md)
4. [图层动画](07-animation/layer-animation.md)
5. [热力图](03-layers/heatmap-layer.md)

#### ⭐⭐⭐ 高级技能（需要深入理解）

1. [性能优化](10-performance/data-filtering.md)
2. [� 技能组合模式

复杂需求通常需要组合多个技能：

```
城市可视化 = scene + polygon + point + events + popup + controls
轨迹动画 = scene + line + animation + events
热力分析 = scene + heatmap + data processing + filters
OD流向 = scene + arc line + animation + data parser
```

## 📖 使用指南

### 对于 AI 模型

1. **先读 SKILL.md** - 获取概览和快速入门
2. **按需加载 references** - 根据用户需求选择具体文档
3. **检查依赖** - 使用 `metadata/skill-dependency.json`
4. **组合代码** - 从多个 references 中提取代码组合

### 文档加载策略

| 用户请求类型   | 加载的文档                         |
| -------------- | ---------------------------------- |
| "怎么创建地图" | SKILL.md (Quick Start)             |
| "显示点位数据" | references/layers/point.md         |
| "GeoJSON 格式" | references/data/geojson.md         |
| "所有图层类型" | references/layers/\*.md (多个文件) |

## 🔍 使用指南

### 对于 AI 模型

1. **意图识别**: 根据用户需求关键词检索相关技能
2. **依赖检查**: 查看技能文件中的 dependencies 字段
3. **代码组合**: 组合多个技能的代码示例

### 技能文件结构

每个技能文件包含：

- ✅ 技能描述和使用场景
- ✅ 输入输出参数
- ✅ 完整代码示例
- ✅ 数据格式要求
- ✅ 常见问题
- ✅ 相关技能链接

## 📖 元数据

- [skill-dependency.json](metadata/skill-dependency.json) - 技能依赖关系
- [skill-tags.json](metadata/skill-tags.json) - 技能标签
- [version-compatibility.json](metadata/version-compatibility.json) - 版本兼容性

## 🚀 快速开始

```javascript
// 最简单的示例：在地图上显示点
import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [120, 30],
    zoom: 10
  })
});

scene.on('loaded', () => {
  const pointLayer = new PointLayer()
    .source(data)
    .shape('circle')
    .size(5)
    .color('#5B8FF9');
  scene.addLayer(pointLayer);
})# Reference 文件特点

每个 reference 文件包含：
- ✅ 详细的 API 文档和参数说明
- ✅ 多个实际场景的代码示例
- ✅ 常见问题和解决方案
- ✅ 性能优化建议
- ✅ 相关文档的交叉引用� 元数据文件

- **[skill-dependency.json](metadata/skill-dependency.json)** - 技能依赖关系图
- **[skill-tags.json](metadata/skill-tags.json)** - 中英文标签检索
- **[version-compatibility.json](metadata/version-compatibility.json)** - 版本兼容性

## 🔗 相关资源

- **主文档**: [SKILL.md](SKILL.md) - 从这里开始
- **旧版结构**: `01-core/`, `02-data/` 等目录已废弃，请使用 `references/`
```
