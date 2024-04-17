---
title: CSV
order: 3
---

<embed src="@/docs/api/common/style.md"></embed>

L7 支持 CSV 以逗号分隔的 CSV 数据加载。

CSV 是文本数据结构，很难表达复杂的地理数据结构，因此 CSV 仅支持两种数据结构

- 点数据：需要指定经度、纬度坐标
- 线段、弧线数据：需要指定 **起止点** 的经度、纬度坐标

## parser

- type string 必选 json
- x string 点数据表示 经度
- y string 点数据表示 纬度
- x1 string 经度
- x2 string 纬度

### 点数据通过 CSV 加载

```javascript
layer.source(data, {
  parser: {
    type: 'csv',
    x: 'lng',
    y: 'lat',
  },
});
```

[CSV 数据 demo 示例](/examples/point/bubble#scatter)

### 线段弧线数据通过 CSV 加载

```javascript
layer.source(data, {
  parser: {
    type: 'csv',
    x: 'lng1',
    y: 'lat1',
    x1: 'lng1',
    y1: 'lat2',
  },
});
```

[CSV 线段数据 demo 示例](/examples/gallery/basic#arccircle)
