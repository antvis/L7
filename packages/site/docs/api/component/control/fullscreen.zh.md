---
title: Fullscreen 全屏
order: 5
---

用于控制地图区域的**全屏**和**退出全屏**的控制按钮控件。

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*CcOXRqK5ARgAAAAAAAAAAAAAARQnAQ" width="400"/>

# 使用

[示例](/zh/examples/component/control#fullscreen)

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

# 配置

`markdown:docs/common/control/btn-api.md`

| 名称        | 说明                              | 类型                              |
| ----------- | --------------------------------- | --------------------------------- |
| exitBtnIcon | 退出全屏按钮的图标                | `HTMLElement` &#124; `SVGElement` |
| exitBtnText | 退出全屏按钮的文本                | `string`                          |
| exitTitle   | 退出全屏按钮的文本的 `title` 属性 | `string`                          |

`markdown:docs/common/control/api.md`

# 方法

| 名称             | 说明                            | 类型         |
| ---------------- | ------------------------------- | ------------ |
| toggleFullscreen | 进入/退出全屏地图部分的全屏状态 | `() => void` |

`markdown:docs/common/control/method.md`

# 事件

| 名称             | 说明                     | 类型                              |
| ---------------- | ------------------------ | --------------------------------- |
| fullscreenChange | 当全屏状态发生变化时触发 | `(isFullscreen: boolean) => void` |

`markdown:docs/common/control/event.md`
