---
skill_id: source-parser
skill_name: 数据解析配置
category: data
difficulty: intermediate
tags: [parser, data, transform, config, 解析器, 数据转换]
dependencies: [source-geojson, source-csv, source-json]
version: 2.x
---

# 数据解析配置

## 技能描述

配置数据解析器（Parser）和数据转换器（Transform），将原始数据转换为 L7 可以使用的格式。

## 何时使用

- ✅ 数据格式需要特殊处理
- ✅ 需要数据转换和清洗
- ✅ 字段映射和重命名
- ✅ 数据过滤和聚合
- ✅ 自定义数据处理逻辑

## Parser 类型

L7 支持多种数据解析器：

| Parser 类型 | 说明          | 适用场景             |
| ----------- | ------------- | -------------------- |
| `geojson`   | GeoJSON 格式  | 标准地理数据         |
| `json`      | JSON 对象数组 | 业务数据、API 数据   |
| `csv`       | CSV 文本      | 表格数据、Excel 导出 |
| `image`     | 图片          | 图片图层             |
| `raster`    | 栅格数据      | 遥感影像             |
| `mvt`       | 矢量瓦片      | 大规模矢量数据       |

## 代码示例

### GeoJSON Parser

```javascript
layer.source(geojsonData, {
  parser: {
    type: 'geojson',
  },
});
```

### JSON Parser - 基础配置

```javascript
const data = [{ lng: 120.19, lat: 30.26, name: '杭州', value: 100 }];

layer.source(data, {
  parser: {
    type: 'json',
    x: 'lng', // 经度字段
    y: 'lat', // 纬度字段
  },
});
```

### JSON Parser - 嵌套字段

```javascript
const data = [
  {
    location: {
      coordinates: {
        lng: 120.19,
        lat: 30.26,
      },
    },
    info: { name: '杭州' },
  },
];

layer.source(data, {
  parser: {
    type: 'json',
    x: 'location.coordinates.lng', // 支持点号访问嵌套字段
    y: 'location.coordinates.lat',
  },
});
```

### JSON Parser - 坐标数组

```javascript
const data = [
  {
    coordinates: [120.19, 30.26],
    name: '杭州',
  },
];

layer.source(data, {
  parser: {
    type: 'json',
    coordinates: 'coordinates', // 直接使用坐标数组
  },
});
```

### JSON Parser - 路径数据

```javascript
const pathData = [
  {
    name: '路线1',
    path: [
      [120.19, 30.26],
      [120.2, 30.27],
      [120.21, 30.28],
    ],
  },
];

layer.source(pathData, {
  parser: {
    type: 'json',
    coordinates: 'path', // 路径坐标数组
  },
});
```

### JSON Parser - OD 数据

```javascript
const odData = [
  {
    from_lng: 120.19,
    from_lat: 30.26,
    to_lng: 121.47,
    to_lat: 31.23,
    count: 100,
  },
];

layer.source(odData, {
  parser: {
    type: 'json',
    x: 'from_lng',
    y: 'from_lat',
    x1: 'to_lng', // 终点经度
    y1: 'to_lat', // 终点纬度
  },
});
```

### CSV Parser

```javascript
const csvData = `lng,lat,name,value
120.19,30.26,杭州,100
121.47,31.23,上海,200`;

layer.source(csvData, {
  parser: {
    type: 'csv',
    x: 'lng',
    y: 'lat',
    delimiter: ',', // 分隔符，默认为逗号
  },
});
```

### Image Parser

```javascript
layer.source('https://example.com/image.png', {
  parser: {
    type: 'image',
    extent: [minLng, minLat, maxLng, maxLat], // 图片地理范围
  },
});
```

### Raster Parser

```javascript
layer.source(rasterImageUrl, {
  parser: {
    type: 'rasterImage',
    extent: [minLng, minLat, maxLng, maxLat],
  },
});
```

### MVT Parser（矢量瓦片）

```javascript
layer.source('https://tiles.example.com/{z}/{x}/{y}.mvt', {
  parser: {
    type: 'mvt',
    tileSize: 256,
    maxZoom: 14,
    extent: [-180, -85.051129, 179, 85.051129],
  },
});
```

