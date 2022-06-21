---
title: 城市建筑
order: 6
---

`markdown:docs/common/style.md`

## 简介

`CityBuildingLayer` 用于构建城市建筑 3D 模型, 展示城市建筑

## 使用

```javascript
import { CityBuildingLayer } from '@antv/l7';
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_e7e1c6/afts/img/A*LoxeSZHuqXwAAAAAAAAAAAAAARQnAQ'>

### animate

是否开启动画效果, 仅支持`boolean` 或`enable: boolean` 配置项

```javascript
layer.animate(true);

layer.animatte({
  enable: true,
});
```

✨ 在开启 animate 后默认会打开点亮窗户的动画  
🌟 开启 animate 动画是打开扫光动画的前提

### style

- baseColor 楼房颜色,
- windowColor: 窗户颜色,
- brightColor: 点亮窗户颜色
- sweep: 圆形扫光扩散动画相关配置项
  - enable: 是否开启扫光扩散
  - sweepRadius: 扩散半径
  - sweepCenter: 扩散中心店坐标
  - sweepColor: 扩散颜色
  - sweepSpeed: 扩散速度
- baseColor: 开启 sweep 时的基础颜色

其他 style 配置项同

[baselayer#style](../base#style)

## 自定义动画频率

自定义动画频率需要 关闭默认动画，通过 `setLight` 方法不断更新时间

### setLight(time)

参数
time : 时间 毫秒

```js
import { CityBuildingLayer, Scene } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    style: 'dark',
    center: [121.507674, 31.223043],
    pitch: 65.59312320916906,
    zoom: 15.4,
    minZoom: 15,
    maxZoom: 18,
  }),
});
const buildingLayer = new CityBuildingLayer();
buildingLayer.animate(false);

let i = 0;
function step() {
  buildingLayer.setLight(i++);
  scene.render();
  requestAnimationFrame(step);
}

scene.on('loaded', () => {
  step();
});
```

#### demo

```javascript
import { Scene, CityBuildingLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'dark',
    center: [120.173104, 30.244072],
    pitch: 70.41138037735848,
    zoom: 17.18,
    rotation: 2.24, // 358.7459759480504
    minZoom: 14,
  }),
});

scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/rmsportal/ggFwDClGjjvpSMBIrcEx.json')
    .then((res) => res.json())
    .then((data) => {
      const layer = new CityBuildingLayer({
        zIndex: 0,
      });
      layer.source(data);
      scene.addLayer(layer);
    });
});
```

[在线案例](../../../examples/gallery/animate#build_sweep)
