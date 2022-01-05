---
title: 大圆弧线图
order: 5
---

`markdown:docs/common/style.md`
将两个点的连线绘制成弧形，绘制的弧线可以是贝塞尔曲线，大圆航线，通常用来表示两种地理事物关系和联系，或者人口迁移，物流起点目的地等

## 使用

### 数据

绘制弧线只需提供起止点坐标即可（起止点调换位置，弧线的形状会对称相反，飞线动画的方向也会相反）

```javascript
source(data, {
  parser: {
    type: 'csv',
    x: 'lng1',
    y: 'lat1',
    x1: 'lng2',
    y1: 'lat2',
  },
});
```

### shape

弧线支持三种弧线算法

- arc 绘制弧线 通过贝塞尔曲线算法技术弧线
- greatcircle 大圆航线，地图两个点的最近距离不是两个点连线，而是大圆航线
- arc3d 3d 弧线地图 3D 视角

### animate

#### 开启关闭动画

```javascript
layer.animate(true);
layer.animate(false);
```

#### 设置动画参数

- duration 动画时间 单位(s)秒
- interval 轨迹间隔, 取值区间 0 - 1
- trailLength 轨迹长度 取值区间 0 - 1

```javascript
layer.animate({
  duration: 4,
  interval: 0.2,
  trailLength: 0.1,
});
```

##### 参数动画介绍

L7 目前动画参数为相对单位，我们默认一条线段的长度为 1
![L7 动画参数](https://gw.alipayobjects.com/mdn/rms_855bab/afts/img/A*IBBfSIkb51cAAAAAAAAAAABkARQnAQ)

如果 interval = 0.2,则一条轨迹将会分成 5 段，如果 interval = 0.5 则为两段。

### arc style 额外参数控制

在 arc 弧线的 style 方法中支持有额外的参数，可以对弧线样式进行更细微的调整。

#### segmentNumber 弧线分段数

arc 图层的弧线默认分段数是 30，然而有有些时候用户并不需要这么多的分段数，适当降低分段数量可以在保证效果的情况下提高性能。

```javascript
const layer = new LineLayer({})
  .source(data, {
    parser: {
      type: 'csv',
      x: 'lng1',
      y: 'lat1',
      x1: 'lng2',
      y1: 'lat2',
    },
  })
  .size(1)
  .shape('arc')
  .color('#8C1EB2')
  .style({
    segmentNumber: 15,
  });
```

#### thetaOffset 弧度参数

thetaOffset 参数 表示 arc 弧线的弧度，默认值是 0.314

```javascript
const layer = new LineLayer({})
  .source(data, {
    parser: {
      type: 'csv',
      x: 'lng1',
      y: 'lat1',
      x1: 'lng2',
      y1: 'lat2',
    },
  })
  .size(1)
  .shape('arc')
  .color('#8C1EB2')
  .style({
    thetaOffset: 0.35,
  });
```

### 示例代码

```javascript
const layer = new LineLayer({})
  .source(data, {
    parser: {
      type: 'csv',
      x: 'lng1',
      y: 'lat1',
      x1: 'lng2',
      y1: 'lat2',
    },
  })
  .size(1)
  .shape('arc')
  .color('#8C1EB2')
  .style({
    opacity: 0.8,
  });
```

### 设置渐变色

线图层通过在 style 中设置起始颜色和终点颜色来设置颜色渐变，渐变色的优先级比 color 方法设置的颜色更高。

```javascript
const layer = new LineLayer({})
  .source(data, {
    parser: {
      type: 'csv',
      x: 'lng1',
      y: 'lat1',
      x1: 'lng2',
      y1: 'lat2',
    },
  })
  .size(1)
  .shape('arc')
  .color('#8C1EB2')
  .style({
    sourceColor: '#f00', // 起点颜色
    targetColor: '#0f0', // 终点颜色
  });
```

### demo 示例

[弧线 demo](../../../examples/gallery/basic#arcCircle)

`markdown:docs/common/layer/base.md`
