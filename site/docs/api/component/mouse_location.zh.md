---
title: MouseLocation 光标经纬度
order: 9
---

用于实时展示当前光标在地图上所对应的经纬度。

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*i4F5QZ4K650AAAAAAAAAAAAAARQnAQ" width="400"/>

## 使用

[示例](/zh/examples/component/control/mouselocation/)

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

## 配置

| 名称      | 说明                         | 类型                                               |
| --------- | ---------------------------- | -------------------------------------------------- |
| transform | 转换光标所在经纬度的回调函数 | `(position: [number, number]) => [number, number]` |

<!-- include: ../common/control/api.zh.md -->

## 方法

<!-- include: ../common/control/method.zh.md -->

## 事件

| 名称           | 说明                         | 类型                                   |
| -------------- | ---------------------------- | -------------------------------------- |
| locationChange | 光标所在经纬度发生变化时触发 | `(position: [number, number]) => void` |

<!-- include: ../common/control/event.zh.md -->
