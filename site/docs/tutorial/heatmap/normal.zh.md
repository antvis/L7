---
title: 经典热力图
order: 0
---

<embed src="@/docs/api/common/style.md"></embed>

热力图是地图可视化场景中十分常见的需求。在区域范围内数据具有的一定热度分级分布情况的聚合面状现象，常用于描述人群分布、密度和变化趋势等。

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*QstiQq4JBOIAAAAAAAAAAABkARQnAQ'>
  </div>
</div>

### 实现

下面我们来介绍如何绘制一个经典热力图。

- 你可以在 `L7` 官网上找到[在线案例](/examples/heatmap/heatmap/#heatmap)

```javascript
import { Scene, HeatmapLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'dark',
    center: [127.5671666579043, 7.445038892195569],
    zoom: 2.632456779444394,
  }),
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json')
    .then((res) => res.json())
    .then((data) => {
      const layer = new HeatmapLayer({})
        .source(data)
        .shape('heatmap')
        .size('mag', [0, 1.0]) // weight映射通道
        .style({
          intensity: 2,
          radius: 20,
          rampColors: {
            colors: ['#FF4818', '#F7B74A', '#FFF598', '#91EABC', '#2EA9A1', '#206C7C'].reverse(),
            positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
          },
        });
      scene.addLayer(layer);
    });
});
```

### source

经典热力图只支持点数据作为数据源，数据格式支持 `csv`、`json`、`geojson`。

```js
const source = new Source([{
  lng: 120, lat: 30
},...], {
  parser: {
    type: 'json',
    x: 'lng',
    y: 'lat'
  }
})
```

### shape

经典热力图的 `shape` 为常量 `heatmap`。

### size

我们需要将值映射到 `[0, 1]` 的值域空间。

- `field`: 热力图权重字段
- `values`: 数据映射区间 热力图显示 `[0, 1]` 效果最佳

```javascript
layer.size('weight', [0, 1]);
```

### color

热力图通过 `style` 的指定参数配置颜色。

### style

- `intensity` 全局热力权重，推荐权重范围 `1 - 5`。
- `radius`   热力半径，单位像素。
- `rampColors` 色带参数。

#### rampColors

- `colors`  颜色数组
- `positions` 数据区间

配置值域映射颜色的色带，值域的范围为 `[0 - 1]`, 对应的我们需要为每一个 `position` 位置设置一个颜色值。

⚠️ colors, positions 的长度要相同

```javascript
layer.style({
  rampColors: {
    colors: ['#FF4818', '#F7B74A', '#FFF598', '#91EABC', '#2EA9A1', '#206C7C'],
    positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
  },
});
```
