---
title: "ExportImage"
description: "ExportImage"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/api/component/export-image/"
---

[Resource index](/llms.txt)

Take a screenshot of the current map part and generate a picture`Base64`String.

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*Yc78QZaeJWkAAAAAAAAAAAAAARQnAQ" width="400"/>

## illustrate

[Example](/en/examples/component/control/exportimage/)

The captured targets when taking screenshots only include:

- map base map
- Layers (excluding MarkerLayer)

**Note: Since the current map base map corresponds to`Canvas`The buffer is enabled by default, so the basemap portion of the map cannot be captured by default.**

Therefore, if the developer needs the complete screenshot capability, the following parameters should be passed when initializing the map instance to turn it off.`Canvas`buffer.

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

## use

```ts
import { Scene, ExportImage } from '@antv/l7';

const scene = new Scene({
  id: 'map',
  map: new GaodeMapV2({
    // Close the map buffer, otherwise the map part cannot be captured when taking screenshots
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

## Configuration

| name      | illustrate                                                                                                    | type                       |
| --------- | ------------------------------------------------------------------------------------------------------------- | -------------------------- |
| imageType | Screenshot image format                                                                                       | `'png'`\|`'jpeg'`          |
| onExport  | After the screenshot is successfully taken, it is used to receive the picture`Base64`String callback function | `(base64: string) => void` |

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


## method

| name     | illustrate                              | type                    |
| -------- | --------------------------------------- | ----------------------- |
| getImage | Get the Base64 string of the screenshot | `() => Promise<string>` |

| name         | illustrate                                                                                                  | type                                   |
| ------------ | ----------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| setOptions   | Update configuration, parameters need to refer to the corresponding component[Configuration](Configuration) | `(newOption: Partial<Option>) => void` |
| getOptions   | Get current[Configuration](Configuration)                                                                   | `() => Option`                         |
| show         | display component                                                                                           | `() => void`                           |
| hide         | Hidden component                                                                                            | `() => void`                           |
| getContainer | Get the information corresponding to the current control`DOM`container                                      | `() => HTMLElement`                    |


## event

| Name   | Description                            | Type             |
| ------ | -------------------------------------- | ---------------- |
| add    | Event when component is added          | `(this) => void` |
| remove | Event when component is removed        | `(this) => void` |
| show   | Events when the component is displayed | `(this) => void` |
| hide   | Event when component is hidden         | `(this) => void` |