## Transforms 数据转换

### Map 转换 - 字段映射

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
        // 字段重命名
        item.value = item.val;
        delete item.val;

        // 数据类型转换
        item.value = Number(item.value);

        // 计算新字段
        item.category = item.value > 100 ? 'high' : 'low';

        return item;
      },
    },
  ],
});
```

### Filter 转换 - 数据过滤

```javascript
layer.source(data, {
  parser: {
    type: 'json',
    x: 'lng',
    y: 'lat',
  },
  transforms: [
    {
      type: 'filter',
      callback: (item) => {
        // 过滤条件
        return item.value > 100 && item.type === 'city';
      },
    },
  ],
});
```

### 多个转换组合

```javascript
layer.source(data, {
  parser: {
    type: 'json',
    x: 'lng',
    y: 'lat',
  },
  transforms: [
    // 1. 先过滤
    {
      type: 'filter',
      callback: (item) => item.value > 0,
    },
    // 2. 再转换
    {
      type: 'map',
      callback: (item) => {
        item.value = Math.sqrt(item.value);
        item.normalized = item.value / 100;
        return item;
      },
    },
  ],
});
```

## 常见场景

### 场景 1: API 数据适配

```javascript
// API 返回的数据结构
const apiData = {
  code: 200,
  data: {
    list: [
      {
        id: 1,
        location: { longitude: 120.19, latitude: 30.26 },
        metrics: { score: 85, rating: 4.5 },
      },
    ],
  },
};

// 提取并转换数据
const data = apiData.data.list;

layer.source(data, {
  parser: {
    type: 'json',
    x: 'location.longitude',
    y: 'location.latitude',
  },
  transforms: [
    {
      type: 'map',
      callback: (item) => {
        return {
          id: item.id,
          lng: item.location.longitude,
          lat: item.location.latitude,
          score: item.metrics.score,
          rating: item.metrics.rating,
        };
      },
    },
  ],
});
```

### 场景 2: 数据聚合

```javascript
// 对数据进行聚合
layer.source(data, {
  parser: {
    type: 'json',
    x: 'lng',
    y: 'lat',
  },
  transforms: [
    {
      type: 'map',
      callback: (item, index, arr) => {
        // 计算该点周围的平均值
        const nearby = arr.filter(
          (d) => Math.abs(d.lng - item.lng) < 0.1 && Math.abs(d.lat - item.lat) < 0.1,
        );

        item.nearbyCount = nearby.length;
        item.averageValue = nearby.reduce((sum, d) => sum + d.value, 0) / nearby.length;

        return item;
      },
    },
  ],
});
```

### 场景 3: 数据标准化

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
      callback: (item, index, arr) => {
        // 计算最大最小值
        const values = arr.map((d) => d.value);
        const min = Math.min(...values);
        const max = Math.max(...values);

        // 归一化
        item.normalized = (item.value - min) / (max - min);

        return item;
      },
    },
  ],
});
```

### 场景 4: 时间数据处理

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
        // 解析时间字符串
        item.timestamp = new Date(item.dateStr).getTime();

        // 提取时间组件
        const date = new Date(item.dateStr);
        item.year = date.getFullYear();
        item.month = date.getMonth() + 1;
        item.day = date.getDate();
        item.hour = date.getHours();

        return item;
      },
    },
    {
      type: 'filter',
      callback: (item) => {
        // 只显示最近7天的数据
        const now = Date.now();
        const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
        return item.timestamp >= sevenDaysAgo;
      },
    },
  ],
});
```

### 场景 5: 坐标系转换

```javascript
// 假设需要从 GCJ-02 转 WGS84
function gcj02ToWgs84(lng, lat) {
  // 坐标转换算法
  // ...
  return { lng: newLng, lat: newLat };
}

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
        const { lng, lat } = gcj02ToWgs84(item.lng, item.lat);
        item.lng = lng;
        item.lat = lat;
        return item;
      },
    },
  ],
});
```

## 性能优化

### 1. 避免在 transform 中进行重复计算

```javascript
// ❌ 不推荐：每条数据都计算全局统计
transforms: [
  {
    type: 'map',
    callback: (item, index, arr) => {
      const max = Math.max(...arr.map((d) => d.value)); // 重复计算
      item.normalized = item.value / max;
      return item;
    },
  },
];

