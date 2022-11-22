---
title: Logo 标志
order: 2
---

用于在地图上展示 Logo 图片的控件，并且支持超链接点击跳转。

![](https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*CbdSRLizMLIAAAAAAAAAAAAAARQnAQ)

## 说明

当前 L7 会默认在地图左下角展示该控件，如需隐藏可以在 Scene 实例化时配置：

```ts
import { Scene } from '@antv/l7';

const scene = new Scene({
  // ...

  // 关闭默认 L7 Logo
  logoVisible: false,
});
```

## 使用

[示例](/examples/component/control#logo)

```ts
import { Scene, Logo } from '@antv/l7';

const scene = new Scene({
  //...
  logoVisible: false,
});

scene.on('loaded', () => {
  const logo = new Logo({
    // 图片 url
    img:
      'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*GRb1TKp4HcMAAAAAAAAAAAAAARQnAQ',
    // 跳转地址
    href: 'https://l7.antv.antgroup.com',
  });
  scene.addControl(logo);
});
```

## 配置

| 名称 | 说明                                                 | 类型     |
| ---- | ---------------------------------------------------- | -------- |
| img  | Logo 展示的图片 url                                  | `string` |
| href | 点击 Logo 跳转的超链接，不传则纯展示图片，点击不跳转 | `string` |

<embed src="@/docs/common/control/api.md"></embed>

## 方法

<embed src="@/docs/common/control/method.md"></embed>

## 事件

<embed src="@/docs/common/control/event.md"></embed>
