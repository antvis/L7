---
skill_id: source-json
skill_name: JSON 数据源
category: data
difficulty: beginner
tags: [json, data, source, object, 数据源]
dependencies: []
version: 2.x
---

# JSON 数据源

## 技能描述

使用 JSON（JavaScript Object Notation）格式的数据作为图层数据源，适合结构化的业务数据。

## 何时使用

- ✅ API 返回的数据
- ✅ 前端 JavaScript 对象
- ✅ 业务数据、统计数据
- ✅ 配置文件数据
- ✅ 不需要地理拓扑结构的简单数据

## JSON 格式说明

JSON 是一种轻量级的数据交换格式，易于阅读和编写。

### 基本格式

```json
[
  {
    "lng": 120.19,
    "lat": 30.26,
    "name": "杭州",
    "value": 100,
    "type": "city"
  },
  {
    "lng": 121.47,
    "lat": 31.23,
    "name": "上海",
    "value": 200,
    "type": "city"
  }
]
```

## 代码示例

### 基础用法 - 点数据

```javascript
import { PointLayer } from '@antv/l7';

const data = [
  { lng: 120.19, lat: 30.26, name: '杭州', value: 100, type: 'city' },
  { lng: 121.47, lat: 31.23, name: '上海', value: 200, type: 'city' },
  { lng: 116.4, lat: 39.91, name: '北京', value: 300, type: 'capital' },
];

const pointLayer = new PointLayer()
  .source(data, {
    parser: {
      type: 'json',
      x: 'lng', // 经度字段
      y: 'lat', // 纬度字段
    },
  })
  .shape('circle')
  .size('value', [5, 20])
  .color('type', {
    city: '#5B8FF9',
    capital: '#FF6B3B',
  });

scene.addLayer(pointLayer);
```

### 从 API 加载数据

```javascript
fetch('/api/cities')
  .then((res) => res.json())
  .then((data) => {
    const layer = new PointLayer()
      .source(data, {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      })
      .shape('circle')
      .size(10)
      .color('#5B8FF9');

    scene.addLayer(layer);
  });
```

### 异步加载数据

```javascript
async function loadData() {
  const response = await fetch('/api/data');
  const data = await response.json();

  const layer = new PointLayer()
    .source(data, {
      parser: {
        type: 'json',
        x: 'longitude',
        y: 'latitude',
      },
    })
    .shape('circle')
    .size(8)
    .color('#5B8FF9');

  scene.addLayer(layer);
}

scene.on('loaded', () => {
  loadData();
});
```

### 嵌套对象数据

```javascript
const data = [
  {
    location: {
      lng: 120.19,
      lat: 30.26,
    },
    info: {
      name: '杭州',
      population: 1200,
    },
    metrics: {
      gdp: 18000,
      growth: 0.08,
    },
  },
];

const layer = new PointLayer()
  .source(data, {
    parser: {
      type: 'json',
      x: 'location.lng', // 支持嵌套字段
      y: 'location.lat',
    },
  })
  .shape('circle')
  .size('info.population', [5, 20])
  .color('metrics.growth', ['#FFF5B8', '#FFAB5C', '#FF6B3B']);

scene.addLayer(layer);
```

### 路径数据（LineString）

```javascript
const pathData = [
  {
    name: '路线1',
    type: 'route',
    path: [
      [120.19, 30.26],
      [120.2, 30.27],
      [120.21, 30.28],
    ],
  },
  {
    name: '路线2',
    type: 'route',
    path: [
      [121.47, 31.23],
      [121.48, 31.24],
      [121.49, 31.25],
    ],
  },
];

const lineLayer = new LineLayer()
  .source(pathData, {
    parser: {
      type: 'json',
      coordinates: 'path', // 指定路径坐标字段
    },
  })
  .shape('line')
  .size(3)
  .color('type', ['#5B8FF9', '#5AD8A6']);

scene.addLayer(lineLayer);
```

### OD 数据（起点-终点）

