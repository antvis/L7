---
title: 天地图
order: 10
---

<embed src="@/docs/api/common/style.md"></embed>

## Introduction

L7 geographical visualization focuses on the visual expression of geographical data. The map layer needs to rely on third-party maps. Third-party maps are created and managed uniformly through Scene. You only need to pass in map configuration items through Scene.

L7 internally resolves the differences between different map basemaps, and at the same time, L7 manages the operation methods of the map in a unified manner.

- [Tianditu official website](http://lbs.tianditu.gov.cn/api/js4.0/guide.html)

## Apply for token

Tianditu JavaScript API 4.0 supports HTTP and HTTPS, is free and open to the public, and can be used directly. Before using the API, you need to [apply for application key](https://console.tianditu.gov.cn/api/key).

## import

```javascript
import { TdtMap } from '@antv/l7-maps';
```

## Usage

```ts
import { Scene } from '@antv/l7';
import { TdtMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new TdtMap({
    token: 'your-tianditu-token',
    center: [120, 30],
    zoom: 10,
  }),
});

scene.on('loaded', () => {
  // Add layers
});
```

## Options

| Name        | Description                               | Type               | Default                                     |
| ----------- | ----------------------------------------- | ------------------ | ------------------------------------------- |
| token       | Tianditu API Key                          | `string`           | Built-in test token (replace in production) |
| center      | Initial map center coordinates            | `[number, number]` | `[121.30654, 31.25744]`                     |
| zoom        | Initial zoom level                        | `number`           | `3`                                         |
| minZoom     | Minimum zoom level                        | `number`           | `1`                                         |
| maxZoom     | Maximum zoom level                        | `number`           | `18`                                        |
| mapInstance | Pass in an existing Tianditu map instance | `T.Map`            | -                                           |

<embed src="@/docs/api/common/map.en.md"></embed>
