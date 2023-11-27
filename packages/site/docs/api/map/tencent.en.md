---
title: Tencent Map
---
order: 3
---

<embed src="@/docs/common/style.md"></embed>

## Introduction

L7 geographical visualization focuses on the visual expression of geographical data. The map layer needs to rely on third-party maps. Third-party maps are created and managed uniformly through Scene. You only need to pass in map configuration items through Scene.

L7 internally resolves the differences between different map basemaps, and at the same time, L7 manages the operation methods of the map in a unified manner.

The Tencent map currently supported by L7 is[JavaScript API GL](https://lbs.qq.com/webApi/javascriptGL/glGuide/glOverview), which is also the officially recommended version of Tencent Maps.

### Apply for token

Before using Tencent Map, you need to register a Tencent Map account and apply for a Key.

1. First, [Register a developer account](https://lbs.qq.com/dev/console/register?backurl=https%3A%2F%2Flbs.qq.com%2FwebApi%2FjavascriptGL%2FglGuide%2FglOverview), become Tencent location service developer.

2. After login, enter the「Application Management」page「Create application」.

3. For the application[add Key], check the user agreement and submit.

⚠️  L7 has a default token set internally, which is for testing only.

### Import

```javascript
import { TencentMap } from '@antv/l7-maps';
```

### Instantiate

L7 provides TencentMap to directly instantiate the map, and can also instantiate the map through external input.

It is recommended for new projects to instantiate TencentMap directly. Existing map projects can be passed in externally to quickly access L7 capabilities.

#### TencentMap instantiation

```js
import { TencentMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new TencentMap({
    // Fill in the Tencent map key. This is a test token and cannot be used for production.
    token: 'OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77',
    style: 'style1',
    center: [ 107.054293, 35.246265 ],
    zoom: 4.056,
  }),
});
```

#### External instantiation

⚠️ The scene id parameter needs to be in the same container as the TMap.Map instance.

⚠️ The incoming map instance needs to introduce the API of Tencent Map itself.

```javascript
<script charset="utf-8" src="https://apis.map.qq.com/api/jue?key=The key value you requested"></script>
```

```javascript
const map = new TMap.Map("map", {
    pitch:45,
    zoom:12,
    center: new TMap.LatLng(39.984104, 116.307503)
});

const scene = new Scene({
  id: 'map',
  map: new TencentMap({
    mapInstance: map,
  }),
});
```

Tencentmap [Example address](/examples/map/map/#tencentmap)、external incoming[Example address](/examples/map/map/#tmapInstance)

<embed src="@/docs/common/map.zh.md"></embed>