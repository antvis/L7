---
title: LayerPopup 图层信息框
order: 1
---

LayerPopup 基于 Popup 封装的，专门用于展示图层元素信息的气泡。

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*HC6BT6v3YRIAAAAAAAAAAAAAARQnAQ" width="300"/>

# 说明

LayerPopup 是为了让开发者通过配置快速生成用于展示图层信息的气泡，开发者可以传入需要展示信息气泡的图层，以及需要展示的字段。

LayerPopup 会自行对目标图层的鼠标事件进行监听，当用户点击/悬停在目标图层的某一元素上时，会自动打开 Popup 并展示该元素的字段值。

# 使用

[示例](/zh/examples/component/popup#layerPopup)

```ts
import { Scene, LayerPopup, PointLayer } from '@antv/l7';

const scene = new Scene({
  id: 'map',
  map: new GaodeMapV2({
    // ...
  }),
});

scene.on('loaded', () => {
  const pointLayer = new PointLayer();
  pointLayer.source(
    [
      {
        lng: 120,
        lat: 30,
        name: 'Test 1',
      },
    ],
    {
      parser: {
        type: 'json',
        x: 'lng',
        y: 'lat',
      },
    },
  );
  scene.addLayer(pointLayer);
  const layerPopup = new LayerPopup({
    config: [
      {
        layer: pointLayer,
        fields: [
          {
            field: 'name',
            formatValue: (name?: string) => name.trim() ?? '-',
          },
        ],
      },
    ],
    trigger: 'hover',
  });
  scene.addPopup(popup);
});
```

# 配置

| 名称    | 说明                                                                                          | 类型                          | 默认值    |
| ------- | --------------------------------------------------------------------------------------------- | ----------------------------- | --------- |
| config  | 需要展示 Popup 的图层配置数组，每个选项类型可见 [LayerPopupConfigItem](#layerpopupconfigitem) | `Array<LayerPopupConfigItem>` | `[]`      |
| trigger | 鼠标触发 Popup 展示的方式                                                                     | `'hover' | 'click'`           | `'hover'` |

## LayerPopupConfigItem

| 名称   | 说明                                                                                              | 类型                  |
| ------ | ------------------------------------------------------------------------------------------------- | --------------------- |
| layer  | 需要展示 Popup 的目标图层实例，或其的 `id` 或 `name`                                              | `BaseLayer | string`  |
| fields | 需要展示的字段数组，支持传入字段 key 值字符串，或者针对该字段的详细配置 [LayerField](#layerfield) | `string | LayerField` |

## LayerField

| 名称        | 说明                        | 类型                          |
| ----------- | --------------------------- |-----------------------------|
| field       | 字段的 key 值字符串         | `string`                    |
| formatField | 对展示的 key 字段进行格式化 | `(field: string) => string` |
| formatValue | 对展示的 value 值进行格式化 | `(value: any) => any`       |
| getValue    | 自定义获取值的方式          | `(feature: any) => any`     |

# 方法

| 名称       | 说明                        | 类型                                                                |
| ---------- | --------------------------- | ------------------------------------------------------------------- |
| getOptions | 获取当前 Popup 配置         | `() => IPopupOption`                                                |
| setOptions | 更新当前 Popup 配置         | `(newOption: Partial<IPopupOption>) => this`                        |
| show       | 显示 Popup                  | `() => this`                                                        |
| hide       | 隐藏 Popup                  | `() => this`                                                        |
| getIsShow  | 判断当前气泡是否展示        | `() => boolean`                                                     |
| setHTML    | 设置 Popup 内容展示的 HTML  | `(html: string | HTMLElement | HTMLElement[]) => this`              |
| setText    | 设置 Popup 内容展示的文本   | `(text: string) => this`                                            |
| setLngLat  | 设置 Popup 锚点所在经纬度   | `(lngLat: { lng: number; lat: number } | [number, number]) => this` |
| panToPopup | 将地图平移至当前 Popup 位置 | `() => this`                                                        |

# 事件

| 名称  | 说明               | 类型         |
| ----- | ------------------ | ------------ |
| open  | Popup 被添加时触发 | `() => void` |
| close | Popup 被移除时触发 | `() => void` |
| show  | Popup 显示时触发   | `() => void` |
| hide  | Popup 隐藏时触发   | `() => void` |
