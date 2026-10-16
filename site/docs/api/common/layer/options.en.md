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

<!-- include: ./mask_options.en.md -->
