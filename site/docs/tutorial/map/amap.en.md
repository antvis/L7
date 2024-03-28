---
title: GaodeMap
order: 0
---

<embed src="@/docs/api/common/style.md"></embed>

## Use AMap

### Register an account and apply for a Key

1. first,[Register a developer account](https://lbs.amap.com/dev/id/choose), become a developer of AMap open platform

2. After logging in, enter the "Application Management" page and "Create a New Application"

3. for application[Add Key](https://lbs.amap.com/dev/key/app), please select "Web client (JSAPI)" for "Service Platform"

### Introducing L7

AMap version 2.0 dynamically introduces the AMap map within L7`JS API`, so it is no longer necessary to introduce Gaode separately`JS API`, just set`type`for`amap`and pass in`token`。

```html
<script src="https://unpkg.com/@antv/l7"></script>
```

### Add a div tag to specify the map container

At the same time, it is necessary to`div`Set the height and width.

```html
<div id="map"></div>
```

### Initialize L7 Scene

```javascript
const scene = new L7.Scene({
  id: 'map',
  map: new L7.GaodeMap({
    style: 'dark', // Style URL
    center: [120.19382669582967, 30.258134],
    pitch: 0,
    zoom: 12,
    token: 'AMap token',
  }),
});
```

In this way we have completed passing`L7`Instantiate the Gaode map.

### Add visualization layer

- First we need to get the data and get the data method. Here we get the online geographical data.
- Then we can initialize a`Layer`, and added to`Scene`The layer addition is completed.

```javascript
fetch('https://gw.alipayobjects.com/os/rmsportal/oVTMqfzuuRFKiDwhPSFL.json')
  .then((res) => res.json())
  .then((data) => {
    const pointLayer = new L7.PointLayer({})
      .source(data.list, {
        parser: {
          type: 'json',
          x: 'j',
          y: 'w',
        },
      })
      .shape('cylinder')
      .size('t', function (level) {
        return [1, 2, level * 2 + 20];
      })
      .color('t', [
        '#094D4A',
        '#146968',
        '#1D7F7E',
        '#289899',
        '#34B6B7',
        '#4AC5AF',
        '#5FD3A6',
        '#7BE39E',
        '#A1EDB8',
        '#CEF8D6',
      ]);
    scene.addLayer(pointLayer);
  });
```

### Complete demo code

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>创建地图场景</title>
    <style>
      html,
      body {
        overflow: hidden;
        margin: 0;
      }
      #map {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/@antv/l7"></script>
    <script>
      const scene = new L7.Scene({
        id: 'map',
        map: new L7.GaodeMap({
          style: 'dark', // 样式URL
          center: [120.19382669582967, 30.258134],
          pitch: 0,
          zoom: 12,
          token: '高德地图token',
        }),
      });

      fetch('https://gw.alipayobjects.com/os/rmsportal/oVTMqfzuuRFKiDwhPSFL.json')
        .then((res) => res.json())
        .then((data) => {
          const pointLayer = new L7.PointLayer({})
            .source(data.list, {
              parser: {
                type: 'json',
                x: 'j',
                y: 'w',
              },
            })
            .shape('cylinder')
            .size('t', function (level) {
              return [1, 2, level * 2 + 20];
            })
            .color('t', [
              '#094D4A',
              '#146968',
              '#1D7F7E',
              '#289899',
              '#34B6B7',
              '#4AC5AF',
              '#5FD3A6',
              '#7BE39E',
              '#A1EDB8',
              '#CEF8D6',
            ]);
          scene.addLayer(pointLayer);
        });
    </script>
  </body>
</html>
```
