---
title: Style
order: 4
---

<embed src="@/docs/api/common/style.md"></embed>

of tile layer`style`Parameters depend on the layer used. Such as vector point layer,`style`The parameters of are the parameters of the corresponding point layer.

### raster tile

#### domain: \[number, number]

Set the domain of data mapping.\
ps: The fixed value range is`[0, 1]`, we map the incoming value (domain) to the value domain`[0, 1]`Later from`rampColor`The built ribbon picks up colors, and RGB multi-channel rasters are not supported.

#### clampLow/clampHigh: boolean

`clampLow`The default value is`false`,Set as`true`, lower than`domain`The data will not be displayed.\
`clampHigh`The default value is`false`,Set as`true`, higher than`domain`The data will not be displayed.

ps: rgb multi-channel raster is not supported

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

ps: ⚠️ The lengths of color and position must be the same, rgb multi-channel raster is not supported

### vector tile

of vector layers`style`The style remains the same as the normal layer.

### event

🌟 Data raster supports layer events, while image raster currently does not support layer events.

##### Binding events

🌟 Data grid tiles

```javascript
// The method of binding events is consistent with that of ordinary layers.
layer.on('click', e => {...})
```

#### event parameters

🌟 Data grid tiles
The event parameters of data grid tiles return new parameters compared to the events of ordinary layers.

#### value: number

🌟 Data grid tiles
The actual value of the tile at the mouse event location.
