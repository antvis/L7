# `draw`
 地图绘制组件，支持点、线、面的绘制编辑,

## 使用

l7-draw 需要引用

```
import { DrawControl } from '@antv/l7-draw';

```
CDN 版本引用

```html
<head>
<! --引入最新版的L7-Draw --> 
<script src = 'https://unpkg.com/@antv/l7-draw'></script>
</head>
```

### example

```javascript

import { Scene } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import { DrawControl } from '@antv/l7-draw';
const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        pitch: 0,
        style: 'dark', // hosted style id
        center: [112.874, 32.76], // starting position
        zoom: 12, // starting zoom
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {

      const drawControl = new DrawControl(scene, {
        position: 'topright',
        layout: 'horizontal', // horizontal vertical
        controls: {
          point: true,
          polygon: true,
          line: true,
          circle: true,
          rect: true,
          delete: true,
        },
      });
      scene.addControl(drawControl);
    });

```
