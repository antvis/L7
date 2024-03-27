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

| 名称     | 说明                                                                                       | 类型                                         |
| -------- | ------------------------------------------------------------------------------------------ | -------------------------------------------- |
| layers   | 需要被控制的 `layer` 数组，支持传入图层示例或者图层 id，不传则默认读取当前 L7 中所有的图层 | `Array<ILayer \| string \| LayerSwitchItem>` |
| multiple | 控件内的图层选项是否为多选，单选模式下默认展示第一个选项对应的图层                         | `boolean`                                    |

### LayerSwitchItem

| 名称  | 说明                      | 类型                  |
| ----- | ------------------------- | --------------------- |
| layer | 需要被控制的 `layer` 实例 | `ILayer`              |
| name  | 展示的图层名称            | `string \| undefined` |
| img   | 展示的图层图片 `URL`      | `string \| undefined` |

<embed src="@/docs/api/common/control/popper-api.zh.md"></embed>

<embed src="@/docs/api/common/control/btn-api.zh.md"></embed>

<embed src="@/docs/api/common/control/api.zh.md"></embed>

## 方法

<embed src="@/docs/api/common/control/method.zh.md"></embed>

## 事件

<embed src="@/docs/api/common/control/event.zh.md"></embed>

<embed src="@/docs/api/common/control/popper-event.zh.md"></embed>

<embed src="@/docs/api/common/control/select-event.zh.md"></embed>
