---
title: LayerSwitch 图层显隐
order: 8
---

用于控制目标图层组的**显示**和**隐藏**操作。

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*SiQWT5RnMDYAAAAAAAAAAAAAARQnAQ" width="400"/>

## 说明

**注意**： 在控件中展示的图层名称会默认读取图层的 `name` 属性，因此需要用户在初始化图层时传入图层对应的名称。

## 使用

[示例](/examples/component/control#layerswitch)

```ts
import { Scene, LayerSwitch } from '@antv/l7';

const scene = new Scene({
  // ...
});

scene.on('loaded', () => {
  const layer = new PointLayer({
    name: '自定义图层名称',
  });
  scene.addLayer(layer);

  const layerSwitch = new LayerSwitch({
    layers: [layer],
  });
  scene.addControl(layerSwitch);
});
```

## 配置

| 名称   | 说明                                                                                       | 类型                      |
| ------ | ------------------------------------------------------------------------------------------ | ------------------------- |
| layers | 需要被控制的 `layer` 数组，支持传入图层示例或者图层 id，不传则默认读取当前 L7 中所有的图层 | `Array<ILayer \| string>` |

<embed src="@/docs/common/control/popper-api.md"></embed>

<embed src="@/docs/common/control/btn-api.md"></embed>

<embed src="@/docs/common/control/api.md"></embed>

## 方法

<embed src="@/docs/common/control/method.md"></embed>

## 事件

<embed src="@/docs/common/control/event.md"></embed>

<embed src="@/docs/common/control/popper-event.md"></embed>

<embed src="@/docs/common/control/select-event.md"></embed>
