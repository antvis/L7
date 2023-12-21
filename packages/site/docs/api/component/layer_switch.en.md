---
title: LayerSwitch
order: 8
---

Used to control the target layer group**show**and**hide**operate.

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*SiQWT5RnMDYAAAAAAAAAAAAAARQnAQ" width="400"/>

## illustrate

**Notice**: The layer name displayed in the control will read the layer's name by default.`name`property, so the user needs to pass in the corresponding name of the layer when initializing the layer.

## use

[Example](/examples/component/control#layerswitch)

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

## Configuration

| name   | illustrate                                                                                                                                             | type                      |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------- |
| layers | need to be controlled`layer`Array, supports passing in layer example or layer id. If not passed, all layers in the current L7 will be read by default. | `Array<ILayer \| string>` |

<embed src="@/docs/api/common/control/popper-api.en.md"></embed>

<embed src="@/docs/api/common/control/btn-api.en.md"></embed>

<embed src="@/docs/api/common/control/api.en.md"></embed>

## method

<embed src="@/docs/api/common/control/method.en.md"></embed>

## event

<embed src="@/docs/api/common/control/event.en.md"></embed>

<embed src="@/docs/api/common/control/popper-event.en.md"></embed>

<embed src="@/docs/api/common/control/select-event.en.md"></embed>
