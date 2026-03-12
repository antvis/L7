---
skill_id: source-geojson
skill_name: GeoJSON 数据源
category: data
difficulty: beginner
tags: [geojson, data, source, geo, 数据源]
dependencies: []
version: 2.x
---

# GeoJSON 数据源

## 技能描述

使用 GeoJSON 格式的地理数据作为图层数据源，这是 L7 最常用的数据格式。

## 何时使用

- ✅ 处理地理空间数据（点、线、面）
- ✅ 使用标准的地理数据格式
- ✅ 数据包含几何信息和属性信息
- ✅ 从 GIS 系统导出的数据
- ✅ 行政区划、建筑、道路等矢量数据

## GeoJSON 格式说明

GeoJSON 是一种用于编码各种地理数据结构的格式，基于 JSON。

### 基本结构

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "属性名称",
        "value": 100
      },
      "geometry": {
        "type": "Point",
        "coordinates": [120.19, 30.26]
      }
    }
  ]
}
```

### 几何类型

| 类型              | 说明 | coordinates 格式                             |
| ----------------- | ---- | -------------------------------------------- |
| `Point`           | 点   | `[lng, lat]`                                 |
| `LineString`      | 线   | `[[lng, lat], [lng, lat], ...]`              |
| `Polygon`         | 面   | `[[[lng, lat], [lng, lat], ...]]`            |
| `MultiPoint`      | 多点 | `[[lng, lat], [lng, lat], ...]`              |
| `MultiLineString` | 多线 | `[[[lng, lat], ...], [[lng, lat], ...]]`     |
| `MultiPolygon`    | 多面 | `[[[[lng, lat], ...]], [[[lng, lat], ...]]]` |

## 代码示例

### 基础用法 - 点数据

```javascript
import { PointLayer } from '@antv/l7';

const pointData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: '杭州',
        population: 1200,
        type: 'city',
      },
      geometry: {
        type: 'Point',
        coordinates: [120.19, 30.26],
      },
    },
    {
      type: 'Feature',
      properties: {
        name: '上海',
        population: 2400,
        type: 'city',
      },
      geometry: {
        type: 'Point',
        coordinates: [121.47, 31.23],
      },
    },
  ],
};

const pointLayer = new PointLayer()
  .source(pointData, {
    parser: {
      type: 'geojson',
    },
  })
  .shape('circle')
  .size('population', [5, 20])
  .color('type', ['#5B8FF9', '#5AD8A6']);

scene.addLayer(pointLayer);
```

### 线数据 - LineString

```javascript
import { LineLayer } from '@antv/l7';

const lineData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: '路线1',
        type: 'highway',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [120.19, 30.26],
          [120.2, 30.27],
          [120.21, 30.28],
        ],
      },
    },
  ],
};

const lineLayer = new LineLayer()
  .source(lineData, {
    parser: {
      type: 'geojson',
    },
  })
  .shape('line')
  .size(3)
  .color('type', ['#5B8FF9', '#5AD8A6']);

scene.addLayer(lineLayer);
```

### 面数据 - Polygon

```javascript
import { PolygonLayer } from '@antv/l7';

const polygonData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: '浙江省',
        adcode: '330000',
        gdp: 82553,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [118.0, 28.0],
            [122.0, 28.0],
            [122.0, 31.0],
            [118.0, 31.0],
            [118.0, 28.0],
          ],
        ],
      },
    },
  ],
};

const polygonLayer = new PolygonLayer()
  .source(polygonData, {
    parser: {
      type: 'geojson',
    },
  })
  .shape('fill')
  .color('gdp', ['#FFF5B8', '#FFAB5C', '#FF6B3B', '#CC2B12'])
  .style({
    opacity: 0.8,
  });

scene.addLayer(polygonLayer);
```

### 从 URL 加载 GeoJSON

```javascript
const layer = new PolygonLayer();

fetch('https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json')
  .then((res) => res.json())
  .then((data) => {
    layer
      .source(data, {
        parser: {
          type: 'geojson',
        },
      })
      .shape('fill')
      .color('name', ['#5B8FF9', '#5AD8A6', '#5D7092'])
      .style({
        opacity: 0.8,
      });

    scene.addLayer(layer);
  });
```

### 多面 - MultiPolygon

```javascript
const multiPolygonData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: '浙江省（含岛屿）',
      },
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          // 主陆地
          [
            [
              [118.0, 28.0],
              [122.0, 28.0],
              [122.0, 31.0],
              [118.0, 31.0],
              [118.0, 28.0],
            ],
          ],
          // 岛屿1
          [
            [
              [122.1, 30.0],
              [122.2, 30.0],
              [122.2, 30.1],
              [122.1, 30.1],
              [122.1, 30.0],
            ],
          ],
        ],
      },
    },
  ],
};

const layer = new PolygonLayer()
  .source(multiPolygonData, {
    parser: {
      type: 'geojson',
    },
  })
  .shape('fill')
  .color('#5B8FF9');

