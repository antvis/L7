---
skill_id: layer-common-api
skill_name: 图层通用方法和事件
category: layers
difficulty: beginner
tags:
  [
    layer-api,
    layer-methods,
    layer-events,
    layer-common,
    show,
    hide,
    visible,
    setIndex,
    fitBounds,
    zoom,
    click,
    mousemove,
    mouseout,
    hover,
    contextmenu,
    source,
    scale,
    filter,
    event,
    active,
    select,
    通用方法,
    图层控制,
    鼠标事件,
    数据方法,
  ]
type: reference
dependencies: [scene-initialization]
applies_to: [point, line, polygon, heatmap, image, raster, tile-vector]
related_skills: [point, line, polygon, heatmap, events]
version: 2.x
---

# 图层通用方法和事件

## 技能描述

掌握 L7 所有图层通用的方法和事件。本文档是参考手册，详细说明了 PointLayer、LineLayer、PolygonLayer 等所有图层类型共享的核心 API，包括显示控制、数据管理、事件监听等能力。

> 💡 **使用提示**：这是通用 API 参考文档。使用具体图层时，请查看对应的图层文档（如 [点图层](./point.md)、[线图层](./line.md)），它们会介绍图层特有功能并引用本文档的通用能力。

## 何时使用

- ✅ 需要控制图层的显示和隐藏
- ✅ 需要调整图层的绘制顺序
- ✅ 需要监听图层的鼠标事件
- ✅ 需要动态更新图层数据或样式
- ✅ 需要获取图层的状态和属性
- ✅ 需要聚合数据或使用数据转换

## 前置条件

- 已完成[场景初始化](../core/scene.md)
- 了解基本的图层类型（[点图层](./point.md)、[线图层](./line.md)等）

## 核心概念

### 图层语法

L7 图层遵循图形语法，提供链式调用API：

```javascript
const layer = new PointLayer(options)
  .source(data, config) // 设置数据源
  .scale(field, scaleConfig) // 设置数据映射
  .filter(callback) // 数据过滤
  .shape(field, values) // 设置形状
  .color(field, colors) // 设置颜色
  .size(field, sizes) // 设置大小
  .texture(field, textures) // 设置纹理
  .animate(options) // 设置动画
  .active(options) // 设置高亮
  .select(options) // 设置选中
  .style(options); // 设置样式

scene.addLayer(layer);
```

## 图层控制方法

### show(): void

显示图层。

```javascript
layer.show();
```

### hide(): void

隐藏图层。

```javascript
layer.hide();
```

**示例：切换图层显示**

```javascript
let isVisible = true;

function toggleLayer() {
  if (isVisible) {
    layer.hide();
  } else {
    layer.show();
  }
  isVisible = !isVisible;
}

// 按钮点击事件
document.getElementById('toggle-btn').addEventListener('click', toggleLayer);
```

### isVisible(): boolean

检查图层是否可见。

```javascript
if (layer.isVisible()) {
  console.log('图层可见');
} else {
  console.log('图层隐藏');
}
```

### setIndex(zIndex: number): void

设置图层绘制顺序，数值越大越在上层。

```javascript
// 设置图层在最上层
layer.setIndex(999);

// 设置图层在底层
layer.setIndex(1);
```

**示例：图层分层管理**

```javascript
// 底层：区域底色
polygonLayer.setIndex(1);

// 中层：道路
lineLayer.setIndex(2);

// 顶层：POI 标注
pointLayer.setIndex(3);
```

### fitBounds(fitBoundsOptions?: IFitBoundsOptions): void

缩放地图至图层数据范围。

```javascript
// 基础用法
layer.fitBounds();

// 带参数
layer.fitBounds({
  padding: 50, // 边距（像素）
});
```

**示例：加载数据后自动适配范围**

```javascript
const layer = new PointLayer()
  .source(data, { parser: { type: 'json', x: 'lng', y: 'lat' } })
  .shape('circle')
  .size(10)
  .color('#5B8FF9');

scene.addLayer(layer);

scene.on('loaded', () => {
  // 自动缩放到数据范围
  layer.fitBounds();
});
```

