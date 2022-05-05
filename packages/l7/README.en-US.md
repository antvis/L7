# L7

.
[![travis ci](https://travis-ci.com/antvis/L7.svg?branch=master)](https://travis-ci.com/antvis/L7) [![](https://flat.badgen.net/npm/v/@antv/l7?icon=npm)](https://www.npmjs.com/package/@antv/l7) ![最近提交](https://badgen.net/github/last-commit/antvis/L7)

Large-scale WebGL-powered Geospatial data visualization analysis framework.

[中文 README](./README.md)

[GitHub](https://github.com/antvis/L7)

Powered by WebGL, the rendering technology of L7 supports fast and efficient rendering of big data, 2D/3D rendering, possible through calculation and analysis of spatial data by GPU Parallel Compu-ting.

L7 focuses on geographic data expressiveness，interaction and design of geographic visualization layers. The basemaps on the platform are powered by third-party services

[website](https://l7.antv.vision/zh)

## 🌄 L7 visualization demos

![L7 demo](https://gw.alipayobjects.com/mdn/rms_855bab/afts/img/A*S-73QpO8d0YAAAAAAAAAAABkARQnAQ)

## 🌟 Highlight features of L7 2.0

- 🌏 Data-driven Visualization

  Layer visualization API design base Semiology of Graphics.

  It supports rich map visualization types for a better insight on data.

- 🌏 High performance rendering with 2D/3D effect
  Real-time and dynamic rendering with millions of spatial data.

- 🌏 Simple and flexible data format

  L7 supports a wide variety of data formats including CSV, JSON, geojson, among others, eliminating the need to run conversions ahead of time.

- 🌏 Multi-basemap

  For global users, Mapbox is easy to be embedded by a simple line of code.

## Getting Started

### 📦 Installation

```bash
npm install @antv/l7
```

### Init Map by L7 scene

```javascript
import { Scene } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    style: 'light',
    pitch: 0,
    center: [107.054293, 35.246265],
    zoom: 4.056,
  }),
});
```

### Add Layer

```javascript
import { PointLayer } from '@antv/l7';

const pointLayer = new PointLayer()
  .source(data)
  .shape('circle')
  .size('mag', [1, 25])
  .color('mag', ['#5B8FF9', '#5CCEA1'])
  .style({
    opacity: 0.3,
    strokeWidth: 1,
  });

scene.addLayer(pointLayer);
```

## :memo: Documentation

- [Getting started with L7](https://l7.antv.vision/en/docs/api/l7)
- [Tutorials](https://l7.antv.vision/en/docs/tutorial/quickstart)
- [API documentation](https://l7.antv.vision/en/docs/api/l7)
- [Examples](https://l7.antv.vision/en/examples/gallery/basic)
- [Contributor documentation](./.github/CONTRIBUTING.md)

## 🔗 Links

- [L7Plot](https://github.com/antvis/L7Plot)
- [L7 React](https://github.com/antvis/L7-React)
- [L7 Boundary](https://github.com/antvis/L7-boundary)
- [L7 draw](https://github.com/antvis/L7-draw)

## ✅ License

[MIT license](./LICENSE).
