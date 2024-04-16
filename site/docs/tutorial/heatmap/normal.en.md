---
title: heatmap
order: 0
---

<embed src="@/docs/api/common/style.md"></embed>

Heat maps are a very common requirement in map visualization scenarios. The aggregate surface phenomenon of a certain degree of heat distribution within a region is often used to describe crowd distribution, density, and changing trends.

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*QstiQq4JBOIAAAAAAAAAAABkARQnAQ'>
  </div>
</div>

### accomplish

Let's introduce how to draw a classic heat map.

- you can found [Online case](/examples/heatmap/heatmap/#heatmap) on the `L7` official website

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

Classic heat maps only support point data as the data source, and the data format supports`csv`、`json`、`geojson`。

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

Classic heat map`shape`is a constant`heatmap`。

### size

We need to map the value to`[0, 1]`value range space.

- `field`: Heat map weight field
- `values`: Data mapping interval heat map display`[0, 1]`best effect

```javascript
layer.size('weight', [0, 1]);
```

### color

Heatmap passed`style`The specified parameters configure the color.

### style

- `intensity`Global thermal weight, recommended weight range`1 - 5`。
- `radius`Thermal radius, unit pixel.
- `rampColors`Ribbon parameters.

#### rampColors

- `colors`Color array
- `positions`data interval

Configure the color band of the value range mapping color. The range of the value range is`[0 - 1]`, correspondingly we need to provide each`position`Position sets a color value.

⚠️ colors, positions must be the same length

```javascript
layer.style({
  rampColors: {
    colors: ['#FF4818', '#F7B74A', '#FFF598', '#91EABC', '#2EA9A1', '#206C7C'],
    positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
  },
});
```
