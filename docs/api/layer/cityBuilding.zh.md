---
title: 城市建筑
order: 6
---
## 使用

```javascript
import { CityBuildingLayer } from '@antv/l7';

```
### source 

同 [PolygonLayer](./polygon_layer/extrude)

### size

 同 [PolygonLayer](./polygon_layer/extrude)

### color 

[PolygonLayer](./polygon_layer/extrude)

### animate
开启动画效果
```javascript
layer.animate(true)
```
### style 
  - baseColor 楼房颜色,
  - windowColor: 窗户颜色,
  - brightColor: 点亮窗户颜色

其他style配置项同

[layer#style](./layer#style)

#### 完整代码

``` javascript

 const pointLayer = new CityBuildingLayer();
    pointLayer
      .source(await response.json())
      .size('floor', [0, 500])
      .color('rgba(242,246,250,1.0)')
      .animate({
        enable: true,
      })
      .style({
        opacity: 1.0,
        baseColor: 'rgb(16,16,16)',
        windowColor: 'rgb(30,60,89)',
        brightColor: 'rgb(255,176,38)',
      });
    scene.addLayer(pointLayer);
```
