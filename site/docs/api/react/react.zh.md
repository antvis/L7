---
title: React 组件库
order: 4
---

### LarkMap

LarkMap 为 L7 react 地图组件库提供地图容器组件，相关地图组件与 Hooks 需放到容器组件内部才能使用，容器组件可通过属性配置不同的地图，支持 Mapbox、Gaode、Baidu、Tencent 及 L7Map 作为底图，其中 Baidu 和 Tencent 仍为实验特性。

```tsx
import type { LarkMapProps } from '@antv/larkmap';
import { LarkMap } from '@antv/larkmap';
import React from 'react';

const config: LarkMapProps = {
  mapType: 'Gaode',
  mapOptions: {
    style: 'light',
    center: [120.210792, 30.246026],
    zoom: 9,
    // token: '你申请的 Key',
  },
};

export default () => (
  <LarkMap {...config} style={{ height: '300px' }}>
    <h2 style={{ position: 'absolute', left: '10px' }}>LarkMap</h2>
  </LarkMap>
);
```

[L7 React 组件库](https://larkmap.antv.antgroup.com/components/lark-map)
