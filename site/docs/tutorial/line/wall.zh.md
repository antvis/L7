---
title: 地理围墙
order: 5
---

地理围墙在原有线图层的基础上赋予了高度的概念，其他的使用和普通的线图保持一致。

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*mLfxTb4mI6AAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

### 实现

下面我们来介绍如何绘制简单的地理围墙。

- 你可以在 `L7` 官网上找到[在线案例](/zh/examples/line/wall/hangzhou-wall/)

## 使用

```javascript
import { Scene, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [119.297868, 29.732983],
    zoom: 7.11,
    rotation: 1.22,
    pitch: 45.42056074766357,
    style: 'dark',
  }),
});

scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/bmw-prod/93a55259-328e-4e8b-8dc2-35e05844ed31.json')
    .then((res) => res.json())
    .then((data) => {
      const layer = new LineLayer({}).source(data).size(40).shape('wall').style({
        opacity: 1,
        sourceColor: '#0DCCFF',
        targetColor: 'rbga(255,255,255, 0)',
      });
      scene.addLayer(layer);
    });
});
```

### shape

为了绘制地理围墙，我们需要将 `shape` 的参数设置成 `wall`。

<!-- include: ../../api/common/features/animate.zh.md -->

### style

<!-- include: ../../api/common/features/linear.zh.md -->

🌟 目前渐变色的方向为垂直向上

<!-- include: ../../api/common/features/texture.zh.md -->

🌟 地理围栏支持了新的样式参数 iconStepCount

- 纹理间隔只有在开启纹理的时候才会生效
- 纹理间隔支持配置纹理之间的间距
- 纹理间隔需要和纹理间距配合使用

```javascript
.style({
  lineTexture: true, // 开启线的贴图功能
  iconStep: 40, // 设置贴图纹理的间距
  iconStepCount: 4
})
```

<img width="80%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*3f8ORIbjJmkAAAAAAAAAAAAAARQnAQ'>

#### heightfixed

`wall` 支持了固定高度配置 `heightfixed`。

```javascript
 .style({
     heightfixed: true // 默认为 false，开启后实际世界高度不变（注意调整尺寸）
 })
```
