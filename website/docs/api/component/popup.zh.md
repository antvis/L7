---
title: Popup 信息框
order: 0
---

Popup 是用于在地图上指定经纬度位置，展示自定义内容的气泡。

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*N2hWTq-m-8EAAAAAAAAAAAAAARQnAQ" width="300"/>

## 说明

Popup 的锚点位置是由经纬度来表达的，当地图缩放/平移时，Popup 会自动计算相对于当前地图的坐标并且自动位移。换句话说，如果开发者需要在地图的**指定经纬度位置**展示信息气泡，可以考虑使用 Popup 组件来实现对应效果。

开发者可以自定义 Popup 主体展示内容：

- 纯文本可以通过 `text` 配置或者 `setText` 方法控制 Popup 的展示文本。
- 自定义 DOM 可以通过 `html` 配置或者 `setHTML` 方法，支持传入 HTML 字符串或者 DOM 元素或数组的方式控制 Popup 的展示内容。

## 使用

[示例](/examples/component/popup#popup)

```ts
import { Scene, Popup } from '@antv/l7';

const scene = new Scene({
  id: 'map',
  map: new GaodeMapV2({
    // ...
  }),
});

scene.on('loaded', () => {
  const popup = new Popup({
    // 初始锚点经纬度
    lngLat: {
      lng: 120,
      lat: 30,
    },
    // Popup 标题
    title: 'Popup Title',
    // Popup 内容
    html: 'Popup Content',
  });
  scene.addPopup(popup);

  // 更新 Popup 锚点经纬度
  popup.setLngLat({
    lng: 130,
    lat: 40,
  });

  // 更新 Popup 内容
  popup.setHTML('New Popup Content');
});
```

## 配置

| 名称               | 说明                                                                     | 类型                           | 默认值     |
| ------------------ | ------------------------------------------------------------------------ | ------------------------------ | ---------- |
| lngLat             | Popup 所在的经纬度                                                       | `{ lng: number; lat: number }` | -          |
| text               | Popup 内容展示的文本内容                                                 | `string`                       | -          |
| html               | Popup 内容展示的自定义 HTML，可以传 HTML 字符串，也可以传 DOM 对象或数组 | [ElementType](#elementtype)    | -          |
| title              | Popup 标题展示的自定义 HTML，可以传 HTML 字符串，也可以传 DOM 对象或数组 | [ElementType](#elementtype)    | -          |
| closeOnClick       | 点击地图区域时，是否关闭当前 Popup                                       | `boolean`                      | `false`    |
| closeOnEsc         | 点击 Esc 键时，是否关闭当前 Popup                                        | `boolean`                      | `false`    |
| maxWidth           | Popup 的最大宽度                                                         | `string`                       | `240px`    |
| anchor             | Popup 箭头位置，可以控制 Popup 相对于经纬度点的展示位置                  | [AnchorType](#anchortype)      | `'bottom'` |
| offsets            | Popup 相对于锚点的偏移                                                   | `[number, number]`             | `[0, 0]`   |
| autoPan            | 当 Popup 展示或者位置发生变化时，地图是否要自动平移至 Popup 所在位置     | `boolean`                      | `false`    |
| autoClose          | 当有其他 Popup 展示时，是否自动关闭当前气泡                              | `boolean`                      | `true`     |
| followCursor       | Popup 是否跟随光标移动，若设为 `true`，则 `lngLat` 配置无效              | `boolean`                      | `false`    |
| closeButton        | 是否展示关闭 Popup 图标                                                  | `boolean`                      | `true`     |
| closeButtonOffsets | 关闭 Popup 图标的相对偏移                                                | `[number, number]`             | -          |
| stopPropagation    | Popup 上的鼠标事件是否要阻止其冒泡                                       | `boolean`                      | `true`     |

### ElementType

```ts
type ElementType =
  | HTMLElement
  | HTMLElement[]
  | DocumentFragment
  | Text
  | string;
```

### AnchorType

```ts
type AnchorType =
  | 'center'
  | 'top'
  | 'top-left'
  | 'top-right'
  | 'bottom'
  | 'bottom-left'
  | 'bottom-right'
  | 'left'
  | 'right';
```

## 方法

| 名称       | 说明                        | 类型                                                                 |
| ---------- | --------------------------- | -------------------------------------------------------------------- |
| getOptions | 获取当前 Popup 配置         | `() => IPopupOption`                                                 |
| setOptions | 更新当前 Popup 配置         | `(newOption: Partial<IPopupOption>) => this`                         |
| show       | 显示 Popup                  | `() => this`                                                         |
| hide       | 隐藏 Popup                  | `() => this`                                                         |
| getIsShow  | 判断当前气泡是否展示        | `() => boolean`                                                      |
| setTitle   | 设置 Popup 标题展示的 HTML  | `(title: ElementType) => this`                                       |
| setHTML    | 设置 Popup 内容展示的 HTML  | `(html: ElementType) => this`                                        |
| setText    | 设置 Popup 内容展示的文本   | `(text: string) => this`                                             |
| setLngLat  | 设置 Popup 锚点所在经纬度   | `(lngLat: { lng: number; lat: number } \| [number, number]) => this` |
| panToPopup | 将地图平移至当前 Popup 位置 | `() => this`                                                         |

## 事件

| 名称  | 说明               | 类型         |
| ----- | ------------------ | ------------ |
| open  | Popup 被添加时触发 | `() => void` |
| close | Popup 被移除时触发 | `() => void` |
| show  | Popup 显示时触发   | `() => void` |
| hide  | Popup 隐藏时触发   | `() => void` |
