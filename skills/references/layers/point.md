---
skill_id: point-layer
skill_name: 点图层
category: layers
difficulty: beginner
tags: [point, layer, scatter, bubble, visualization]
dependencies: [scene-initialization, source-geojson]
version: 2.x
---

# 点图层

## 技能描述

在地图上绘制点状地理要素，支持气泡图、散点图、符号地图等多种形式。

## 何时使用

- ✅ 显示 POI 位置（餐厅、商店、景点等）
- ✅ 显示事件发生点（地震、案件、事故）
- ✅ 显示采样点位置（气象站、监测点）
- ✅ 散点图可视化（人口分布、经济指标）
- ✅ 3D 柱状图（城市数据对比）

## 前置条件

- 已完成[场景初始化](../01-core/scene-initialization.md)
- 准备好点位数据（包含经纬度）

## 输入参数

### 数据格式

```typescript
interface PointData {
  lng: number; // 经度
  lat: number; // 纬度
  [key: string]: any; // 其他属性
}
```

### 图层配置

| 方法                   | 参数                  | 说明                                                    |
| ---------------------- | --------------------- | ------------------------------------------------------- |
| `source(data, config)` | data: 数据数组        | 设置数据源                                              |
| `shape(type)`          | type: 形状类型        | circle \| square \| hexagon \| triangle \| text \| icon |
| `size(value)`          | value: 数字或字段映射 | 设置点大小                                              |
| `color(value)`         | value: 颜色或字段映射 | 设置点颜色                                              |
| `style(config)`        | config: 样式对象      | 设置样式                                                |

## 输出

返回 `PointLayer` 实例

## 代码示例

### 基础用法 - 简单散点图

```javascript
import { PointLayer } from '@antv/l7';

const data = [
  { lng: 120.19, lat: 30.26, name: '点位1', value: 100 },
  { lng: 120.2, lat: 30.27, name: '点位2', value: 200 },
  { lng: 120.21, lat: 30.28, name: '点位3', value: 300 },
];

scene.on('loaded', () => {
  const pointLayer = new PointLayer()
    .source(data, {
      parser: {
        type: 'json',
        x: 'lng',
        y: 'lat',
      },
    })
    .shape('circle')
    .size(10)
    .color('#5B8FF9')
    .style({
      opacity: 0.8,
    });

  scene.addLayer(pointLayer);
});
```

### 数据驱动 - 颜色和大小映射

```javascript
const pointLayer = new PointLayer()
  .source(data, {
    parser: {
      type: 'json',
      x: 'lng',
      y: 'lat',
    },
  })
  .shape('circle')
  .size('value', [5, 20]) // 根据 value 字段映射大小
  .color('category', {
    // 根据 category 字段映射颜色
    A: '#5B8FF9',
    B: '#5AD8A6',
    C: '#5D7092',
  })
  .style({
    opacity: 0.8,
    strokeWidth: 2,
    stroke: '#fff',
  });

scene.addLayer(pointLayer);
```

### 气泡图 - 面积映射

```javascript
const bubbleLayer = new PointLayer()
  .source(data, {
    parser: {
      type: 'json',
      x: 'lng',
      y: 'lat',
    },
  })
  .shape('circle')
  .size('population', (value) => Math.sqrt(value)) // 使用回调函数
  .color('gdp', ['#FFF5B8', '#FFAB5C', '#FF6B3B', '#CC2B12'])
  .style({
    opacity: 0.6,
    strokeWidth: 1,
    stroke: '#fff',
  });

scene.addLayer(bubbleLayer);
```

### 不同形状的点

```javascript
// 圆形
const circleLayer = new PointLayer().source(data).shape('circle').size(10).color('#5B8FF9');

// 方形
const squareLayer = new PointLayer().source(data).shape('square').size(10).color('#5AD8A6');

// 三角形
const triangleLayer = new PointLayer().source(data).shape('triangle').size(10).color('#5D7092');

// 六边形
const hexagonLayer = new PointLayer().source(data).shape('hexagon').size(10).color('#FF6B3B');
```

### 文本标注

```javascript
const textLayer = new PointLayer()
  .source(data, {
    parser: {
      type: 'json',
      x: 'lng',
      y: 'lat',
    },
  })
  .shape('name', 'text') // 使用 name 字段作为文本
  .size(14)
  .color('#000')
  .style({
    textAnchor: 'center', // 文本对齐方式
    textOffset: [0, 20], // 文本偏移
    fontWeight: 'bold',
    stroke: '#fff',
    strokeWidth: 2,
  });

scene.addLayer(textLayer);
```

### 图标点

```javascript
const iconLayer = new PointLayer()
  .source(data, {
    parser: {
      type: 'json',
      x: 'lng',
      y: 'lat',
    },
  })
  .shape('icon', 'image')
  .size(20)
  .style({
    icon: 'https://example.com/icon.png',
  });

scene.addLayer(iconLayer);
```

### 3D 柱状图

