---
title: Logo
order: 2
---

A control used to display logo images on the map, and supports click-to-jump hyperlinks.

![](https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*CbdSRLizMLIAAAAAAAAAAAAAARQnAQ)

## illustrate

Currently, L7 will display this control in the lower left corner of the map by default. If it needs to be hidden, it can be configured when the Scene is instantiated:

```ts
import { Scene } from '@antv/l7';

const scene = new Scene({
  // ...

  // Close the default L7 Logo
  logoVisible: false,
});
```

## use

[Example](/examples/component/control#logo)

```ts
import { Scene, Logo } from '@antv/l7';

const scene = new Scene({
  //...
  logoVisible: false,
});

scene.on('loaded', () => {
  const logo = new Logo({
    // 图片 url
    img: 'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*GRb1TKp4HcMAAAAAAAAAAAAAARQnAQ',
    // 跳转地址
    href: 'https://l7.antv.antgroup.com',
  });
  scene.addControl(logo);
});
```

## Configuration

| name | illustrate                                                                                                           | type     |
| ---- | -------------------------------------------------------------------------------------------------------------------- | -------- |
| img  | Logo display image url                                                                                               | `string` |
| href | Click the logo to jump to the hyperlink. If it is not uploaded, the image will be displayed. Clicking will not jump. | `string` |

<embed src="@/docs/api/common/control/api.en.md"></embed>

## method

<embed src="@/docs/api/common/control/method.en.md"></embed>

## event

<embed src="@/docs/api/common/control/event.en.md"></embed>
