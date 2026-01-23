# Performance Optimization Guide

L7 性能优化完整指南。

## 数据优化

### 1. 数据过滤

```javascript
// 在 source 时过滤
layer.source(data, {
  parser: { type: 'json', x: 'lng', y: 'lat' },
  transforms: [
    {
      type: 'filter',
      callback: (item) => {
        // 只显示值大于阈值的数据
        return item.value > 100;
      },
    },
  ],
});

// 按视窗范围过滤
scene.on('mapmove', () => {
  const bounds = scene.getBounds();
  const filteredData = data.filter(
    (item) =>
      item.lng >= bounds[0][0] &&
      item.lng <= bounds[1][0] &&
      item.lat >= bounds[0][1] &&
      item.lat <= bounds[1][1],
  );
  layer.setData(filteredData);
});
```

### 2. 数据聚合

```javascript
// 使用聚合图层
import { HeatmapLayer } from '@antv/l7';

// 替代大量点的 PointLayer
const heatmap = new HeatmapLayer()
  .source(massiveData, {
    parser: { type: 'json', x: 'lng', y: 'lat' },
    transforms: [
      {
        type: 'hexagon', // 六边形聚合
        size: 500, // 聚合大小
        field: 'value',
        method: 'sum',
      },
    ],
  })
  .size('sum', [10, 50])
  .color('sum', ['#ffffb2', '#fd8d3c', '#f03b20', '#bd0026']);

scene.addLayer(heatmap);
```

### 3. 数据抽稀

```javascript
// 按比例抽样
const sampledData = data.filter((_, index) => index % 10 === 0);

// 按值抽样（只显示重要数据）
const sampledData = data.sort((a, b) => b.value - a.value).slice(0, 1000); // 只显示前 1000 个重要点
```

### 4. 简化几何形状

```javascript
import * as turf from '@turf/turf';

// 简化多边形
const simplified = turf.simplify(polygonData, {
  tolerance: 0.01, // 简化容差
  highQuality: false, // 快速简化
});

layer.source(simplified, {
  parser: { type: 'geojson' },
});
```

## 图层管理

### 1. 按需显示图层

```javascript
// 根据缩放级别显示不同细节
scene.on('zoom', () => {
  const zoom = scene.getZoom();

  if (zoom < 10) {
    // 低缩放：显示汇总数据
    provinceLayer.show();
    cityLayer.hide();
    districtLayer.hide();
  } else if (zoom < 13) {
    // 中缩放：显示城市数据
    provinceLayer.hide();
    cityLayer.show();
    districtLayer.hide();
  } else {
    // 高缩放：显示详细数据
    provinceLayer.hide();
    cityLayer.hide();
    districtLayer.show();
  }
});
```

### 2. 合并图层

```javascript
// ❌ 低效：多个小图层
categories.forEach((cat) => {
  const layer = new PointLayer().source(data.filter((d) => d.category === cat));
  scene.addLayer(layer);
});

// ✅ 高效：合并为一个图层
const layer = new PointLayer().source(data).color('category', categoryColors);

scene.addLayer(layer);
```

### 3. 移除不需要的图层

```javascript
// 移除图层释放资源
scene.removeLayer(layer);

// 清空所有图层
scene.removeAllLayer();
```

## 渲染优化

### 1. 降低渲染频率

```javascript
// 使用防抖
import { debounce } from 'lodash';

const updateLayer = debounce(() => {
  layer.setData(newData);
}, 300);

// 在快速交互时使用
inputElement.addEventListener('input', updateLayer);
```

### 2. 关闭不必要的特性

```javascript
layer.source(data).shape('circle').size(5).color('#5B8FF9').style({
  opacity: 1.0, // 完全不透明，避免混合计算
  blend: 'normal', // 普通混合模式
});
```

### 3. 使用 GPU 加速

```javascript
// L7 默认使用 WebGL，确保使用 GPU 友好的配置

// ✅ 固定大小（GPU 友好）
layer.size(5);

// ⚠️ 动态大小（需要更多计算）
layer.size('value', [5, 20]);
```

## 瓦片服务

对于海量数据，使用瓦片服务：

