---
title: API
---
地图绘制组件，支持点、线、面， 圆、矩形、的绘制编辑。

## 使用

**using modules**

```javascript
import { DrawControl } from '@antv/l7-draw';
```

**CDN 版本引用**

```html
<head>
  <! --引入最新版的L7-Draw -->
  <script src="https://unpkg.com/@antv/l7-draw"></script>
</head>
```

## 参数

```javascript
const control = new DrawControl(scene, option);
```

#### scene

scene 对象

#### options

control 配置项

| name     | Type                                          | Default    | Description                     |
| -------- | --------------------------------------------- | ---------- | ------------------------------- |
| position | `bottomright、topright、 bottomleft’ topleft` | `topright` | 组件位置                        |
| layout   | `horizontal、 vertical`                       | `vertical` | 组件布局 支持水平和垂直两种布局 |
| controls | `controlOptions`                              |            | 设置 UI 组件添加哪些绘制工具    |
| style    |                                               |            | 地图绘制样式                    |

**controlOptions**
UI 组件配置项

- point `boolean | drawOption` 绘制点工具配置
- line `boolean | drawOption` 绘制线工具配置
- polygon `boolean | drawOption` 绘制面工具配置
- circle `boolean | drawOption` 绘制圆工具配置
- rect `boolean | drawOption` 绘制矩形工具配置
- delete `boolean | drawOption` 添加删除工具

默认配置

```
  {
    point: true,
    line: true,
    polygon: true,
    rect: true,
    circle: true,
    delete: true
  }
```

示例

```
{
    point: false,
    line: {
      editEnable: false,
    },
    polygon: true,
    rect: true,
    circle: true,
    delete: false
```

### 添加到地图

```javascript
scene.addControl(control);
```

### 从地图中移除

```javascript
scene.removeControl(control);
```

## Draw Type

可以不依赖 Draw UI 组件，独立的使用每一个 Draw

### DrawCircle

绘制圆形

```javascript
import { DrawCircle } from '@antv/l7-draw';
const drawCircle = new DrawCircle(scene);
drawCircle.enable();
```

### DrawRect

绘制四边形

```javascript
import { DrawRect } from '@antv/l7-draw';
const drawRect = new DrawRect(scene);
drawRect.enable();
```

### DrawLine

绘制路径

```javascript
import { DrawLine } from '@antv/l7-draw';
const drawLine = new DrawLine(scene);
drawLine.enable();
```

### DrawPoint

绘制点

```javascript
import { DrawPoint } from '@antv/l7-draw';
const drawPoint = new DrawPoint(scene);
drawPoint.enable();
```

### DrawPolygon

绘制多边形

```javascript
import { DrawPolygon } from '@antv/l7-draw';
const drawPoint = new DrawPolygon(scene);
drawPoint.enable();
```

### 配置项 DrawOption

- editEnable boolean 是否允许编辑
- selectEnable boolean 是否允许选中

## 方法

### enable

开始编辑，绘制完成之后会自动结束。

### disable

结束编辑

## 事件

### draw.create

绘制完成时触发该事件

### draw.delete

图形删除时触发该事件

### draw.update

图形更新时触发该事件，图形的平移，顶点的编辑

### style

- active 绘制过程中高亮颜色
- normal 正常显示状态

```javascript
const style = {
  active: {
    point: {
      type: 'PointLayer',
      shape: 'circle',
      color: '#fbb03b',
      size: 5,
      style: {
        stroke: '#fff',
        strokeWidth: 2,
      },
    },
    line: {
      type: 'LineLayer',
      shape: 'line',
      color: '#fbb03b',
      size: 1,
      style: {
        opacity: 1,
        lineType: 'dash',
        dashArray: [2, 2],
      },
    },
    polygon: {
      shape: 'fill',
      color: '#fbb03b',
      style: {
        opacity: 0.1,
        stroke: '#fbb03b',
        strokeWidth: 1,
        strokeOpacity: 1,
        lineType: 'dash',
        dashArray: [2, 2],
      },
    },
  },
  normal: {
    polygon: {
      type: 'PolygonLayer',
      shape: 'fill',
      color: '#3bb2d0',
      style: {
        opacity: 0.1,
        stroke: '#3bb2d0',
        strokeWidth: 1,
        strokeOpacity: 1,
        lineType: 'solid',
        dashArray: [2, 2],
      },
    },
    line: {
      type: 'LineLayer',
      shape: 'line',
      size: 1,
      color: '#3bb2d0',
      style: {
        opacity: 1,
      },
    },
    point: {
      type: 'PointLayer',
      shape: 'circle',
      color: '#3bb2d0',
      size: 3,
      style: {
        stroke: '#fff',
        strokeWidth: 2,
      },
    },
  },
  normal_point: {
    type: 'PointLayer',
    shape: 'circle',
    color: '#3bb2d0',
    size: 3,
    style: {
      stroke: '#fff',
      strokeWidth: 2,
    },
  },
  mid_point: {
    point: {
      type: 'PointLayer',
      shape: 'circle',
      color: '#fbb03b',
      size: 3,
      style: {},
    },
  },
};
```
