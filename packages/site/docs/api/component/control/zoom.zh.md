---
title: Zoom 缩放
order: 3
---

用于控制地图**放大**和**缩小**的控件，并且当地图达到最大或最小缩放比时，会禁用对应缩放按钮。

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*CJx3Tby-XlEAAAAAAAAAAAAAARQnAQ" width="400"/>

## 使用

[示例](/examples/component/control#zoom)

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

## 配置

| 名称         | 说明                    | 类型                      |
| ------------ | ----------------------- | ------------------------- |
| zoomInText   | 放大按钮的展示内容      | `Element` \| `string` |
| zoomInTitle  | 放大按钮的 `title` 属性 | `string`                  |
| zoomOutText  | 缩小按钮的展示内容      | `Element` \| `string` |
| zoomOutTitle | 缩小按钮的 `title` 属性 | `string`                  |

<embed src="@/docs/common/control/api.md"></embed>

## 方法

| 名称    | 说明     | 类型         |
| ------- | -------- | ------------ |
| zoomIn  | 放大地图 | `() => void` |
| zoomOut | 缩小底图 | `() => void` |

<embed src="@/docs/common/control/method.md"></embed>

## 事件

<embed src="@/docs/common/control/event.md"></embed>
