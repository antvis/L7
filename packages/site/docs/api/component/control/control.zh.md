---
title: 控件
order: 1
---

地图控件指的是悬停在地图四周，可以对地图以及图层等元素进行**信息呈现**或**交互**的组件。

![](https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*zgFeTocc-_oAAAAAAAAAAAAAARQnAQ)

## 使用

```ts
import { Scene, Zoom } from '@antv/l7';

const scene = new Scene({
  // ...
});

scene.on('loaded', () => {
  // 实例化 Zoom 控件，可以在构造器中传入控件的配置
  const zoom = new Zoom({
    position: 'leftbottom',
    className: 'my-test-class',
  });

  // 将实例化的控件添加至 L7 中
  scene.addControl(zoom);
});
```

## 更新配置

在控件实例化之后，如果需要更新配置，可以调用控件实例的 `setOptions` 方法，同时传入需要更新的配置对象即可。

```ts
const zoom = new Zoom({
  position: 'leftbottom',
});

const onPositionChange = () => {
  // 通过 setOptions 传入需要更新的配置对象
  zoom.setOptions({
    position: 'topright',
  });
};
```

## 插槽

当前 L7 中的控件支持插入到地图的**左上、左下、右上、右下、上、左、下、右**八个位置插槽或者用户自定义的 `DOM` 中，并且在同一地图插槽中，多个控件之间支持**横向**和**纵向**排列。

在初始化所有的控件类时，可以传入 `position` 参数来设置控件对应的插槽以及排列方式。

![](https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*BfG1TI231ysAAAAAAAAAAAAAARQnAQ)

## 配置

<embed src="@/docs/common/control/api.md"></embed>

## 方法

<embed src="@/docs/common/control/method.md"></embed>

## 事件

<embed src="@/docs/common/control/event.md"></embed>
