---
title: MouseLocation
order: 9
---

Used to display the longitude and latitude corresponding to the current cursor on the map in real time.

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*i4F5QZ4K650AAAAAAAAAAAAAARQnAQ" width="400"/>

## use

[Example](/examples/component/control#mouselocation)

```ts
import { Scene, MouseLocation } from '@antv/l7';

const scene = new Scene({
  // ...
});

scene.on('loaded', () => {
  const mouseLocation = new MouseLocation({
    transform: (position) => {
      return position;
    },
  });
  scene.addControl(mouseLocation);
});
```

## Configuration

| name      | illustrate                                                            | type                                               |
| --------- | --------------------------------------------------------------------- | -------------------------------------------------- |
| transform | Callback function to convert the longitude and latitude of the cursor | `(position: [number, number]) => [number, number]` |

<embed src="@/docs/api/common/control/api.en.md"></embed>

## method

<embed src="@/docs/api/common/control/method.en.md"></embed>

## event

| name           | illustrate                                                      | type                                   |
| -------------- | --------------------------------------------------------------- | -------------------------------------- |
| locationChange | Triggered when the longitude and latitude of the cursor changes | `(position: [number, number]) => void` |

<embed src="@/docs/api/common/control/event.en.md"></embed>
