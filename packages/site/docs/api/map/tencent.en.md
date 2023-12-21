---
title: 腾讯地图
order: 3
---

<embed src="@/docs/api/common/style.md"></embed>

## Introduction

L7 geographical visualization focuses on the visual expression of geographical data. The map layer needs to rely on third-party maps. Third-party maps are created and managed uniformly through Scene. You only need to pass in map configuration items through Scene.

L7 internally resolves the differences between different map basemaps, and at the same time, L7 manages the operation methods of the map in a unified manner.

* [Tencent Map API](https://lbs.qq.com/webApi/javascriptGL/glGuide/glOverview)

### Apply for token

[Tencent map token application](https://lbs.qq.com/webApi/javascriptGL/glGuide/glBasic)

## Initialize map

```ts
import { Scene, PointLayer } from '@antv/l7';
import { TencentMap } from '@antv/l7-maps';
  const scene = new Scene({
    id: 'map',
    map: new TencentMap({
      zoom: 10,
      minZoom: 5,
      maxZoom: 18
    })
  });
```

<embed src="@/docs/api/common/map.en.md"></embed>
