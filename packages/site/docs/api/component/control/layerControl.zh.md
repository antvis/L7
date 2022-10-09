---
title: LayerControl 图层显隐
order: 8
---

用于控制目标图层组的**显示**和**隐藏**操作。

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*8OCiRYL29CcAAAAAAAAAAAAAARQnAQ" width="400"/>

# 说明

**注意**： 在控件中展示的图层名称会默认读取图层的 `name` 属性，因此需要用户在初始化图层时传入图层对应的名称。

# 使用

[示例](/zh/examples/component/control#layercontrol)

```ts
import { Scene, LayerControl } from '@antv/l7';

const scene = new Scene({
  // ...
});

scene.on('loaded', () => {
  const layer = new PointLayer({
    name: '自定义图层名称',
  });
  scene.addLayer(layer);

  const layerControl = new LayerControl({
    layers: [layer],
  });
  scene.addControl(layerControl);
});
```

# 配置

| 名称   | 说明                                                          | 类型            |
| ------ | ------------------------------------------------------------- | --------------- |
| layers | 需要被控制的 `layer` 数组，不传则默认读取当前 L7 中所有的图层 | `Array<ILayer>` |

`markdown:docs/common/control/popper-api.md`

`markdown:docs/common/control/btn-api.md`

`markdown:docs/common/control/api.md`

# 方法

`markdown:docs/common/control/method.md`

# 事件

`markdown:docs/common/control/event.md`

`markdown:docs/common/control/popper-event.md`

`markdown:docs/common/control/select-event.md`
