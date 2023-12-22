---
title: MapTheme 地图主题
order: 11
---

该控件用于切换地图底图的主题样式。

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*xb29TawbZDgAAAAAAAAAAAAAARQnAQ" width="400"/>

## 说明

MapTheme 会根据当前地图底图类型（如 Mapbox、GaodeMapV2），默认展示相对应的默认主题选项，用于也可以传入自定义的主题选项

## 使用

[示例](/examples/component/control#maptheme)

```ts
import { Scene, MapTheme } from '@antv/l7';

const scene = new Scene({
  // ...
});

scene.on('loaded', () => {
  const mapTheme = new MapTheme({});
  scene.addControl(mapTheme);
});
```

## 配置

| 名称    | 说明                                                                                   | 类型                        |
| ------- | -------------------------------------------------------------------------------------- | --------------------------- |
| options | 用户自定义的地图主题选项，每个选项的类型可见 [IControlOptionItem](#icontroloptionitem) | `Array<IControlOptionItem>` |

## IControlOptionItem

```ts
export type IControlOptionItem = {
  // 主题选项对应的文本
  text: string;
  // 主题选项对应地图主题 style 的 key 值
  value: string;
  // 主题选项对应展示的图片
  img?: string;
};
```

<embed src="@/docs/api/common/control/popper-api.zh.md"></embed>

<embed src="@/docs/api/common/control/btn-api.zh.md"></embed>

<embed src="@/docs/api/common/control/api.zh.md"></embed>

## 方法

<embed src="@/docs/api/common/control/method.zh.md"></embed>

## 事件

<embed src="@/docs/api/common/control/event.zh.md"></embed>

<embed src="@/docs/api/common/control/popper-event.zh.md"></embed>

<embed src="@/docs/api/common/control/select-event.zh.md"></embed>
