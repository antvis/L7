---
title: Zoom
order: 3
---

Used to control the map**enlarge**and**zoom out**control, and when the map reaches the maximum or minimum zoom ratio, the corresponding zoom button is disabled.

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*CJx3Tby-XlEAAAAAAAAAAAAAARQnAQ" width="400"/>

## use

[Example](/examples/component/control#zoom)

```ts
import { Scene, Zoom } from '@antv/l7';

const scene = new Scene({
  //...
});

scene.on('loaded', () => {
  const zoom = new Zoom({
    zoomInTitle: '放大',
    zoomOutTitle: '缩小',
  });
  scene.addControl(zoom);
});
```

## Configuration

| name         | illustrate                                                                              | type                |
| ------------ | --------------------------------------------------------------------------------------- | ------------------- |
| zoomInText   | Enlarge button display content                                                          | `Element`\|`string` |
| zoomInTitle  | magnify button`title`Attributes                                                         | `string`            |
| zoomOutText  | Reduce button display content                                                           | `Element`\|`string` |
| zoomOutTitle | shrink button`title`Attributes                                                          | `string`            |
| showZoom     | Whether to display the current real-time zoom value of the map, rounded down by default | `boolean`           |

<embed src="@/docs/api/common/control/api.en.md"></embed>

## method

| name    | illustrate     | type         |
| ------- | -------------- | ------------ |
| zoomIn  | Enlarge map    | `() => void` |
| zoomOut | Reduce basemap | `() => void` |

<embed src="@/docs/api/common/control/method.en.md"></embed>

## event

<embed src="@/docs/api/common/control/event.en.md"></embed>
