---
title: Fullscreen
order: 5
---

Used to control map areas**full screen**and**Exit Full Screen**control button control.

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*CcOXRqK5ARgAAAAAAAAAAAAAARQnAQ" width="400"/>

## use

[Example](/en/examples/component/control/fullscreen/)

```ts
import { Scene, Fullscreen } from '@antv/l7';

const scene = new Scene({
  // ...
});

scene.on('loaded', () => {
  const fullscreen = new Fullscreen({
    btnText: '全屏',
    exitBtnText: '退出全屏',
  });
  scene.addControl(fullscreen);
});
```

## Configuration

<!-- include: ../common/control/btn-api.en.md -->

| name        | illustrate                                    | type                        |
| ----------- | --------------------------------------------- | --------------------------- |
| exitBtnIcon | Exit full screen button icon                  | `HTMLElement`\|`SVGElement` |
| exitBtnText | Text for exit full screen button              | `string`                    |
| exitTitle   | Exit full screen button text`title`Attributes | `string`                    |

<!-- include: ../common/control/api.en.md -->

## method

| name             | illustrate                                                      | type         |
| ---------------- | --------------------------------------------------------------- | ------------ |
| toggleFullscreen | Enter/exit the full screen state of the full screen map section | `() => void` |

<!-- include: ../common/control/method.en.md -->

## event

| name             | illustrate                                   | type                              |
| ---------------- | -------------------------------------------- | --------------------------------- |
| fullscreenChange | Triggered when the full screen state changes | `(isFullscreen: boolean) => void` |

<!-- include: ../common/control/event.en.md -->
