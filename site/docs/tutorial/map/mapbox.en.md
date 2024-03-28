---
title: MapBox Map
order: 0
---

<embed src="@/docs/api/common/style.md"></embed>

## Using Mapbox Maps

1\. Register MapBox token

Registered address[Mapbox Access Tokens](https://docs.mapbox.com/help/how-mapbox-works/access-tokens/#creating-and-managing-access-tokens)

2\. Introduce mapbox.gl JS and css

To use mapbox, you need to introduce mapbox separately.

```html
<link href="https://api.tiles.mapbox.com/mapbox-gl-js/v1.5.0/mapbox-gl.css" rel="stylesheet" />

<script src="https://api.tiles.mapbox.com/mapbox-gl-js/v1.5.0/mapbox-gl.js"></script>
```

### Introducing L7

```html
<script src="https://unpkg.com/@antv/l7"></script>
```

#### Add a div tag to specify the map container

At the same time, you need to set the height and width of the Div.

```html
<div id="map"></div>
```

### Initialize L7 Scene

```javascript
const scene = new L7.Scene({
  id: 'map',
  map: new L7.Mapbox({
    style: 'dark', // 样式URL
    center: [120.19382669582967, 30.258134],
    pitch: 0,
    zoom: 12,
    token: 'mapbox token',
  }),
});
```

In this way we have completed instantiating the mapbox map through L7

### Add visualization layer

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
      ])
      .style({
        opacity: 1.0,
      });
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
      ::-webkit-scrollbar {
        display: none;
      }
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
    <link href="https://api.tiles.mapbox.com/mapbox-gl-js/v1.5.0/mapbox-gl.css" rel="stylesheet" />

    <script src="https://api.tiles.mapbox.com/mapbox-gl-js/v1.5.0/mapbox-gl.js"></script>
    <script src="https://unpkg.com/@antv/l7"></script>
    <script>
      const scene = new L7.Scene({
        id: 'map',
        map: new L7.Mapbox({
          style: 'dark', // 样式URL
          center: [120.19382669582967, 30.258134],
          pitch: 0,
          zoom: 12,
          token: 'mapbox token',
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
            ])
            .style({
              opacity: 1.0,
            });
          scene.addLayer(pointLayer);
        });
    </script>
  </body>
</html>
```