```javascript
const columnLayer = new PointLayer()
  .source(data, {
    parser: {
      type: 'json',
      x: 'lng',
      y: 'lat',
    },
  })
  .shape('cylinder') // 3D 柱状
  .size('value', [10, 100]) // 映射高度
  .color('type', ['#5B8FF9', '#5AD8A6', '#5D7092'])
  .style({
    opacity: 0.8,
  });

scene.addLayer(columnLayer);
```

### 组合使用 - 点 + 文本

```javascript
// 底层点
const pointLayer = new PointLayer()
  .source(data, {
    parser: { type: 'json', x: 'lng', y: 'lat' },
  })
  .shape('circle')
  .size(15)
  .color('#5B8FF9')
  .style({
    opacity: 0.8,
    strokeWidth: 2,
    stroke: '#fff',
  });

// 顶层文本
const textLayer = new PointLayer()
  .source(data, {
    parser: { type: 'json', x: 'lng', y: 'lat' },
  })
  .shape('name', 'text')
  .size(12)
  .color('#fff')
  .style({
    textAnchor: 'center',
    textOffset: [0, 0],
  });

scene.addLayer(pointLayer);
scene.addLayer(textLayer);
```

## 样式配置详解

### 基础样式

```javascript
layer.style({
  opacity: 0.8, // 透明度 0-1
  strokeWidth: 2, // 描边宽度
  stroke: '#fff', // 描边颜色
  strokeOpacity: 1, // 描边透明度
});
```

### 文本样式

```javascript
layer.style({
  textAnchor: 'center', // 对齐: center | left | right | top | bottom
  textOffset: [0, 20], // 偏移 [x, y]
  spacing: 2, // 字符间距
  padding: [5, 5], // 内边距
  fontFamily: 'sans-serif',
  fontSize: 12,
  fontWeight: 'normal', // normal | bold
  textAllowOverlap: true, // 是否允许文本重叠
  stroke: '#fff', // 文本描边
  strokeWidth: 2,
  strokeOpacity: 1,
});
```

## 数据格式要求

### GeoJSON 格式

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "点位1",
        "value": 100,
        "category": "A"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [120.19, 30.26]
      }
    }
  ]
}
```

使用 GeoJSON：

```javascript
layer.source(geojsonData, {
  parser: {
    type: 'geojson',
  },
});
```

### JSON 格式

```json
[
  {
    "lng": 120.19,
    "lat": 30.26,
    "name": "点位1",
    "value": 100,
    "category": "A"
  }
]
```

### CSV 格式

```csv
lng,lat,name,value,category
120.19,30.26,点位1,100,A
120.20,30.27,点位2,200,B
120.21,30.28,点位3,300,C
```

使用 CSV：

```javascript
layer.source(csvData, {
  parser: {
    type: 'csv',
    x: 'lng',
    y: 'lat',
  },
});
```

## 常见问题

### 1. 点不显示

**原因分析**:

- 坐标不在地图视野范围内
- 点太小看不见
- 颜色与背景相同
- 数据格式错误

**解决方案**:

```javascript
// 1. 检查数据坐标
console.log(data);

// 2. 增大点的大小
layer.size(20);

// 3. 使用明显的颜色
layer.color('#FF0000');

// 4. 检查地图中心和缩放级别
scene.setCenter([120.19, 30.26]);
scene.setZoom(12);

// 5. 使用 fitBounds 自动调整视野
const bounds = [
  [minLng, minLat],
  [maxLng, maxLat],
];
scene.fitBounds(bounds);
```

### 2. 大数据量性能问题

**优化方案**:

```javascript
// 1. 数据抽稀
layer.source(data.filter((d, i) => i % 10 === 0));

// 2. 根据缩放级别显示
layer.setMinZoom(10); // 只在 zoom >= 10 时显示

// 3. 使用聚合
// 参考: ../10-performance/aggregation.md
```

### 3. 点的大小不一致

**问题**: 不同缩放级别下点的大小变化

**解决方案**:

```javascript
// 使用单位配置
layer.size(10).style({
  unit: 'meter', // 使用地理单位，点会随缩放变化
});

// 或使用像素单位（默认）
layer.size(10).style({
  unit: 'pixel', // 使用像素单位，点大小固定
});
```

## 高级用法

### 动态更新数据

```javascript
// 更新数据
const newData = [...];
layer.setData(newData);

// 只更新样式
layer.color('#FF0000');
layer.size(20);
scene.render();
```

### 图层控制

```javascript
// 显示/隐藏
layer.show();
layer.hide();

// 销毁图层
layer.destroy();
scene.removeLayer(layer);

// 设置层级
layer.setIndex(10);

// 设置显示范围
layer.setMinZoom(5);
layer.setMaxZoom(15);
```

## 相关技能

- [场景初始化](../01-core/scene-initialization.md)
- [GeoJSON 数据处理](../02-data/source-geojson.md)
- [颜色映射](../04-visual/color-mapping.md)
- [大小映射](../04-visual/size-mapping.md)
- [事件交互](../05-interaction/event-handling.md)
- [添加弹窗](../06-components/popup.md)

## 在线示例

查看更多在线示例: [L7 官方示例 - 点图层](https://l7.antv.antgroup.com/examples/point/scatter)
