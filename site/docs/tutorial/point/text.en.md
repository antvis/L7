---
title: text
order: 6
---

<embed src="@/docs/api/common/style.md"></embed>

Point layers support drawing text labels.

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*7blvQ4v7Q1UAAAAAAAAAAABkARQnAQ'>
  </div>
</div>

### accomplish

Let's introduce how to draw a common text annotation map.

- you can`L7`Found on the official website[Online case](/examples/point/text/#point_text)

```javascript
import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [110, 36],
    style: 'light',
    zoom: 3,
  }),
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/rmsportal/oVTMqfzuuRFKiDwhPSFL.json')
    .then((res) => res.json())
    .then((data) => {
      const pointLayer = new PointLayer({})
        .source(data.list, {
          parser: {
            type: 'json',
            x: 'j',
            y: 'w',
          },
        })
        .shape('m', 'text')
        .size(12)
        .color('w', ['#0e0030', '#0e0030', '#0e0030'])
        .style({
          textAnchor: 'center', // The position of the text relative to the anchor point center|left|right|top|bottom|top-left
          textOffset: [0, 0], // Offset of text relative to anchor point [horizontal, vertical]
          spacing: 2, // character spacing
          padding: [1, 1], // Text bounding box padding [horizontal, vertical], affects the collision detection results and prevents adjacent texts from being too close
          stroke: '#ffffff', // stroke color
          strokeWidth: 0.3, // Stroke width
        });
      scene.addLayer(pointLayer);
    });
});
```

### shape(field: name: shapeType: 'text'): ILayer

- `field`Labeled field name.
- `shapeType`The default value is`text`。

```javascript
layer.shape('name', 'text');
```

### style

- textAnchor `string`The position of the text relative to the anchor point`'right' | 'top-right' | 'left' | 'bottom-right' | 'left' | 'top-left' | 'bottom-left' | 'bottom' | 'bottom-right' | 'bottom-left' | 'top' | 'top-right' | 'top-left' | 'center';`
- padding:`number`Text bounding box padding \[horizontal, vertical], affects the collision detection results and prevents adjacent text from being too close
- spacing: number text spacing
- stroke:`string`; stroke color
- strokeWidth `number`stroke width
- strokeOpacity `number`stroke transparency
- fontWeight `string`Font weight
- fontFamily `string`Font size
- textOffset `[number, number]`text offset
- textAllowOverlap:`boolean`Whether to allow text masking
- raisingHeight sets the raising height of the text label