### setMinZoom(zoom: number): void

设置图层最小缩放等级（小于此等级时不显示）。

```javascript
// 地图缩放级别小于 10 时不显示该图层
layer.setMinZoom(10);
```

### setMaxZoom(zoom: number): void

设置图层最大缩放等级（大于此等级时不显示）。

```javascript
// 地图缩放级别大于 18 时不显示该图层
layer.setMaxZoom(18);
```

**示例：根据缩放级别切换图层**

```javascript
// 小级别显示聚合数据
clusterLayer.setMaxZoom(12);

// 大级别显示详细数据
detailLayer.setMinZoom(12);

scene.on('zoomchange', () => {
  const zoom = scene.getZoom();
  console.log(`当前缩放级别: ${zoom}`);
});
```

## 数据方法

### source(data, config): Layer

设置图层数据源和解析配置。

```javascript
layer.source(data, {
  parser: {
    type: 'json', // 数据类型: json | geojson | csv
    x: 'lng', // 经度字段
    y: 'lat', // 纬度字段
  },
  transforms: [
    // 数据转换（可选）
    {
      type: 'map',
      callback: (item) => {
        item.value = item.value * 100;
        return item;
      },
    },
  ],
});
```

**支持的数据格式**：

- GeoJSON - [详见文档](../data/source-geojson.md)
- JSON - [详见文档](../data/source-json.md)
- CSV - [详见文档](../data/source-csv.md)

### scale(field, scaleOptions): Layer

设置数据字段的映射规则。

```javascript
layer.scale('value', {
  type: 'linear', // scale 类型
  domain: [0, 100], // 数据值域
});
```

**Scale 类型**：

| 类型      | 适用数据 | 说明             |
| --------- | -------- | ---------------- |
| linear    | 连续数值 | 线性映射         |
| log       | 连续数值 | 对数映射         |
| pow       | 连续数值 | 幂次映射         |
| quantize  | 连续数值 | 等间距分类       |
| quantile  | 连续数值 | 分位数分类       |
| threshold | 连续数值 | 自定义阈值分类   |
| diverging | 连续数值 | 发散分类（双色） |
| cat       | 分类数据 | 类别映射         |
| identity  | 任意     | 值即映射结果     |

**示例**：

```javascript
// 线性映射
layer.scale('population', {
  type: 'linear',
  domain: [0, 10000000],
});

// 分类映射
layer.scale('category', {
  type: 'cat',
  domain: ['A', 'B', 'C'],
});

// 阈值分类
layer.scale('aqi', {
  type: 'threshold',
  domain: [50, 100, 150, 200, 300], // 5个阈值，需要6个颜色
});
```

详细说明参见 [视觉映射](../visual/mapping.md)。

### filter(callback): Layer

数据过滤，返回 true 的数据会被显示。

```javascript
// 只显示值大于 100 的数据
layer.filter((feature) => {
  return feature.value > 100;
});

// 根据类型过滤
layer.filter((feature) => {
  return ['A', 'B'].includes(feature.type);
});
```

### getScale(scaleName: string): IScale

获取指定字段的 scale 实例。

```javascript
const valueScale = layer.getScale('value');
console.log('值域:', valueScale.domain);
console.log('映射范围:', valueScale.range);
```

## 数据聚合方法

### cluster 聚合配置

使用聚合功能时，可通过以下方法获取聚合数据：

#### getClusters(zoom: number): IFeatureCollection

获取指定缩放等级的聚合数据。

```javascript
const source = layer.getSource();
const clusters = source.getClusters(10); // 获取 zoom=10 的聚合数据
console.log('聚合节点数量:', clusters.features.length);
```

#### getClustersLeaves(id: string): IFeatureCollection

获取聚合节点包含的原始数据。

