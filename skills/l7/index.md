# L7 技能索引（Skill Index）

> 从这里开始，快速查找和组合 L7 技能文档

## 📚 按领域查找

### 1. 核心功能 Core

- [scene.md](references/core/scene.md) - Scene 初始化、生命周期、方法
- [map-types.md](references/core/map-types.md) - 地图类型配置

### 2. 数据处理 Data

- [geojson.md](references/data/geojson.md) - GeoJSON 格式和解析
- [csv.md](references/data/csv.md) - CSV 数据加载
- [json.md](references/data/json.md) - JSON 数据源
- [parser.md](references/data/parser.md) - 数据解析配置

### 3. 图层类型 Layers

- [point.md](references/layers/point.md) - 点图层
- [line.md](references/layers/line.md) - 线图层
- [polygon.md](references/layers/polygon.md) - 面图层
- [heatmap.md](references/layers/heatmap.md) - 热力图
- [image.md](references/layers/image.md) - 图片图层
- [raster.md](references/layers/raster.md) - 栅格瓦片图层
- [other-layers.md](references/layers/other-layers.md) - 其他图层

### 4. 视觉映射 Visual

- [mapping.md](references/visual/mapping.md) - 颜色、大小、形状映射
- [style.md](references/visual/style.md) - 样式配置

### 5. 交互组件 Interaction

- [events.md](references/interaction/events.md) - 事件处理
- [popup.md](references/interaction/popup.md) - Popup 弹窗
- [components.md](references/interaction/components.md) - Marker、Controls、Legend

### 6. 动画效果 Animation

- [layer-animation.md](references/animation/layer-animation.md) - 图层动画、轨迹动画

### 7. 性能优化 Performance

- [optimization.md](references/performance/optimization.md) - 数据过滤、聚合、图层管理

### 🎯 按场景查找

| 用户需求 | 推荐文档                                                                          | 难度   |
| -------- | --------------------------------------------------------------------------------- | ------ |
| 创建地图 | [scene.md](references/core/scene.md)                                              | ⭐     |
| 显示点位 | [point.md](references/layers/point.md) + [geojson.md](references/data/geojson.md) | ⭐     |
| 绘制路径 | [line.md](references/layers/line.md)                                              | ⭐     |
| 区域填充 | [polygon.md](references/layers/polygon.md)                                        | ⭐     |
| 热力图   | [heatmap.md](references/layers/heatmap.md)                                        | ⭐⭐   |
| 点击事件 | [events.md](references/interaction/events.md)                                     | ⭐⭐   |
| 显示弹窗 | [popup.md](references/interaction/popup.md)                                       | ⭐⭐   |
| 轨迹动画 | [layer-animation.md](references/animation/layer-animation.md)                     | ⭐⭐   |
| 性能优化 | [optimization.md](references/performance/optimization.md)                         | ⭐⭐⭐ |

---

## 📖 相关资源

- **主文档**：[SKILL.md](SKILL.md) - 快速入门与概览
- **依赖关系**：[skill-dependency.json](metadata/skill-dependency.json)
- **标签检索**：[skill-tags.json](metadata/skill-tags.json)
- **版本兼容性**：[version-compatibility.json](metadata/version-compatibility.json)
