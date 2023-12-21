---
title: Scale
order: 4
---

This control displays the ratio of distances on the map to the corresponding distances on the ground.

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*r3iSQI4SekYAAAAAAAAAAAAAARQnAQ" width="400"/>

## use

[Example](/examples/component/control#scale)

```ts
import { Scene, Scale } from '@antv/l7';

const scene = new Scene({
  //...
});

scene.on('loaded', () => {
  const scale = new Scale({
    zoomInTitle: '放大',
    zoomOutTitle: '缩小',
  });
  scene.addControl(scale);
});
```

## Configuration

| name           | illustrate                                                               | type      | default value |
| -------------- | ------------------------------------------------------------------------ | --------- | ------------- |
| lockWidth      | Whether to fix the container width                                       | `boolean` | `true`        |
| maxWidth       | The maximum width of the component's container                           | `number`  | `100`         |
| metric         | exhibit**km**format scale                                                | `boolean` | `true`        |
| imperial       | exhibit**mile**format scale                                              | `boolean` | `false`       |
| updateWhenIdle | Whether to only update the scale after dragging and zooming are complete | `boolean` | `false`       |

<embed src="@/docs/api/common/control/api.en.md"></embed>

## method

<embed src="@/docs/api/common/control/method.en.md"></embed>

## event

<embed src="@/docs/api/common/control/event.en.md"></embed>
