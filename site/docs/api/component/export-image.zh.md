---
title: ExportImage 导出图片
order: 7
---

对当前地图部分进行截图并生成图片的 `Base64` 字符串。

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*Yc78QZaeJWkAAAAAAAAAAAAAARQnAQ" width="400"/>

## 说明

[示例](/examples/component/control#exportimage)

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

<embed src="@/docs/api/common/control/btn-api.zh.md"></embed>

<embed src="@/docs/api/common/control/api.zh.md"></embed>

## 方法

| 名称     | 说明                     | 类型                    |
| -------- | ------------------------ | ----------------------- |
| getImage | 获取截图的 Base64 字符串 | `() => Promise<string>` |

<embed src="@/docs/api/common/control/method.zh.md"></embed>

## 事件

<embed src="@/docs/api/common/control/event.zh.md"></embed>
