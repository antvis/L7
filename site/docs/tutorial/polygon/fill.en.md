---
title: fill
order: 0
---

<embed src="@/docs/api/common/style.md"></embed>

The simplest representation of a geometry layer on a map is a fill map, which fills a specified area with a specified color.

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*4Kp4Qp00kq4AAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

### accomplish

Let's introduce how to draw a simple filled diagram.

- you can`L7`Found on the official website[Online case](/examples/polygon/fill#usa)

```javascript
import { Scene, PolygonLayer, LineLayer, Popup } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [-96, 37.8],
    zoom: 3,
  }),
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/basement_prod/d36ad90e-3902-4742-b8a2-d93f7e5dafa2.json')
    .then((res) => res.json())
    .then((data) => {
      const color = [
        'rgb(255,255,217)',
        'rgb(237,248,177)',
        'rgb(199,233,180)',
        'rgb(127,205,187)',
        'rgb(65,182,196)',
        'rgb(29,145,192)',
        'rgb(34,94,168)',
        'rgb(12,44,132)',
      ];
      const layer = new PolygonLayer({})
        .source(data)
        .scale('density', {
          type: 'quantile',
        })
        .color('density', color)
        .shape('fill')
        .active(true);
      const layer2 = new LineLayer({
        zIndex: 2,
      })
        .source(data)
        .color('#fff')
        .active(true)
        .size(1)
        .style({
          lineType: 'dash',
          dashArray: [2, 2],
        });
      scene.addLayer(layer);
      scene.addLayer(layer2);
    });
});
```

### source

It is recommended to use the standard geometry layer`GeoJSON`data.

### shape

Draw a filled diagram, the shape is`fill`Constant, data mapping is not supported

```javascript
layer.shape('fill');
```

### size

Fill image does not need to be set`size`;

### style

- `opacityLinear`Sets the radial gradient of the geometric fill.

```javascript
style({ opacity Linear: { enable: true, // true - false dir: 'in', // n - out },
});
```

[radial gradient in](/examples/polygon/fill#linear_in)

<img width="60%" style="display: block;margin: 0 auto;" alt="面图层填充图" src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*XjT5T4cT_CYAAAAAAAAAAAAAARQnAQ">

[radial gradient out](/examples/polygon/fill#linear_out)

<img width="60%" style="display: block;margin: 0 auto;" alt="面图层填充图" src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*Ob62Q7JDpZ4AAAAAAAAAAAAAARQnAQ">

- `raisingHeight`set up`3D`The elevation of the fill pattern.
