---
title: "Options"
description: "Options"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/api/line_layer/options/"
---

[Resource index](/llms.txt)

### name

_string_ **optional** *default:*automatic numbering

Set the layer name, you can get the layer based on name

```javascript
scene.getLayerByName(name);
```

### visible

_bool_ **optional** _default:_ true

Is the layer visible?

### zIndex

_int_ **optional** *default:*0

Layer drawing order, larger values ​​are drawn on the upper layer, and you can control the upper and lower levels of layer drawing.

L7 uses a queue rendering mechanism. All layers are stored in an array internally. The rendering of each frame will sort the layer array according to the zIndex value, and then traverse the array to render the qualified layers to the scene. middle

### minZoom

_number_ **optional** *default:*Mapbox (0-24) Gaode (2-19)

Layer shows minimum zoom level

### maxZoom

_number_ **optional** *default:*Mapbox (0-24) Gaode (2-19)

Layer shows maximum zoom level

### autoFit

_bool_ **optional** _default:_ false

After layer initialization is completed, whether the map will automatically zoom to the layer range.

### pickingBuffer

_bool_ **optional** *default:*0

The layer picking cache mechanism, for example, a 1px width line is difficult to pick up (click) with the mouse. By setting this parameter, you can expand the picking range (enlarge the size of the layer object)

### blend

_string_ **optional** _default:_'normal'

Layer element blending effects

- normal Normal effect Default When occlusion occurs, only the color of the previous layer will be displayed.
- Additive overlay mode displays the superposition of the colors of the front and rear layers when occlusion occurs.
- subtractive subtraction mode: when occlusion occurs, the subtraction of the colors of the front and rear layers is displayed.
- max maximum value When occlusion occurs, the maximum value of the layer color rgb is displayed.

### enablePropagation

_boolean_ **optional** _default:_'false'Layer events, by default only respond to the top layer, setting to true will allow events to be transmitted transparently

⚠️ The use of mask and maskfence is not recommended. After configuring 2.14.x, the version will take effect.

Template layer: a layer used as a template. PointLayer, LineLayer, and PolygonLayer can all be used as templates.
Mask layer: the layer cut by the template

### maskLayers

Mask layer takes effect

_array Layer_ **optional** _default:_\[]

### enableMask

Mask layer takes effect

Whether to enable the mask. It is enabled by default. It will take effect when maskLayers is not empty.

_bool_ **optional** _default:_ true

### maskInside

```
Mask layer takes effect
```

_boolean_ **optional** _default:_ true

Used to describe the content of the current layer and mask boundary display.

- `true`Show inside the mask
- `false`Show outside mask

### maskOpetation mask method

Template layer takes effect _enumerate_ **optional** _default:_ andIt is invalid when there are multiple maskLayers and needs to be set on the template layer.

- or intersection
- and union

Usage example

```ts
const polygonLayer = new Polygon();
const rasterLayer = new Raster({
  // Raster layer uses polygon mask
  maskLayers: [polygonLayer],
  enableMask: true,
  maskInside: true,
});
```
