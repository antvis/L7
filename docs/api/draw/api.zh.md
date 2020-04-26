---
title: Draw 实例
order: 2
---

### Draw Type

可以不依赖 Draw UI 组件，独立的使用每一个 Draw

#### DrawCircle

绘制圆形

```javascript
import { DrawCircle } from '@antv/l7-draw';
const drawCircle = new DrawCircle(scene);
drawCircle.enable();
```

#### DrawRect

绘制四边形

```javascript
import { DrawRect } from '@antv/l7-draw';
const drawRect = new DrawRect(scene);
drawRect.enable();
```

#### DrawLine

绘制路径

```javascript
import { DrawLine } from '@antv/l7-draw';
const drawLine = new DrawLine(scene);
drawLine.enable();
```

#### DrawPoint

绘制点

```javascript
import { DrawPoint } from '@antv/l7-draw';
const drawPoint = new DrawPoint(scene);
drawPoint.enable();
```

#### DrawPolygon

绘制多边形

```javascript
import { DrawPolygon } from '@antv/l7-draw';
const drawPoint = new DrawPolygon(scene);
drawPoint.enable();
```

### 配置项 DrawOption

- editEnable `boolean` 是否允许编辑
- selectEnable `boolean` 是否允许选中
- data `geojson` 传入数据

### 方法

#### enable

开始编辑，绘制完成之后会自动结束。

#### disable

结束编辑

### 事件

#### draw.create

绘制完成时触发该事件

#### draw.delete

图形删除时触发该事件

#### draw.update

图形更新时触发该事件，图形的平移，顶点的编辑
