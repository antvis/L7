# Layer Animation Guide

L7 图层动画和轨迹动画完整指南。

## 图层动画

### 数据更新动画

```javascript
// 基础数据更新
layer.setData(newData);

// 带动画的数据更新
layer.animate(true); // 开启动画
layer.setData(newData);
```

### 属性动画

```javascript
// 大小动画
layer.size('value', [5, 20]).animate({
  enable: true,
  interval: 0.1, // 时间间隔
  duration: 2, // 动画时长（秒）
  trailLength: 0.5, // 拖尾长度
});

// 颜色动画
layer.color('type', {
  values: ['#5B8FF9', '#5AD8A6'],
  animate: {
    duration: 2000,
    repeat: true,
  },
});
```

## 轨迹动画

### LineLayer 轨迹动画

```javascript
import { LineLayer } from '@antv/l7';

const pathData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: '路线1' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [120.19, 30.26],
          [120.2, 30.27],
          [120.21, 30.28],
          [120.22, 30.29],
        ],
      },
    },
  ],
};

const lineLayer = new LineLayer().source(pathData).shape('line').size(3).color('#5B8FF9').animate({
  enable: true,
  interval: 0.5, // 速度
  trailLength: 0.3, // 拖尾长度
  duration: 4, // 完整动画时长
});

scene.addLayer(lineLayer);
```

### PointLayer 运动点

```javascript
// 运动的点
const pointLayer = new PointLayer()
  .source(pathData)
  .shape('circle')
  .size(10)
  .color('#FF6B3B')
  .animate({
    enable: true,
    interval: 0.5,
    duration: 4,
  });
```

### 组合使用：路径 + 运动点

```javascript
// 路径
const pathLayer = new LineLayer().source(pathData).shape('line').size(2).color('#ccc');

// 运动的点
const movingPoint = new PointLayer()
  .source(pathData)
  .shape('circle')
  .size(8)
  .color('#FF6B3B')
  .animate({
    enable: true,
    interval: 0.5,
    duration: 4,
  });

// 轨迹线（拖尾）
const trailLine = new LineLayer().source(pathData).shape('line').size(3).color('#5B8FF9').animate({
  enable: true,
  interval: 0.5,
  trailLength: 0.5,
  duration: 4,
});

scene.addLayer(pathLayer);
scene.addLayer(trailLine);
scene.addLayer(movingPoint);
```

## ArcLayer 弧线动画

```javascript
import { LineLayer } from '@antv/l7';

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
  .size(2)
  .color('#5B8FF9')
  .animate({
    enable: true,
    interval: 0.3,
    trailLength: 0.4,
    duration: 3,
  })
  .style({
    opacity: 0.8,
  });

scene.addLayer(arcLayer);
```

## 时序数据动画

### 时间轴控制

```javascript
// 带时间戳的数据
const timeSeriesData = [
  { lng: 120.19, lat: 30.26, time: 1609459200000, value: 10 },
  { lng: 120.2, lat: 30.27, time: 1609545600000, value: 20 },
  { lng: 120.21, lat: 30.28, time: 1609632000000, value: 30 },
];

let currentTime = timeSeriesData[0].time;

function updateVisualization(time) {
  const filteredData = timeSeriesData.filter((d) => d.time <= time);
  layer.setData(filteredData);
}

// 播放动画
let animationTimer = setInterval(() => {
  currentTime += 86400000; // 增加一天
  updateVisualization(currentTime);

  if (currentTime >= timeSeriesData[timeSeriesData.length - 1].time) {
    clearInterval(animationTimer);
  }
}, 100);
```

## 相机动画

### 飞行动画

```javascript
// 飞到指定位置
scene.flyTo({
  center: [120.19, 30.26],
  zoom: 12,
  pitch: 45,
  bearing: 30,
  duration: 2000, // 动画时长（毫秒）
});
```

### 环绕动画

```javascript
let bearing = 0;

function rotate() {
  bearing = (bearing + 0.5) % 360;
  scene.setBearing(bearing);
  requestAnimationFrame(rotate);
}

rotate();
```

## 动画控制

### 开始/暂停/重置

```javascript
// 开始动画
layer.animate(true);

// 暂停动画
layer.animate(false);

// 重置并重新开始
layer.animate(false);
layer.animate(true);
```

### 动画事件

```javascript
layer.on('animatestart', () => {
  console.log('动画开始');
});

layer.on('animateend', () => {
  console.log('动画结束');
});
```

## 性能优化

### 1. 降低数据密度

```javascript
// 对复杂路径进行简化
import * as turf from '@turf/turf';

const simplified = turf.simplify(pathData, {
  tolerance: 0.01,
  highQuality: false,
});
```

### 2. 控制动画数量

```javascript
// 限制同时播放的动画数量
const MAX_ANIMATIONS = 10;

if (scene.getLayers().filter((l) => l.isAnimating()).length < MAX_ANIMATIONS) {
  layer.animate(true);
}
```

### 3. 使用 requestAnimationFrame

```javascript
function animate() {
  // 更新状态
  updateData();

  requestAnimationFrame(animate);
}

animate();
```

## 完整示例：出租车轨迹

```javascript
import { Scene, LineLayer, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [120.19, 30.26],
    zoom: 13,
  }),
});

// 轨迹数据
const trajectoryData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { taxi_id: 'T001', speed: 40 },
      geometry: {
        type: 'LineString',
        coordinates: [
          [120.19, 30.26],
          [120.195, 30.265],
          [120.2, 30.27],
          [120.205, 30.275],
          [120.21, 30.28],
        ],
      },
    },
  ],
};

scene.on('loaded', () => {
  // 1. 历史路径（灰色）
  const historyPath = new LineLayer().source(trajectoryData).shape('line').size(3).color('#ddd');

  // 2. 运动轨迹（蓝色，带拖尾）
  const movingTrail = new LineLayer()
    .source(trajectoryData)
    .shape('line')
    .size(4)
    .color('#5B8FF9')
    .animate({
      enable: true,
      interval: 0.3,
      trailLength: 0.4,
      duration: 6,
    });

  // 3. 运动的点（出租车）
  const taxi = new PointLayer()
    .source(trajectoryData)
    .shape('circle')
    .size(12)
    .color('#FF6B3B')
    .animate({
      enable: true,
      interval: 0.3,
      duration: 6,
    });

  scene.addLayer(historyPath);
  scene.addLayer(movingTrail);
  scene.addLayer(taxi);
});
```

## 相关文档

- [line.md](../layers/line.md) - LineLayer 详细配置
- [point.md](../layers/point.md) - PointLayer 详细配置
- [events.md](../interaction/events.md) - 事件处理