```javascript
const source = layer.getSource();

layer.on('click', (e) => {
  if (e.feature.cluster) {
    // 获取聚合节点的原始数据
    const leaves = source.getClustersLeaves(e.feature.cluster_id);
    console.log('该聚合包含数据:', leaves);
  }
});
```

## 鼠标事件

所有图层支持的鼠标事件：

### 基础鼠标事件

```javascript
// 点击事件
layer.on('click', (e) => {
  console.log('点击位置:', e.lngLat);
  console.log('点击要素:', e.feature);
});

// 双击事件
layer.on('dblclick', (e) => {
  console.log('双击要素:', e.feature);
});

// 鼠标移动
layer.on('mousemove', (e) => {
  // 高频事件，注意性能
});

// 鼠标移出
layer.on('mouseout', (e) => {
  console.log('鼠标移出');
});

// 鼠标按下
layer.on('mousedown', (e) => {
  console.log('鼠标按下');
});

// 鼠标抬起
layer.on('mouseup', (e) => {
  console.log('鼠标抬起');
});

// 右键菜单
layer.on('contextmenu', (e) => {
  e.preventDefault(); // 阻止默认菜单
  console.log('右键点击:', e.lngLat);
});
```

### 未拾取事件（Unpick Events）

当鼠标操作未选中图层要素时触发：

```javascript
// 点击图层外
layer.on('unclick', (e) => {
  console.log('点击了图层外的区域');
});

// 图层外移动
layer.on('unmousemove', (e) => {
  // 鼠标在图层外移动
});

// 图层外鼠标抬起
layer.on('unmouseup', (e) => {});

// 图层外鼠标按下
layer.on('unmousedown', (e) => {});

// 图层外右键
layer.on('uncontextmenu', (e) => {});

// 所有未拾取事件
layer.on('unpick', (e) => {
  console.log('所有图层外的操作');
});
```

### 移动端事件

```javascript
// 触摸开始
layer.on('touchstart', (e) => {
  console.log('触摸开始');
});

// 触摸结束
layer.on('touchend', (e) => {
  console.log('触摸结束');
});
```

### 事件参数

所有鼠标事件回调参数包含：

```typescript
interface ILayerMouseEvent {
  x: number; // 鼠标在地图位置 x 坐标
  y: number; // 鼠标在地图位置 y 坐标
  type: string; // 事件类型
  lngLat: ILngLat; // 经纬度 { lng, lat }
  feature: any; // 选中的要素数据
  featureId: number | null; // 要素 ID
}
```

## 实际应用场景

### 1. 图层高亮和弹窗

```javascript
const layer = new PointLayer()
  .source(data, { parser: { type: 'json', x: 'lng', y: 'lat' } })
  .shape('circle')
  .size(10)
  .color('#5B8FF9')
  .active(true); // 开启高亮

// 鼠标移入显示信息
layer.on('mousemove', (e) => {
  const { feature } = e;
  const popup = new Popup({
    offsets: [0, 20],
  }).setLnglat(e.lngLat).setHTML(`
      <div>
        <h3>${feature.name}</h3>
        <p>值: ${feature.value}</p>
      </div>
    `);
  scene.addPopup(popup);
});

// 鼠标移出关闭弹窗
layer.on('mouseout', () => {
  scene.removeAllPopup();
});
```

### 2. 点击查看详情

```javascript
layer.on('click', (e) => {
  const { feature } = e;

  // 显示详情面板
  showDetailPanel({
    name: feature.name,
    address: feature.address,
    phone: feature.phone,
  });

  // 高亮选中的点
  layer.select(true);
});
```

### 3. 根据缩放级别切换图层

