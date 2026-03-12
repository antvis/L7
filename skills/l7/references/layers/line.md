---
skill_id: line-layer
skill_name: 线图层
category: layers
difficulty: beginner
tags: [line, path, arc, route, trajectory]
dependencies: [scene-initialization]
version: 2.x
---

# 线图层

## 技能描述

在地图上绘制线状地理要素，支持路径线、弧线、3D 弧线等多种形式。

## 何时使用

- ✅ 显示道路、河流等线性要素
- ✅ 显示轨迹路径（车辆、人员移动）
- ✅ 显示 OD 流向（人口迁徙、物流）
- ✅ 显示航线、航路
- ✅ 显示行政区划边界
- ✅ 显示等值线

## 前置条件

- 已完成[场景初始化](../core/scene.md)
- 准备好线段数据

## 线类型

| 类型          | 说明     | 适用场景         |
| ------------- | -------- | ---------------- |
| `line`        | 基础直线 | 道路、河流、边界 |
| `arc`         | 2D 弧线  | 短距离流向       |
| `arc3d`       | 3D 弧线  | 长距离流向、航线 |
| `greatcircle` | 大圆航线 | 跨越半球的航线   |
| `wall`        | 墙/幕墙  | 3D 围栏效果      |

## 通用方法

线图层继承了所有图层的通用能力，以下是最常用的方法：

### 显示控制

```javascript
// 显示/隐藏图层
lineLayer.show();
lineLayer.hide();

// 设置图层绘制顺序
lineLayer.setIndex(5);

// 适配到数据范围
lineLayer.fitBounds();
```

### 事件监听

```javascript
// 点击线段
lineLayer.on('click', (e) => {
  console.log('线段数据:', e.feature);
});

// 鼠标悬停高亮
lineLayer.on('mousemove', (e) => {
  lineLayer.setActive(e.feature.id);
});
```

### 数据过滤

```javascript
// 只显示特定类型的线
lineLayer.filter((feature) => {
  return ['高速公路', '国道'].includes(feature.type);
});
```

> 📖 **完整文档**：查看 [图层通用方法和事件](./layer-common-api.md) 了解所有通用 API。

---

## 代码示例

### 基础用法 - 路径线

```javascript
import { LineLayer } from '@antv/l7';

const data = [
  {
    coordinates: [
      [120.19, 30.26],
      [120.2, 30.27],
      [120.21, 30.28],
    ],
    name: '路线1',
    type: 'A',
  },
];

scene.on('loaded', () => {
  const lineLayer = new LineLayer()
    .source(data, {
      parser: {
        type: 'json',
        coordinates: 'coordinates',
      },
    })
    .shape('line')
    .size(3)
    .color('#5B8FF9')
    .style({
      opacity: 0.8,
    });

  scene.addLayer(lineLayer);
});
```

### 多条线段

```javascript
const lines = [
  {
    coordinates: [
      [120.19, 30.26],
      [120.2, 30.27],
    ],
    name: '线路1',
    value: 100,
  },
  {
    coordinates: [
      [120.21, 30.28],
      [120.22, 30.29],
    ],
    name: '线路2',
    value: 200,
  },
];

const lineLayer = new LineLayer()
  .source(lines, {
    parser: {
      type: 'json',
      coordinates: 'coordinates',
    },
  })
  .shape('line')
  .size('value', [2, 10]) // 根据数值映射宽度
  .color('name', ['#5B8FF9', '#5AD8A6'])
  .style({
    opacity: 0.8,
  });

scene.addLayer(lineLayer);
```

### 虚线样式

```javascript
const lineLayer = new LineLayer()
  .source(data, {
    parser: {
      type: 'json',
      coordinates: 'coordinates',
    },
  })
  .shape('line')
  .size(2)
  .color('#5B8FF9')
  .style({
    lineType: 'dash', // 虚线类型: solid | dash
    dashArray: [5, 5], // 虚线间隔
    opacity: 0.8,
  });

scene.addLayer(lineLayer);
```

### 2D 弧线 - OD 流向

