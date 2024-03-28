---
title: 风场图层
order: 7
---

`WindLayer`It is used to store pictures of wind field information, set parameters related to wind speed line sampling, and present the direction and intensity of the sampled wind field lines on the map in a visual way.

## use

```jsx
import { WindLayer } from '@antv/l7';
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*ADr-SIxhM9AAAAAAAAAAAAAAARQnAQ' />

### source

(data, options) => WindLayer, function to set wind field related information

- data: string image address to store wind farm information
  🌟[data collection](https://github.com/mapbox/webgl-wind#downloading-weather-data)
- options:

```js
{
  parser: {
    type: 'image',
      extent: [-180, -85, 180, 85], // Used to set the latitude and longitude chart interval where the wind field image is applied to the map
  },
}
```

### animate

Turn on animation effects.

```javascript
layer.animate(true);
```

### style

- `uMin`: wind speed`X`Axial/lateral minimum.
- `uMax`: wind speed`X`Axis/lateral maximum.
- `vMin`: wind speed`Y`Axis/longitudinal minimum.
- `vMax`: wind speed`Y`Axis/longitudinal maximum.
- `sizeScale`: Wind field line thickness scaling ratio,`0 - 2`。
- `fadeOpacity`: line transparency,`0 - 1`。
- `numParticles`: Number of lines.
- `rampColors`: Line fill color mapping.

```js
const rampColors = {
  colors: ['#3288bd', '#66c2a5', '#abdda4', '#e6f598', '#fee08b', '#fdae61', '#f46d43', '#d53e4f'],
  positions: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 1.0],
};
```

#### rampColors

- colors color array
- positions data interval

Configure the color band of the value range mapping color. The range of the value range is`[0 - 1]`, correspondingly we need to provide each`position`Position sets a color value.

⚠️ colors, positions must be the same length

```javascript
layer.style({
  rampColors: {
    colors: ['#FF4818', '#F7B74A', '#FFF598', '#91EABC', '#2EA9A1', '#206C7C'],
    positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
  },
});
```

[Online case](/examples/wind/basic#wind)
