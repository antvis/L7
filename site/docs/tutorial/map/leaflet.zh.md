---
title: Leaflet 地图
order: 2
---

<embed src="@/docs/api/common/style.md"></embed>

`L7` 通过提供插件的形式实现了对 `Leaflet` 的支持，实现 `Leaflet` 地图和 `L7` 可视化图层的融合。

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*lkWkTpJjPlYAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

### L7-Leaflet

- `L7-Leaflet` 是对外开源的插件 [github 地址](https://github.com/antvis/L7-Leaflet)

### 安装

#### npm

```bash
 npm install  @antv/l7-leaflet
```

#### cdn

```javascript
<script src="https://unpkg.com/@antv/l7-leaflet"></script>
```

### 使用

#### L7 plugin for Lealfet use in Leaflet

```js
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LineLayer } from '@antv/l7';
import { L7Layer } from '@antv/l7-leaflet';

import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const map = L.map('map', {
      minZoom: 1,
    }).setView([30, 112], 3);
    const mapType = 'vec';
    L.tileLayer(
      'https://t{s}.tianditu.gov.cn/' +
        mapType +
        '_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=' +
        mapType +
        '&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=b72aa81ac2b3cae941d1eb213499e15e',
      {
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        attribution:
          '&copy; <a href="http://lbs.tianditu.gov.cn/home.html">天地图 GS(2022)3124号 - 甲测资字1100471</a>',
      },
    ).addTo(map);
    const mapLabelType = 'cva';
    L.tileLayer(
      'https://t{s}.tianditu.gov.cn/' +
        mapLabelType +
        '_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=' +
        mapLabelType +
        '&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=b72aa81ac2b3cae941d1eb213499e15e',
      {
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
      },
    ).addTo(map);

    L.marker([30, 112])
      .addTo(map)
      .setIcon(
        new L.Icon({
          iconUrl:
            'https://gw.alipayobjects.com/mdn/rms_5e897d/afts/img/A*6ONoRKNECC0AAAAAAAAAAAAAARQnAQ',
          iconSize: [16, 16],
        }),
      )
      .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
      .openPopup();

    const l7layer = new L7Layer().addTo(map);
    const scene = l7layer.getScene();
    fetch('https://gw.alipayobjects.com/os/rmsportal/UEXQMifxtkQlYfChpPwT.txt')
      .then((res) => res.text())
      .then((data) => {
        const layer = new LineLayer({})
          .source(data, {
            parser: {
              type: 'csv',
              x: 'lng1',
              y: 'lat1',
              x1: 'lng2',
              y1: 'lat2',
            },
          })
          .size(1)
          .shape('arc')
          .color('#8C1EB2')
          .style({
            opacity: 0.8,
            blur: 0.99,
          });
        scene.addLayer(layer);
      });
  }, []);

  return (
    <div
      id="map"
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};
```

#### Leafet BaseMap for L7 use in L7

```js
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LineLayer } from '@antv/l7';
import { L7Layer } from '@antv/l7-leaflet';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const map = L.map('map', {
      minZoom: 1,
    }).setView([30, 112], 3);
    const mapType = 'vec';
    L.tileLayer(
      'https://t{s}.tianditu.gov.cn/' +
        mapType +
        '_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=' +
        mapType +
        '&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=b72aa81ac2b3cae941d1eb213499e15e',
      {
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        attribution:
          '&copy; <a href="http://lbs.tianditu.gov.cn/home.html">天地图 GS(2022)3124号 - 甲测资字1100471</a>',
      },
    ).addTo(map);
    const mapLabelType = 'cva';
    L.tileLayer(
      'https://t{s}.tianditu.gov.cn/' +
        mapLabelType +
        '_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=' +
        mapLabelType +
        '&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=b72aa81ac2b3cae941d1eb213499e15e',
      {
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
      },
    ).addTo(map);

    L.marker([30, 112])
      .addTo(map)
      .setIcon(
        new L.Icon({
          iconUrl:
            'https://gw.alipayobjects.com/mdn/rms_5e897d/afts/img/A*6ONoRKNECC0AAAAAAAAAAAAAARQnAQ',
          iconSize: [16, 16],
        }),
      )
      .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
      .openPopup();

    const l7layer = new L7Layer().addTo(map);
    const scene = l7layer.getScene();
    fetch('https://gw.alipayobjects.com/os/rmsportal/UEXQMifxtkQlYfChpPwT.txt')
      .then((res) => res.text())
      .then((data) => {
        const layer = new LineLayer({})
          .source(data, {
            parser: {
              type: 'csv',
              x: 'lng1',
              y: 'lat1',
              x1: 'lng2',
              y1: 'lat2',
            },
          })
          .size(1)
          .shape('arc')
          .color('#8C1EB2')
          .style({
            opacity: 0.8,
            blur: 0.99,
          });
        scene.addLayer(layer);
      });
  }, []);

  return (
    <div
      id="map"
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};
```