```javascript
const odData = [
  {
    from: { lng: 120.19, lat: 30.26 },
    to: { lng: 121.47, lat: 31.23 },
    count: 100,
    type: 'migration',
  },
  {
    from: { lng: 120.19, lat: 30.26 },
    to: { lng: 116.4, lat: 39.91 },
    count: 200,
    type: 'migration',
  },
];

// 方式1: 使用嵌套字段
const arcLayer = new LineLayer()
  .source(odData, {
    parser: {
      type: 'json',
      x: 'from.lng',
      y: 'from.lat',
      x1: 'to.lng',
      y1: 'to.lat',
    },
  })
  .shape('arc')
  .size('count', [1, 5])
  .color('#5B8FF9');

// 方式2: 先转换数据结构
const transformedData = odData.map((item) => ({
  from_lng: item.from.lng,
  from_lat: item.from.lat,
  to_lng: item.to.lng,
  to_lat: item.to.lat,
  count: item.count,
}));

const arcLayer2 = new LineLayer()
  .source(transformedData, {
    parser: {
      type: 'json',
      x: 'from_lng',
      y: 'from_lat',
      x1: 'to_lng',
      y1: 'to_lat',
    },
  })
  .shape('arc')
  .size('count', [1, 5])
  .color('#5B8FF9');

scene.addLayer(arcLayer);
```

### 使用坐标数组

```javascript
const data = [
  {
    coordinates: [120.19, 30.26],
    name: '点位1',
    value: 100,
  },
  {
    coordinates: [121.47, 31.23],
    name: '点位2',
    value: 200,
  },
];

const layer = new PointLayer()
  .source(data, {
    parser: {
      type: 'json',
      coordinates: 'coordinates', // 直接使用坐标数组
    },
  })
  .shape('circle')
  .size(10)
  .color('#5B8FF9');

scene.addLayer(layer);
```

## Parser 配置选项

### 点数据配置

| 参数          | 类型   | 说明                       |
| ------------- | ------ | -------------------------- |
| `type`        | string | 必须设置为 'json'          |
| `x`           | string | 经度字段名（支持嵌套路径） |
| `y`           | string | 纬度字段名（支持嵌套路径） |
| `coordinates` | string | 坐标数组字段（替代 x, y）  |

### OD 数据配置

| 参数 | 类型   | 说明     |
| ---- | ------ | -------- |
| `x`  | string | 起点经度 |
| `y`  | string | 起点纬度 |
| `x1` | string | 终点经度 |
| `y1` | string | 终点纬度 |

### 路径数据配置

| 参数          | 类型   | 说明             |
| ------------- | ------ | ---------------- |
| `coordinates` | string | 路径坐标数组字段 |

## 数据转换

### 自定义数据转换

```javascript
const rawData = [{ lon: 120.19, lat: 30.26, name: '杭州', val: '100' }];

const layer = new PointLayer()
  .source(rawData, {
    parser: {
      type: 'json',
      x: 'lon',
      y: 'lat',
    },
    transforms: [
      {
        type: 'map',
        callback: (item) => {
          // 字段名映射
          item.value = Number(item.val);
          delete item.val;

          // 数据清洗
          if (item.value < 0) {
            item.value = 0;
          }

          return item;
        },
      },
    ],
  })
  .shape('circle')
  .size('value', [5, 20])
  .color('#5B8FF9');

scene.addLayer(layer);
```

### 过滤数据

```javascript
const layer = new PointLayer()
  .source(data, {
    parser: {
      type: 'json',
      x: 'lng',
      y: 'lat',
    },
    transforms: [
      {
        type: 'filter',
        callback: (item) => {
          // 只显示值大于 100 的数据
          return item.value > 100;
        },
      },
    ],
  })
  .shape('circle')
  .size(10)
  .color('#5B8FF9');

scene.addLayer(layer);
```

### JSON 转 GeoJSON

```javascript
function jsonToGeoJSON(data, xField, yField) {
  return {
    type: 'FeatureCollection',
    features: data.map((item) => ({
      type: 'Feature',
      properties: { ...item },
      geometry: {
        type: 'Point',
        coordinates: [item[xField], item[yField]],
      },
    })),
  };
}

// 使用
const jsonData = [{ lng: 120.19, lat: 30.26, name: '杭州', value: 100 }];

const geojson = jsonToGeoJSON(jsonData, 'lng', 'lat');

layer.source(geojson, {
  parser: { type: 'geojson' },
});
```

## 常见问题

### 1. 字段名不匹配

**问题**: 数据字段名与 parser 配置不一致

**解决方案**:

```javascript
// 检查字段名
console.log('数据结构:', data[0]);

// 确保字段名正确
layer.source(data, {
  parser: {
    type: 'json',
    x: 'longitude', // 注意大小写
    y: 'latitude',
  },
});
```

### 2. 嵌套字段访问

**问题**: 无法访问嵌套对象的字段

**解决方案**:

```javascript
// 使用点号访问嵌套字段
layer.source(data, {
  parser: {
    type: 'json',
    x: 'location.coordinates.lng',
    y: 'location.coordinates.lat',
  },
});

// 或者先展平数据
const flatData = data.map((item) => ({
  lng: item.location.coordinates.lng,
  lat: item.location.coordinates.lat,
  ...item.properties,
}));
```

### 3. 数据类型错误

**问题**: 坐标值是字符串而不是数字

**解决方案**:

```javascript
layer.source(data, {
  parser: {
    type: 'json',
    x: 'lng',
    y: 'lat',
  },
  transforms: [
    {
      type: 'map',
      callback: (item) => {
        // 转换为数字
        item.lng = Number(item.lng);
        item.lat = Number(item.lat);
        item.value = parseFloat(item.value);
        return item;
      },
    },
  ],
});
```

### 4. 异步数据加载失败

**解决方案**:

```javascript
async function loadDataSafely() {
  try {
    const response = await fetch('/api/data');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      console.warn('No data returned');
      return;
    }

    const layer = new PointLayer()
      .source(data, {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      })
      .shape('circle')
      .size(10)
      .color('#5B8FF9');

    scene.addLayer(layer);
  } catch (error) {
    console.error('Failed to load data:', error);
  }
}
```

## 性能优化

### 1. 数据分页加载

```javascript
let currentPage = 0;
const pageSize = 1000;

async function loadPage(page) {
  const response = await fetch(`/api/data?page=${page}&size=${pageSize}`);
  const data = await response.json();

  if (data.length > 0) {
    const layer = new PointLayer()
      .source(data, {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      })
      .shape('circle')
      .size(5)
      .color('#5B8FF9');

    scene.addLayer(layer);
  }
}

// 按需加载
loadPage(currentPage);
```

### 2. 数据缓存

```javascript
const dataCache = new Map();

async function loadDataWithCache(url) {
  if (dataCache.has(url)) {
    return dataCache.get(url);
  }

  const response = await fetch(url);
  const data = await response.json();

  dataCache.set(url, data);
  return data;
}
```

### 3. 数据压缩

```javascript
// 服务端返回压缩数据
async function loadCompressedData() {
  const response = await fetch('/api/data.gz', {
    headers: {
      'Accept-Encoding': 'gzip',
    },
  });

  const data = await response.json();
  // 使用数据
}
```

## 数据验证

```javascript
function validateData(data) {
  if (!Array.isArray(data)) {
    throw new Error('Data must be an array');
  }

  const errors = [];

  data.forEach((item, index) => {
    // 检查必需字段
    if (!item.lng || !item.lat) {
      errors.push(`Item ${index}: missing lng or lat`);
    }

    // 检查坐标范围
    if (item.lng < -180 || item.lng > 180) {
      errors.push(`Item ${index}: invalid lng ${item.lng}`);
    }

    if (item.lat < -90 || item.lat > 90) {
      errors.push(`Item ${index}: invalid lat ${item.lat}`);
    }
  });

  if (errors.length > 0) {
    console.error('Data validation errors:', errors);
    return false;
  }

  return true;
}

// 使用
if (validateData(data)) {
  layer.source(data, {
    parser: {
      type: 'json',
      x: 'lng',
      y: 'lat',
    },
  });
}
```

## 最佳实践

### 1. 统一数据结构

```javascript
// 推荐：统一的字段命名
const data = [
  { lng: 120.19, lat: 30.26, name: '点1', value: 100 },
  { lng: 121.47, lat: 31.23, name: '点2', value: 200 },
];

// 避免：不一致的结构
const badData = [
  { longitude: 120.19, latitude: 30.26, title: '点1' },
  { x: 121.47, y: 31.23, name: '点2' },
];
```

### 2. 错误处理

```javascript
fetch('/api/data')
  .then((res) => res.json())
  .then((data) => {
    if (validateData(data)) {
      layer.source(data, {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      });
    }
  })
  .catch((error) => {
    console.error('Error:', error);
    // 显示错误提示
  });
```

### 3. 数据更新

```javascript
// 动态更新数据
function updateLayerData(newData) {
  layer.setData(newData);
}

// 定时更新
setInterval(async () => {
  const newData = await fetch('/api/data/latest').then((r) => r.json());
  updateLayerData(newData);
}, 5000);
```

## 相关技能

- [GeoJSON 数据源](./source-geojson.md)
- [CSV 数据源](./source-csv.md)
- [数据解析配置](./source-parser.md)
- [点图层](../layers/point.md)
- [线图层](../layers/line.md)

## 参考资源

- [JSON 规范](https://www.json.org/)
- [MDN - JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