scene.addLayer(layer);
```

### 带孔洞的面

```javascript
const polygonWithHole = {
  type: 'Feature',
  properties: { name: '带孔洞的面' },
  geometry: {
    type: 'Polygon',
    coordinates: [
      // 外环（逆时针）
      [
        [118.0, 28.0],
        [122.0, 28.0],
        [122.0, 31.0],
        [118.0, 31.0],
        [118.0, 28.0],
      ],
      // 内环/孔洞（顺时针）
      [
        [119.0, 29.0],
        [119.0, 30.0],
        [121.0, 30.0],
        [121.0, 29.0],
        [119.0, 29.0],
      ],
    ],
  },
};
```

## 数据转换

### 从普通数组转换为 GeoJSON

```javascript
// 原始数据
const rawData = [
  { lng: 120.19, lat: 30.26, name: '杭州', value: 100 },
  { lng: 121.47, lat: 31.23, name: '上海', value: 200 },
];

// 转换为 GeoJSON
const geojson = {
  type: 'FeatureCollection',
  features: rawData.map((item) => ({
    type: 'Feature',
    properties: {
      name: item.name,
      value: item.value,
    },
    geometry: {
      type: 'Point',
      coordinates: [item.lng, item.lat],
    },
  })),
};

layer.source(geojson, {
  parser: { type: 'geojson' },
});
```

### 使用工具库转换

```javascript
// 使用 turf.js
import * as turf from '@turf/turf';

const point = turf.point([120.19, 30.26], { name: '杭州' });
const line = turf.lineString(
  [
    [120, 30],
    [121, 31],
  ],
  { name: '路线' },
);
const polygon = turf.polygon(
  [
    [
      [118, 28],
      [122, 28],
      [122, 31],
      [118, 31],
      [118, 28],
    ],
  ],
  { name: '区域' },
);

layer.source(point, {
  parser: { type: 'geojson' },
});
```

## 常见问题

### 1. 数据不显示

**检查清单**:

- ✅ coordinates 格式是否正确（经度在前，纬度在后）
- ✅ 坐标范围是否合理（经度 -180~180，纬度 -90~90）
- ✅ GeoJSON 结构是否完整
- ✅ parser 类型是否设置为 'geojson'

```javascript
// 正确的格式
coordinates: [120.19, 30.26]; // [经度, 纬度]

// 错误的格式
coordinates: [30.26, 120.19]; // [纬度, 经度] ❌
```

### 2. 面不闭合

多边形的首尾坐标必须相同：

```javascript
// 正确 - 闭合
coordinates: [
  [
    [118.0, 28.0],
    [122.0, 28.0],
    [122.0, 31.0],
    [118.0, 31.0],
    [118.0, 28.0], // 与第一个点相同
  ],
];

// 错误 - 未闭合
coordinates: [
  [
    [118.0, 28.0],
    [122.0, 28.0],
    [122.0, 31.0],
    [118.0, 31.0], // 缺少闭合点 ❌
  ],
];
```

### 3. 数据格式验证

使用在线工具验证 GeoJSON 格式：

- [geojson.io](http://geojson.io/)
- [GeoJSONLint](https://geojsonlint.com/)

### 4. 性能优化

对于复杂的 GeoJSON 数据：

```javascript
// 简化几何形状
layer.source(data, {
  parser: {
    type: 'geojson',
  },
  transforms: [
    {
      type: 'simplify',
      tolerance: 0.01, // 简化容差
    },
  ],
});
```

## GeoJSON 规范

### Feature 必需字段

```javascript
{
  "type": "Feature",           // 必需
  "geometry": {},              // 必需
  "properties": {}             // 可选，但通常包含
}
```

### FeatureCollection 结构

```javascript
{
  "type": "FeatureCollection",  // 必需
  "features": []                // 必需，Feature 数组
}
```

### 坐标顺序

- **经度**（Longitude）在前，范围: -180 ~ 180
- **纬度**（Latitude）在后，范围: -90 ~ 90
- 格式: `[经度, 纬度]` 或 `[lng, lat]`

### 环绕方向

- **外环**: 逆时针
- **内环**（孔洞）: 顺时针

## 最佳实践

### 1. 数据结构清晰

```javascript
// 推荐：属性语义化
{
  "type": "Feature",
  "properties": {
    "id": "330100",
    "name": "杭州市",
    "type": "city",
    "population": 1200,
    "gdp": 18000
  },
  "geometry": {...}
}
```

### 2. 合理使用属性

```javascript
// 在 properties 中存储可视化需要的数据
layer.color('type', {...})
layer.size('population', [5, 20])
```

### 3. 数据分层

```javascript
// 不同类型的数据使用不同图层
const cityLayer = new PointLayer().source(cityGeoJSON);
const provinceLayer = new PolygonLayer().source(provinceGeoJSON);
```

## 相关技能

- [JSON 数据源](./source-json.md)
- [CSV 数据源](./source-csv.md)
- [数据解析配置](./source-parser.md)
- [点图层](../layers/point.md)
- [线图层](../layers/line.md)
- [面图层](../layers/polygon.md)

## 参考资源

- [GeoJSON 规范](https://datatracker.ietf.org/doc/html/rfc7946)
- [Turf.js - GeoJSON 工具库](https://turfjs.org/)
- [geojson.io - 在线编辑器](http://geojson.io/)