// ✅ 推荐：预先计算
const max = Math.max(...data.map((d) => d.value));

transforms: [
  {
    type: 'map',
    callback: (item) => {
      item.normalized = item.value / max;
      return item;
    },
  },
];
```

### 2. 合并转换逻辑

```javascript
// ❌ 不推荐：多次遍历
transforms: [
  { type: 'filter', callback: (item) => item.value > 0 },
  {
    type: 'map',
    callback: (item) => {
      item.doubled = item.value * 2;
      return item;
    },
  },
  {
    type: 'map',
    callback: (item) => {
      item.category = item.doubled > 100 ? 'high' : 'low';
      return item;
    },
  },
];

// ✅ 推荐：一次遍历
transforms: [
  {
    type: 'map',
    callback: (item) => {
      if (item.value <= 0) return null; // 过滤

      item.doubled = item.value * 2;
      item.category = item.doubled > 100 ? 'high' : 'low';
      return item;
    },
  },
  {
    type: 'filter',
    callback: (item) => item !== null,
  },
];
```

### 3. 数据量大时使用 Web Worker

```javascript
// worker.js
self.onmessage = function (e) {
  const data = e.data;

  const processed = data.map((item) => {
    // 复杂的数据处理
    return processItem(item);
  });

  self.postMessage(processed);
};

// 主线程
const worker = new Worker('worker.js');

worker.postMessage(rawData);

worker.onmessage = function (e) {
  const processedData = e.data;

  layer.source(processedData, {
    parser: {
      type: 'json',
      x: 'lng',
      y: 'lat',
    },
  });
};
```

## 调试技巧

### 1. 打印解析后的数据

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
      callback: (item, index) => {
        // 打印前几条数据
        if (index < 3) {
          console.log('Item', index, item);
        }
        return item;
      },
    },
  ],
});

// 或者在图层添加后查看
layer.on('add', () => {
  const source = layer.getSource();
  console.log('Source data:', source.data.dataArray.slice(0, 5));
});
```

### 2. 验证数据格式

```javascript
transforms: [
  {
    type: 'map',
    callback: (item, index) => {
      // 数据验证
      if (isNaN(item.lng) || isNaN(item.lat)) {
        console.error(`Invalid coordinates at index ${index}:`, item);
      }

      if (item.lng < -180 || item.lng > 180) {
        console.warn(`Invalid longitude at index ${index}: ${item.lng}`);
      }

      return item;
    },
  },
];
```

## 常见问题

### 1. 数据解析失败

**检查清单**:

- ✅ parser.type 是否正确
- ✅ 字段名是否正确（区分大小写）
- ✅ 坐标格式是否正确（经度在前）
- ✅ 数据是否为空

### 2. Transform 不生效

**原因**: Transform callback 必须返回数据

```javascript
// ❌ 错误：没有返回值
transforms: [
  {
    type: 'map',
    callback: (item) => {
      item.value = item.value * 2;
      // 忘记 return
    },
  },
];

// ✅ 正确
transforms: [
  {
    type: 'map',
    callback: (item) => {
      item.value = item.value * 2;
      return item; // 必须返回
    },
  },
];
```

### 3. 性能问题

对于大数据量，避免复杂的 transform 操作，尽量在服务端处理。

## 相关技能

- [GeoJSON 数据源](./source-geojson.md)
- [CSV 数据源](./source-csv.md)
- [JSON 数据源](./source-json.md)
- [性能优化](../performance/optimization.md)

## 最佳实践

1. **预处理优先**: 尽量在服务端或数据加载前完成数据处理
2. **简化 transform**: Transform 在渲染时执行，保持逻辑简单
3. **类型转换**: 确保数字字段是 number 类型而非 string
4. **错误处理**: 添加数据验证，避免坏数据导致渲染失败
5. **性能监控**: 对大数据量使用 console.time 监控处理时间
