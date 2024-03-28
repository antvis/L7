---
title: Scale 缩放尺
order: 4
---

该控件用于显示地图上的距离与地面上相应距离的比率。

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*r3iSQI4SekYAAAAAAAAAAAAAARQnAQ" width="400"/>

## 使用

[示例](/examples/component/control#scale)

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

## 配置

| 名称           | 说明                                 | 类型      | 默认值  |
| -------------- | ------------------------------------ | --------- | ------- |
| lockWidth      | 是否固定容器宽度                     | `boolean` | `true`  |
| maxWidth       | 组件的容器最大宽度                   | `number`  | `100`   |
| metric         | 展示**千米**格式的比例尺             | `boolean` | `true`  |
| imperial       | 展示**英里**格式的比例尺             | `boolean` | `false` |
| updateWhenIdle | 是否只在拖拽和缩放结束后才更新比例尺 | `boolean` | `false` |

<embed src="@/docs/api/common/control/api.zh.md"></embed>

## 方法

<embed src="@/docs/api/common/control/method.zh.md"></embed>

## 事件

<embed src="@/docs/api/common/control/event.zh.md"></embed>
