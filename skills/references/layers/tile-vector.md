---
skill_id: tile-vector
skill_name: 矢量瓦片图层
category: layers
difficulty: advanced
tags: [vector-tile, mvt, big-data, tile-layer]
dependencies: [layer-common-api, source-mvt]
version: 2.x
---

# 矢量瓦片图层

## 技能描述

掌握 L7 矢量瓦片图层的使用，通过瓦片化加载实现海量地理数据的高效渲染。矢量瓦片将大范围的矢量数据切分成小块，按需加载和渲染，显著降低数据传输量和渲染压力。

## 何时使用

- ✅ 需要渲染超大数据量的矢量数据（百万级以上）
- ✅ 需要支持不同缩放级别的详细程度（LOD）
- ✅ 需要减少初始加载时间，按需加载数据
- ✅ 需要在低带宽环境下流畅显示地图
- ✅ 使用 Mapbox Vector Tile (MVT) 标准的瓦片服务

## 前置条件

- 已完成[场景初始化](../core/scene.md)
- 了解[MVT 数据源](../data/source-mvt.md)
- 准备好矢量瓦片服务（MVT 格式）

## 核心概念

### 什么是矢量瓦片

矢量瓦片是将地理矢量数据按照瓦片金字塔结构切分的数据格式：

- **瓦片金字塔**：不同缩放级别（zoom）对应不同精度的数据
- **按需加载**：只加载当前视野范围内的瓦片
- **矢量格式**：保留矢量数据，可在客户端动态样式化
- **标准格式**：通常使用 MVT (Mapbox Vector Tile) 或 PBF 格式

### 矢量瓦片 vs 栅格瓦片

| 对比项     | 矢量瓦片           | 栅格瓦片         |
| ---------- | ------------------ | ---------------- |
| 数据格式   | 矢量数据（点线面） | 图片（PNG/JPG）  |
| 文件大小   | 小（通常 < 50KB）  | 较大（10-100KB） |
| 样式灵活性 | 可动态改变样式     | 样式固定         |
| 高清屏支持 | 完美支持           | 需要 @2x 图      |
| 数据映射   | 支持数据驱动样式   | 不支持           |
| 交互性     | 可点击、查询       | 不可交互         |

## 支持的图层类型

L7 矢量瓦片支持以下图层类型：

| 图层类型       | 描述         | 使用场景           |
| -------------- | ------------ | ------------------ |
| PointLayer     | 矢量点瓦片   | POI、定位点、标注  |
| LineLayer      | 矢量线瓦片   | 道路、边界、管线   |
| PolygonLayer   | 矢量面瓦片   | 行政区、建筑、地块 |
| MaskLayer      | 矢量掩模瓦片 | 配合栅格图层使用   |
| TileDebugLayer | 瓦片调试图层 | 查看瓦片加载状态   |

## 基础用法

### 1. 点图层

```javascript
import { Scene, PointLayer, Source } from '@antv/l7';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [120, 30],
    zoom: 10,
  }),
});

// 创建 MVT 数据源
const vectorSource = new Source(
  'https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf',
  {
    parser: {
      type: 'mvt',
      tileSize: 256,
      maxZoom: 14,
      extent: [-180, -85.051129, 179, 85.051129],
    },
  },
);

// 创建点图层
const pointLayer = new PointLayer({
  featureId: 'id', // 要素唯一标识字段
  sourceLayer: 'points', // MVT 数据源中的图层名称
})
  .source(vectorSource)
  .shape('circle')
  .size(8)
  .color('category', ['#5B8FF9', '#5AD8A6', '#5D7092']);

scene.on('loaded', () => {
  scene.addLayer(pointLayer);
});
```

### 2. 线图层

```javascript
import { LineLayer } from '@antv/l7';

const lineLayer = new LineLayer({
  featureId: 'id',
  sourceLayer: 'roads', // 道路图层
})
  .source(vectorSource)
  .shape('line')
  .size('type', (type) => {
    // 根据道路类型设置宽度
    const widthMap = {
      highway: 5,
      main: 3,
      secondary: 2,
      default: 1,
    };
    return widthMap[type] || widthMap.default;
  })
  .color('type', {
    highway: '#FF6B6B',
    main: '#4ECDC4',
    secondary: '#95E1D3',
    default: '#CCCCCC',
  });

scene.addLayer(lineLayer);
```