```javascript
// 创建两个图层
const clusterLayer = new PointLayer({ name: 'cluster' })
  .source(clusterData)
  .shape('circle')
  .size('count', [20, 50])
  .color('count', ['#ffffcc', '#800026'])
  .setMaxZoom(12); // 小于 12 级显示

const detailLayer = new PointLayer({ name: 'detail' })
  .source(detailData)
  .shape('circle')
  .size(8)
  .color('#5B8FF9')
  .setMinZoom(12) // 大于 12 级显示
  .hide(); // 初始隐藏

scene.addLayer(clusterLayer);
scene.addLayer(detailLayer);

// 监听缩放变化
scene.on('zoomchange', () => {
  const zoom = scene.getZoom();
  if (zoom >= 12) {
    clusterLayer.hide();
    detailLayer.show();
  } else {
    clusterLayer.show();
    detailLayer.hide();
  }
});
```

### 4. 数据过滤和更新

```javascript
const layer = new PointLayer().source(data).shape('circle').size(10).color('category', colorMap);

// 动态过滤数据
function filterByCategory(categories) {
  layer.filter((feature) => {
    return categories.includes(feature.category);
  });
  scene.render(); // 触发重绘
}

// 过滤按钮
document.getElementById('filter-A').addEventListener('click', () => {
  filterByCategory(['A', 'B']);
});
```

### 5. 聚合数据展示

```javascript
const layer = new PointLayer()
  .source(data, {
    parser: { type: 'json', x: 'lng', y: 'lat' },
    cluster: true,
    clusterOption: {
      radius: 40,
      minZoom: 0,
      maxZoom: 16,
    },
  })
  .shape('circle')
  .size('point_count', [20, 60])
  .color('point_count', ['#ffffcc', '#800026']);

// 点击聚合节点查看包含的数据
layer.on('click', (e) => {
  const source = layer.getSource();

  if (e.feature.cluster) {
    // 获取聚合节点的原始数据
    const leaves = source.getClustersLeaves(e.feature.cluster_id);
    console.log('包含的数据:', leaves);

    // 显示列表
    showDataList(leaves);
  }
});
```

## 常见问题

### Q: 如何获取图层对象？

A: 通过 Scene 的方法获取：

```javascript
// 通过 ID
const layer = scene.getLayer('layer-id');

// 通过名称
const layer = scene.getLayerByName('my-layer');

// 获取所有图层
const layers = scene.getLayers();
```

### Q: 图层顺序如何控制？

A: 使用 `setIndex()` 方法，数值越大越在上层：

```javascript
bottomLayer.setIndex(1);
middleLayer.setIndex(2);
topLayer.setIndex(3);
```

### Q: 如何监听图层加载完成？

A: 图层添加到 Scene 后会自动加载，监听 Scene 的 `loaded` 事件：

```javascript
scene.on('loaded', () => {
  console.log('所有图层加载完成');
});
```

### Q: 鼠标事件中如何获取原始数据？

A: 通过事件参数的 `feature` 属性：

```javascript
layer.on('click', (e) => {
  console.log('原始数据:', e.feature.properties);
  console.log('坐标:', e.feature.geometry.coordinates);
});
```

### Q: 如何移除事件监听？

A: 使用 `off()` 方法：

```javascript
const handleClick = (e) => {
  console.log('点击:', e);
};

// 绑定事件
layer.on('click', handleClick);

// 移除事件
layer.off('click', handleClick);
```

### Q: filter 过滤后如何重置？

A: 传入返回 true 的函数即可：

```javascript
// 重置过滤（显示所有数据）
layer.filter(() => true);
scene.render();
```

## 注意事项

⚠️ **事件顺序**：先添加图层到 Scene，再绑定事件

⚠️ **性能优化**：`mousemove` 是高频事件，避免在回调中执行复杂计算

⚠️ **图层销毁**：使用 `scene.removeLayer(layer)` 会自动销毁图层并移除事件

⚠️ **坐标系统**：确保数据坐标系统与地图匹配

⚠️ **Scale 配置**：scale 要在 color/size 之前调用

## 相关技能

- [点图层](./point.md)
- [线图层](./line.md)
- [面图层](./polygon.md)
- [视觉映射](../visual/mapping.md)
- [事件处理](../interaction/events.md)

## 在线示例

查看更多示例：[L7 官方示例](https://l7.antv.antgroup.com/examples)