```javascript
const odData = [
  {
    from_lng: 120.19,
    from_lat: 30.26,
    to_lng: 121.47,
    to_lat: 31.23,
    value: 100,
  },
];

const arcLayer = new LineLayer()
  .source(odData, {
    parser: {
      type: 'json',
      x: 'from_lng',
      y: 'from_lat',
      x1: 'to_lng',
      y1: 'to_lat',
    },
  })
  .shape('arc')
  .size('value', [1, 5])
  .color('value', ['#5B8FF9', '#5AD8A6', '#FF6B3B'])
  .style({
    opacity: 0.8,
  });

scene.addLayer(arcLayer);
```

### 3D 弧线 - 城市迁徙

```javascript
const migrationLayer = new LineLayer()
  .source(migrationData, {
    parser: {
      type: 'json',
      x: 'from_lng',
      y: 'from_lat',
      x1: 'to_lng',
      y1: 'to_lat',
    },
  })
  .shape('arc3d')
  .size('count', [1, 5])
  .color('count', ['#5B8FF9', '#5AD8A6', '#FF6B3B', '#CF1D49'])
  .style({
    opacity: 0.8,
    sourceColor: '#5B8FF9', // 起点颜色
    targetColor: '#CF1D49', // 终点颜色
  });

scene.addLayer(migrationLayer);
```

### 大圆航线

```javascript
const flightLayer = new LineLayer()
  .source(flightData, {
    parser: {
      type: 'json',
      x: 'from_lng',
      y: 'from_lat',
      x1: 'to_lng',
      y1: 'to_lat',
    },
  })
  .shape('greatcircle') // 大圆航线，地球表面最短路径
  .size(2)
  .color('#6495ED')
  .style({
    opacity: 0.6,
  });

scene.addLayer(flightLayer);
```

### 带动画的轨迹

```javascript
const trajectoryLayer = new LineLayer()
  .source(pathData, {
    parser: {
      type: 'json',
      coordinates: 'path',
    },
  })
  .shape('line')
  .size(3)
  .color('#6495ED')
  .animate({
    enable: true,
    interval: 0.2, // 动画间隔
    duration: 5, // 动画持续时间
    trailLength: 0.2, // 轨迹长度比例
  })
  .style({
    opacity: 0.8,
  });

scene.addLayer(trajectoryLayer);
```

### 渐变色线条

```javascript
const gradientLineLayer = new LineLayer()
  .source(data, {
    parser: {
      type: 'json',
      coordinates: 'coordinates',
    },
  })
  .shape('line')
  .size(4)
  .color('#5B8FF9')
  .style({
    opacity: 0.8,
    lineGradient: true, // 开启渐变
    sourceColor: '#5B8FF9', // 起始颜色
    targetColor: '#CF1D49', // 结束颜色
  });

scene.addLayer(gradientLineLayer);
```

### 3D 墙效果

```javascript
const wallLayer = new LineLayer()
  .source(data, {
    parser: {
      type: 'json',
      coordinates: 'coordinates',
    },
  })
  .shape('wall')
  .size('height', [10, 100]) // 墙的高度
  .color('#5B8FF9')
  .style({
    opacity: 0.6,
  });

scene.addLayer(wallLayer);
```

## 数据格式要求

### 路径线数据格式

```json
[
  {
    "coordinates": [
      [120.19, 30.26],
      [120.2, 30.27],
      [120.21, 30.28]
    ],
    "name": "路线1",
    "type": "A",
    "value": 100
  }
]
```

### OD 数据格式

```json
[
  {
    "from_lng": 120.19,
    "from_lat": 30.26,
    "to_lng": 121.47,
    "to_lat": 31.23,
    "value": 100,
    "category": "A"
  }
]
```

