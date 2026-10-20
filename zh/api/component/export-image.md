---
title: "ExportImage 导出图片"
description: "ExportImage 导出图片"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/api/component/export-image/"
---

[资料索引](/llms.txt)

对当前地图部分进行截图并生成图片的 `Base64` 字符串。

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*Yc78QZaeJWkAAAAAAAAAAAAAARQnAQ" width="400"/>

## 说明

[示例](/zh/examples/component/control/exportimage/)

截图时被截取的目标仅包含：

- 地图底图
- 图层（不包含 MarkerLayer）

**注意：由于当前地图底图对应 `Canvas` 默认开启了缓冲区，导致默认情况下无法截取到地图底图部分。**

因此若开发者需要完整的截图能力，则应当在初始化地图实例时传递以下参数以关闭 `Canvas` 缓冲区。

```ts
new GaodeMapV2({
  WebGLParams: {
    preserveDrawingBuffer: true,
  },
});

new Mapbox({
  preserveDrawingBuffer: true,
});
```

## 使用

```ts
import { Scene, ExportImage } from '@antv/l7';

const scene = new Scene({
  id: 'map',
  map: new GaodeMapV2({
    // 关闭地图缓冲区，否则截图时无法截取到地图部分
    WebGLParams: {
      preserveDrawingBuffer: true,
    },
  }),
});

scene.on('loaded', () => {
  const zoom = new ExportImage({
    onExport: (base64: string) => {
      // download(base64)
    },
  });
  scene.addControl(zoom);
});
```

## 配置

| 名称      | 说明                                               | 类型                       |
| --------- | -------------------------------------------------- | -------------------------- |
| imageType | 截图图片的格式                                     | `'png'` \| `'jpeg'`        |
| onExport  | 截图成功后，用于接收图片 `Base64` 字符串的回调函数 | `(base64: string) => void` |

| 名称     | 说明                                                    | 类型                          |
| -------- | ------------------------------------------------------- | ----------------------------- |
| btnIcon  | 按钮图标                                                | `HTMLElement` \| `SVGElement` |
| btnText  | 按钮内容文本                                            | `string`                      |
| title    | 按钮的 `title` 属性                                     | `string`                      |
| vertical | 在 btnIcon 有值的情况下，按钮内的图标和文案是否纵向排列 | `boolean`                     |


| 名称      | 说明                                                                                      | 类型                  |
| --------- | ----------------------------------------------------------------------------------------- | --------------------- |
| position  | 控件被添加到地图中的位置以及排列方式，详情可见 [控件插槽](/zh/api/component/control#插槽) | [Position](#position) |
| className | 自定义样式名                                                                              | `string`              |
| style     | 自定义样式                                                                                | `string`              |

### Position

```ts
export type Position =
  | 'topleft' // ↖ 左上角，纵向排列
  | 'lefttop' // ↖ 左上角，横向排列
  | 'topright' // ↗ 右上角，纵向排列
  | 'righttop' // ↗ 右上角，横向排列
  | 'bottomleft' // ↙ 左下角，纵向排列
  | 'leftbottom' // ↙ 左下角，横向排列
  | 'bottomright' // ↘ 右下角，纵向排列
  | 'rightbottom' // ↘ 右下角，横向排列
  | 'topcenter' // ↑ 上方中央，横向排列
  | 'bottomcenter' // ↓ 下方中间，横向排列
  | 'leftcenter' // ← 左边中间，纵向排列
  | 'rightcenter' // → 右边中间，纵向排列
  | Element; // 传入 DOM 作为当前控件的容器
```


## 方法

| 名称     | 说明                     | 类型                    |
| -------- | ------------------------ | ----------------------- |
| getImage | 获取截图的 Base64 字符串 | `() => Promise<string>` |

| 名称         | 说明                                          | 类型                                   |
| ------------ | --------------------------------------------- | -------------------------------------- |
| setOptions   | 更新配置，参数需要参考对应组件的[配置](#配置) | `(newOption: Partial<Option>) => void` |
| getOptions   | 获取当前[配置](#配置)                         | `() => Option`                         |
| show         | 显示组件                                      | `() => void`                           |
| hide         | 隐藏组件                                      | `() => void`                           |
| getContainer | 获取当前控件对应的 `DOM` 容器                 | `() => HTMLElement`                    |


## 事件

| 名称   | 说明               | 类型             |
| ------ | ------------------ | ---------------- |
| add    | 组件被添加时的事件 | `(this) => void` |
| remove | 组件被移除时的事件 | `(this) => void` |
| show   | 组件显示时的事件   | `(this) => void` |
| hide   | 组件隐藏时的事件   | `(this) => void` |
