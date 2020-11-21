---
title: 城市建筑
order: 6
---

`markdown:docs/common/style.md`

## 使用

```javascript
import { CityBuildingLayer } from '@antv/l7';
```

### animate

开启动画效果

```javascript
layer.animate(true);
```

### style

- baseColor 楼房颜色,
- windowColor: 窗户颜色,
- brightColor: 点亮窗户颜色

其他 style 配置项同

[layer#style](./layer#style)

## 自定义动画频率

自定义动画频率需要 关闭默认动画，通过 setLight 方法不断更新时间

```javascript
layer.animate(false);
```

### setLight(time)

参数
time : 时间 毫秒

#### 完整代码

```javascript
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

`markdown:docs/common/layer/base.md`