### 3. 面图层

```javascript
import { PolygonLayer } from '@antv/l7';

const polygonLayer = new PolygonLayer({
  featureId: 'adcode',
  sourceLayer: 'regions', // 行政区图层
})
  .source(vectorSource)
  .shape('fill')
  .color('population', ['#FFF5EB', '#FEE6CE', '#FDD0A2', '#FDAE6B', '#FD8D3C', '#E6550D'])
  .style({
    opacity: 0.8,
  });

scene.addLayer(polygonLayer);
```

## 配置选项

### 图层构造参数

```typescript
interface IVectorTileLayerOptions {
  featureId?: string; // 要素唯一标识字段（用于高亮和选中）
  sourceLayer: string; // MVT 数据源中的图层名称
  // ... 其他基础图层参数
}
```

### Source 配置

详见 [MVT 数据源](../data/source-mvt.md)

```javascript
const source = new Source(url, {
  parser: {
    type: 'mvt', // 固定为 'mvt'
    tileSize: 256, // 瓦片大小，默认 256
    minZoom: 0, // 最小缩放级别
    maxZoom: 14, // 最大缩放级别
    zoomOffset: 0, // 层级偏移
    extent: [
      // 数据边界
      -180, -85.051129, 179, 85.051129,
    ],
  },
});
```

## 高级用法

### 1. 数据驱动样式

矢量瓦片支持完整的数据映射能力：

```javascript
const layer = new PolygonLayer({
  sourceLayer: 'buildings',
})
  .source(vectorSource)
  .shape('fill')
  .color('height', ['#ffffcc', '#c7e9b4', '#7fcdbb', '#41b6c4', '#2c7fb8', '#253494'])
  .style({
    opacity: 0.9,
  })
  .scale('height', {
    type: 'quantile', // 分位数分类
  });
```

### 2. 多图层数据源复用

```javascript
// 创建共享数据源
const vectorSource = new Source('https://tiles.example.com/{z}/{x}/{y}.pbf', {
  parser: {
    type: 'mvt',
    maxZoom: 14,
  },
});

// 多个图层复用同一数据源
const buildingLayer = new PolygonLayer({
  sourceLayer: 'buildings',
})
  .source(vectorSource)
  .color('#5B8FF9');

const roadLayer = new LineLayer({
  sourceLayer: 'roads',
})
  .source(vectorSource)
  .color('#5AD8A6');

// 只会请求一份瓦片数据
scene.addLayer(buildingLayer);
scene.addLayer(roadLayer);
```

### 3. 配合掩模图层

矢量掩模图层常用于裁剪栅格图层：

```javascript
import { MaskLayer, RasterLayer } from '@antv/l7';

// 创建掩模图层
const maskLayer = new MaskLayer({
  sourceLayer: 'boundary',
}).source(vectorSource);

// 创建栅格图层
const rasterLayer = new RasterLayer({
  mask: true, // 启用掩模
}).source(rasterUrl, {
  parser: { type: 'rasterTile' },
});

scene.addLayer(maskLayer);
scene.addLayer(rasterLayer);
```

### 4. 瓦片调试

使用调试图层查看瓦片加载状态：

```javascript
import { TileDebugLayer } from '@antv/l7';

const debugLayer = new TileDebugLayer();
scene.addLayer(debugLayer);

// 调试图层会显示：
// - 瓦片边界
// - 瓦片坐标 (z/x/y)
// - 加载状态
```

### 5. 交互事件

矢量瓦片支持完整的交互能力：

```javascript
// 鼠标悬停高亮
layer.on('mousemove', (e) => {
  if (e.feature) {
    layer.setActive(e.feature.id);
  }
});

// 点击显示详情
layer.on('click', (e) => {
  const { feature } = e;
  const popup = new Popup().setLnglat(e.lngLat).setHTML(`
      <h4>${feature.name}</h4>
      <p>人口: ${feature.population}</p>
    `);
  scene.addPopup(popup);
});
```