### GeoJSON 线数据

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "线路1",
        "type": "A"
      },
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [120.19, 30.26],
          [120.2, 30.27],
          [120.21, 30.28]
        ]
      }
    }
  ]
}
```

使用 GeoJSON：

```javascript
lineLayer.source(geojsonData, {
  parser: {
    type: 'geojson',
  },
});
```

## 样式配置详解

### 基础样式

```javascript
layer.style({
  opacity: 0.8, // 透明度
  lineType: 'solid', // 线类型: solid | dash
  dashArray: [5, 5], // 虚线配置 [实线长度, 间隔长度]
});
```

### 渐变样式

```javascript
layer.style({
  lineGradient: true, // 开启渐变
  sourceColor: '#5B8FF9', // 起点颜色
  targetColor: '#CF1D49', // 终点颜色
});
```

### 动画配置

```javascript
layer.animate({
  enable: true, // 开启动画
  interval: 0.2, // 动画间隔，数值越小速度越快
  duration: 5, // 动画持续时间（秒）
  trailLength: 0.2, // 轨迹长度比例 0-1
});
```

## 常见问题

### 1. 线不显示

**检查清单**:

- ✅ 坐标数据是否正确（至少 2 个点）
- ✅ 线的宽度是否太小
- ✅ 颜色是否与背景相同
- ✅ 坐标是否在地图视野内

```javascript
// 调试代码
console.log('数据:', data);
layer.size(10); // 加粗线条
layer.color('#FF0000'); // 使用明显颜色
```

### 2. 弧线方向错误

OD 数据的起点和终点要明确：

```javascript
// 正确的配置
.source(data, {
  parser: {
    type: 'json',
    x: 'from_lng',    // 起点经度
    y: 'from_lat',    // 起点纬度
    x1: 'to_lng',     // 终点经度
    y1: 'to_lat'      // 终点纬度
  }
})
```

### 3. 动画不流畅

**优化方案**:

```javascript
// 1. 调整动画参数
layer.animate({
  enable: true,
  interval: 0.1, // 减小间隔
  duration: 3, // 缩短持续时间
  trailLength: 0.1, // 缩短轨迹长度
});

// 2. 减少数据量
const simplifiedData = data.filter((d, i) => i % 5 === 0);
```

### 4. 3D 弧线看不到

需要设置地图倾斜角度：

```javascript
const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 45, // 设置倾斜角度
    style: 'dark',
    center: [120, 30],
    zoom: 5,
  }),
});
```

## 高级用法

### 多图层组合 - 线 + 端点

```javascript
// 1. 绘制线
const lineLayer = new LineLayer()
  .source(odData, {
    parser: {
      type: 'json',
      x: 'from_lng',
      y: 'from_lat',
      x1: 'to_lng',
      y1: 'to_lat',
    },
  })
  .shape('arc')
  .size(2)
  .color('#6495ED');

// 2. 绘制起点
const startPoints = odData.map((d) => ({
  lng: d.from_lng,
  lat: d.from_lat,
}));

const startLayer = new PointLayer()
  .source(startPoints, {
    parser: { type: 'json', x: 'lng', y: 'lat' },
  })
  .shape('circle')
  .size(5)
  .color('#00FF00');

// 3. 绘制终点
const endPoints = odData.map((d) => ({
  lng: d.to_lng,
  lat: d.to_lat,
}));

const endLayer = new PointLayer()
  .source(endPoints, {
    parser: { type: 'json', x: 'lng', y: 'lat' },
  })
  .shape('circle')
  .size(5)
  .color('#FF0000');

scene.addLayer(lineLayer);
scene.addLayer(startLayer);
scene.addLayer(endLayer);
```

### 动态更新线数据

```javascript
// 更新数据
const newData = [...];
layer.setData(newData);

// 更新样式
layer.size(5);
layer.color('#FF0000');
scene.render();
```

## 相关技能

- [图层通用方法和事件](./layer-common-api.md)
- [场景初始化](../core/scene.md)
- [点图层](./point.md)
- [轨迹动画](../animation/layer-animation.md)
- [颜色映射](../visual/mapping.md)
- [事件交互](../interaction/events.md)

## 在线示例

查看更多示例: [L7 官方示例 - 线图层](https://l7.antv.antgroup.com/examples/line/path)