```javascript
import { PointLayer } from '@antv/l7';

// 矢量瓦片
const tileLayer = new PointLayer()
  .source('https://tiles.example.com/{z}/{x}/{y}.mvt', {
    parser: {
      type: 'mvt',
      tileSize: 256,
      maxZoom: 14,
    },
  })
  .shape('circle')
  .size(5)
  .color('#5B8FF9');

scene.addLayer(tileLayer);
```

## 内存管理

### 1. 及时清理资源

```javascript
// 移除图层前清理事件监听
layer.off('click');
layer.off('mousemove');

// 移除图层
scene.removeLayer(layer);

// 销毁场景
scene.destroy();
```

### 2. 避免内存泄漏

```javascript
// ❌ 可能导致内存泄漏
scene.on('mapmove', () => {
  const newLayer = new PointLayer(); // 每次都创建新图层
  scene.addLayer(newLayer);
});

// ✅ 复用图层
const layer = new PointLayer();
scene.addLayer(layer);

scene.on('mapmove', () => {
  layer.setData(newData); // 更新数据而不是创建新图层
});
```

### 3. 分批加载数据

```javascript
// 分批加载大数据
async function loadDataInBatches(dataUrl, batchSize = 1000) {
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(`${dataUrl}?offset=${offset}&limit=${batchSize}`);
    const batch = await response.json();

    if (batch.length === 0) {
      hasMore = false;
    } else {
      // 添加到图层
      const currentData = layer.getSource().data;
      layer.setData([...currentData, ...batch]);

      offset += batchSize;
    }
  }
}
```

## 性能监控

### 1. FPS 监控

```javascript
let frameCount = 0;
let lastTime = Date.now();

scene.on('afterrender', () => {
  frameCount++;
  const now = Date.now();

  if (now - lastTime >= 1000) {
    const fps = frameCount;
    console.log('FPS:', fps);

    frameCount = 0;
    lastTime = now;
  }
});
```

### 2. 渲染时间

```javascript
console.time('render');

scene.on('loaded', () => {
  layer.source(data).shape('circle').size(5).color('#5B8FF9');

  scene.addLayer(layer);

  console.timeEnd('render');
});
```

### 3. 数据量统计

```javascript
// 图层数量
console.log('图层数:', scene.getLayers().length);

// 每个图层的数据量
scene.getLayers().forEach((layer) => {
  const source = layer.getSource();
  console.log(layer.name, '数据量:', source.data.dataArray.length);
});
```

## 最佳实践

### 1. 数据量建议

| 数据量       | 推荐方案        |
| ------------ | --------------- |
| < 1万        | 直接渲染        |
| 1万 - 10万   | 数据过滤 + 抽稀 |
| 10万 - 100万 | 聚合 + 瓦片     |
| > 100万      | 瓦片服务        |

### 2. 图层数量建议

- 尽量控制在 **10 个图层以内**
- 超过 20 个图层考虑合并或按需加载
- 使用图层分组管理

### 3. 事件监听优化

```javascript
// ❌ 为每个要素绑定事件
data.forEach((item) => {
  // 创建单独图层并绑定事件
});

// ✅ 在图层级别绑定事件
layer.on('click', (e) => {
  const feature = e.feature;
  // 处理点击
});
```

### 4. 样式更新优化

```javascript
// ❌ 频繁更新样式
slider.addEventListener('input', (e) => {
  layer.size(e.target.value);
  scene.render();
});

// ✅ 防抖处理
const updateSize = debounce((value) => {
  layer.size(value);
}, 100);

slider.addEventListener('input', (e) => {
  updateSize(e.target.value);
});
```

## 性能检查清单

- [ ] 数据量是否合理？考虑过滤或聚合
- [ ] 是否有不必要的图层？考虑合并
- [ ] 是否按需显示图层？根据缩放级别控制
- [ ] 是否有内存泄漏？检查事件监听和图层清理
- [ ] 样式更新是否频繁？使用防抖或节流
- [ ] 是否使用了瓦片服务？对于海量数据考虑瓦片
- [ ] 几何形状是否过于复杂？考虑简化
- [ ] 监控 FPS 是否正常？目标 ≥ 30 FPS

## 相关文档

- [data/parser.md](../data/parser.md) - 数据过滤和转换
- [layers/heatmap.md](../layers/heatmap.md) - 热力图聚合