> 💡 矢量瓦片图层同样支持所有通用图层方法（show/hide/setIndex 等）和事件，详见[图层通用方法和事件](./layer-common-api.md)。

````

## 实际应用场景

### 1. 全国行政区可视化

```javascript
const chinaLayer = new PolygonLayer({
  featureId: 'adcode',
  sourceLayer: 'admin_bounds',
})
  .source(
    'https://tiles.example.com/china/{z}/{x}/{y}.pbf',
    {
      parser: {
        type: 'mvt',
        maxZoom: 12,
      },
    }
  )
  .shape('fill')
  .color('gdp', [
    '#f7fcf5',
    '#c7e9c0',
    '#74c476',
    '#238b45',
    '#00441b',
  ])
  .style({
    opacity: 0.8,
  })
  .scale('gdp', {
    type: 'quantile',
  });

// 边界线图层
const boundaryLayer = new LineLayer({
  sourceLayer: 'admin_bounds',
})
  .source(chinaLayer.getSource())
  .shape('line')
  .size(1)
  .color('#333');

scene.addLayer(chinaLayer);
scene.addLayer(boundaryLayer);

// 适配到数据范围
scene.on('loaded', () => {
  chinaLayer.fitBounds();
});
````

### 2. 城市道路网络

```javascript
// 不同等级道路使用不同样式
const highwayLayer = new LineLayer({
  sourceLayer: 'roads',
  zIndex: 3,
})
  .source(vectorSource)
  .filter((feature) => feature.type === 'highway')
  .shape('line')
  .size(4)
  .color('#FF6B6B')
  .style({
    opacity: 0.9,
  });

const mainRoadLayer = new LineLayer({
  sourceLayer: 'roads',
  zIndex: 2,
})
  .source(vectorSource)
  .filter((feature) => feature.type === 'main')
  .shape('line')
  .size(2)
  .color('#4ECDC4');

const secondaryRoadLayer = new LineLayer({
  sourceLayer: 'roads',
  zIndex: 1,
})
  .source(vectorSource)
  .filter((feature) => feature.type === 'secondary')
  .shape('line')
  .size(1)
  .color('#95E1D3');

scene.addLayer(highwayLayer);
scene.addLayer(mainRoadLayer);
scene.addLayer(secondaryRoadLayer);
```

### 3. POI 密度热力

```javascript
const poiLayer = new PointLayer({
  sourceLayer: 'pois',
})
  .source(vectorSource)
  .shape('circle')
  .size('category', (type) => {
    const sizeMap = {
      restaurant: 10,
      shop: 8,
      bank: 12,
      default: 6,
    };
    return sizeMap[type] || sizeMap.default;
  })
  .color('category', {
    restaurant: '#FF6B6B',
    shop: '#4ECDC4',
    bank: '#FFD93D',
    default: '#95E1D3',
  })
  .style({
    opacity: 0.8,
  });

// 根据缩放级别控制显示
poiLayer.setMinZoom(12); // 地图缩放到 12 级以上才显示
```

### 4. 建筑 3D 效果

```javascript
const buildingLayer = new PolygonLayer({
  sourceLayer: 'buildings',
})
  .source(vectorSource)
  .shape('extrude') // 拉伸成 3D
  .size('height', (h) => h * 0.3) // 根据建筑高度拉伸
  .color('usage', {
    residential: '#5B8FF9',
    commercial: '#5AD8A6',
    industrial: '#5D7092',
  })
  .style({
    opacity: 0.9,
    pickingBuffer: 5,
  });

scene.addLayer(buildingLayer);
```

## 性能优化

### 1. 控制瓦片范围

```javascript
const source = new Source(url, {
  parser: {
    type: 'mvt',
    // 限制请求范围（中国区域）
    extent: [73.66, 3.86, 135.05, 53.55],
    // 限制最大层级（避免请求过细瓦片）
    maxZoom: 14,
  },
});
```

### 2. 合理设置缩放范围

```javascript
// 避免在小缩放级别显示过多细节
layer.setMinZoom(10);

