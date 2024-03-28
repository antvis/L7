---
title: React 组件库
order: 4
---

### LarkMap

LarkMap provides map container components for the L7 react map component library. Related map components and Hooks need to be placed inside the container component before they can be used. The container component can configure different maps through properties and supports Mapbox, Gaode, Baidu, Tencent and L7Map as basemaps. Among them, Baidu and Tencent are still experimental features.

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

[L7 React component library](https://larkmap.antv.antgroup.com/components/lark-map)
