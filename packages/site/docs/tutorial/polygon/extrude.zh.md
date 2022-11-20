---
title: 3D 填充图
order: 1
---
<embed src="@/docs/common/style.md"></embed>


几何体图层在地图上除了平面的填充图，还可以是有高度的几何体块。

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*yxRiTJDOrS8AAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

### 实现

下面我们来介绍如何绘制一个简单的 `3D` 填充图。

- 你可以在 `L7` 官网上找到[在线案例](/examples/polygon/3d/#polygonstylemap)

```javascript
import { Scene, PolygonLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'dark',
    pitch: 50,
    center: [ 118.8, 32.056 ],
    zoom: 10
  })
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/bmw-prod/94763191-2816-4c1a-8d0d-8bcf4181056a.json')
    .then(res => res.json())
    .then(data => {
      const filllayer = new PolygonLayer({
        name: 'fill',
        zIndex: 3
      })
        .source(data)
        .shape('extrude')
        .color('unit_price', [
        '#87CEFA',
        '#00BFFF',
        '#7FFFAA',
        '#00FF7F',
        '#32CD32',
        '#F0E68C',
        '#FFD700',
        '#FF7F50',
        '#FF6347',
        '#FF0000'
      ])
        .size('unit_price', unit_price => unit_price * 50)
        .style({
          opacity: [ 'unit_price', [ 0, 1 ]],
          pickLight: true
        })
      scene.addLayer(filllayer);
    });
});

```

### source

几何体图层推荐使用标准的 `GeoJSON` 数据。

### shape

3D Polygon 将多边形沿 Z 轴向上拉伸

- extrude 常量不支持数据映射

```javascript
layer.shape('extrude');
```

### size

size 代表拉伸的高度，支持数据映射

```javascript
layer.size(10); // 高度设置成常量
layer.size('floor', [0, 2000]); // 根据floor字段进行数据映射默认为线
layer.size('floor', (floor) => {
  // 通过回调函数设置size
  return floor * 2;
});
```

### style

- `pickLight` 设置 3D 填充图的拾取高亮色是否计算光照。

`pickLight` 默认为 `false` 表示对拾取的颜色不进行光照计算，开启后会增加部分额外的计算。

```javascript
style({
  pickLight: true, //  默认为 false
});
```

- `heightFixed` 设置 `3D` 填充图的高度时候固定。

默认 `3D` 填充图的高度会和 `zoom` 的层级相关，并以此来保持图形高度的像素长度不变，而在某些情况下我们需要保持图形的实际高度不变而不是像素高度不变。

```javascript
style({
  heightfixed: true, //  默认为 false
});
```

🌟 在 v2.7.6 版本开始支持。

[在线案例](/examples/react/covid#covid_extrude)

- `raisingHeight` 设置 `3D` 填充图的抬升高度。

🌟 设置抬升高度的前提是 `heightfixed` 为 `true`。  
🌟 在 v2.8.17 版本开始支持。

<img width="40%" style="display: block;margin: 0 auto;" alt="面图层填充图" src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*D8GeSKNZxWIAAAAAAAAAAAAAARQnAQ">

[在线案例](/examples/polygon/3d#floatmap)

- `mapTexture` 设置 `3D` 填充图的顶面纹理。
  🌟 在设置 `mapTexture` 的时候允许用户配置侧面的渐变色。
  🌟 在 v2.8.17 版本开始支持。

<img width="40%" style="display: block;margin: 0 auto;" alt="面图层填充图" src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*K18EQZoe4awAAAAAAAAAAAAAARQnAQ">

```javascript
const provincelayer = new PolygonLayer({})
  .source(data)
  .size(150000)
  .shape('extrude')
  .color('#0DCCFF')
  .style({
    heightfixed: true,
    pickLight: true,
    raisingHeight: 200000,
    mapTexture:
      'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*0tmIRJG9cQQAAAAAAAAAAAAAARQnAQ',
    sourceColor: '#333',
    targetColor: '#fff',
  });
```

- `topsurface`: `boolean`
  控制顶面的显隐，默认为 `true`。

- `sidesurface`: `boolean`
  控制侧面的显隐，默认为 `true`。

[在线案例](/examples/polygon/3d#texture3D)