// 避免在大缩放级别请求过多瓦片
layer.setMaxZoom(16);
```

### 3. 数据源复用

```javascript
// ✅ 推荐：多图层共享数据源
const source = new Source(url, options);
layer1.source(source);
layer2.source(source);

// ❌ 避免：重复创建数据源
layer1.source(url, options);
layer2.source(url, options); // 会重复请求
```

### 4. 按需加载图层

```javascript
// 根据缩放级别动态切换图层
scene.on('zoomchange', () => {
  const zoom = scene.getZoom();

  if (zoom < 12) {
    // 小级别：显示概览数据
    summaryLayer.show();
    detailLayer.hide();
  } else {
    // 大级别：显示详细数据
    summaryLayer.hide();
    detailLayer.show();
  }
});
```

## 常见问题

### Q: 如何指定 sourceLayer？

A: sourceLayer 是 MVT 数据源中包含的图层名称，需要查看瓦片数据结构确定。可以使用调试工具查看：

```javascript
const debugLayer = new TileDebugLayer();
scene.addLayer(debugLayer);

// 或查看网络请求的 PBF 文件内容
```

### Q: 瓦片不显示怎么办？

A: 检查以下几点：

1. URL 模板是否正确（包含 {z}/{x}/{y}）
2. sourceLayer 名称是否正确
3. extent 范围是否包含当前视野
4. maxZoom/minZoom 是否合理
5. 网络请求是否成功（查看 Network 面板）

### Q: 矢量瓦片和 GeoJSON 如何选择？

A:

| 场景          | 推荐方案 |
| ------------- | -------- |
| 数据量 < 1万  | GeoJSON  |
| 数据量 > 10万 | 矢量瓦片 |
| 需要全局分析  | GeoJSON  |
| 只需可视化    | 矢量瓦片 |
| 需要离线使用  | GeoJSON  |
| 需要按需加载  | 矢量瓦片 |

### Q: 如何自定义瓦片请求？

A: 使用 `getCustomData` 方法：

```javascript
const source = new Source(url, {
  parser: {
    type: 'mvt',
    getCustomData: (tile, callback) => {
      const { x, y, z } = tile;
      const customUrl = `https://api.example.com/tile?z=${z}&x=${x}&y=${y}&token=xxx`;

      fetch(customUrl)
        .then((res) => res.arrayBuffer())
        .then((data) => callback(null, data))
        .catch((err) => callback(err, null));
    },
  },
});
```

### Q: 如何处理不同缩放级别的数据差异？

A: 可以根据 zoom 动态调整样式：

```javascript
scene.on('zoomchange', () => {
  const zoom = scene.getZoom();

  if (zoom < 10) {
    layer.size(4); // 小缩放级别用小尺寸
  } else if (zoom < 14) {
    layer.size(6);
  } else {
    layer.size(8); // 大缩放级别用大尺寸
  }
});
```

## 注意事项

⚠️ **数据格式**：确保瓦片服务返回标准的 MVT/PBF 格式

⚠️ **坐标系统**：MVT 使用 Web Mercator 投影（EPSG:3857）

⚠️ **图层名称**：sourceLayer 必须与 MVT 数据中的图层名称完全匹配

⚠️ **缩放范围**：合理设置 minZoom 和 maxZoom 避免性能问题

⚠️ **数据边界**：extent 参数用于限制请求范围，提升性能

⚠️ **复用数据源**：多个图层使用同一瓦片数据时，务必复用 Source 对象

## 相关技能

- [图层通用方法和事件](./layer-common-api.md)
- [MVT 数据源](../data/source-mvt.md)
- [栅格瓦片图层](./tile-raster.md)
- [性能优化](../performance/optimization.md)

## 在线示例

查看更多示例：[L7 矢量瓦片示例](https://l7.antv.antgroup.com/examples/tile/vector)
