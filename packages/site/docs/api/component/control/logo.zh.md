---
title: Logo 标志
order: 2
---

用于在地图上展示 Logo 图片的控件，并且支持超链接点击跳转。

![](https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*CbdSRLizMLIAAAAAAAAAAAAAARQnAQ)

# 说明

当前 L7 会默认在地图左下角展示该控件，如需隐藏可以在 Scene 实例化时配置：

```ts
import { Scene } from '@antv/l7';

const scene = new Scene({
  id: 'map',
  logoVisible: false,
});
```

# 使用

```ts
import { Scene, Logo } from '@antv/l7';

const scene = new Scene({
  //...
});

scene.on('loaded', () => {
  const logo = new Logo({
    // Logo url
    img:
      'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*GRb1TKp4HcMAAAAAAAAAAAAAARQnAQ',
    // 跳转地址
    href: 'https://l7.antv.vision/',
  });
  scene.addControl(logo);
});
```

# 配置

| 名称 | 说明                                                 | 类型     |
| ---- | ---------------------------------------------------- | -------- |
| img  | Logo 展示的图片 url                                  | `string` |
| href | 点击 Logo 跳转的超链接，不传则纯展示图片，点击不跳转 | `string` |

`markdown:docs/common/control/api.md`

# 方法

`markdown:docs/common/control/method.md`

# 事件

`markdown:docs/common/control/event.md`
