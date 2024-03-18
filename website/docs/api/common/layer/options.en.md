### name

<description> *string* **optional** *default:*automatic numbering</description>

Set the layer name, you can get the layer based on name

```javascript
scene.getLayerByName(name);
```

### visible

<description> *bool* **optional** *default:* true</description>

Is the layer visible?

### zIndex

<description> *int* **optional** *default:*0</description>

Layer drawing order, larger values ​​are drawn on the upper layer, and you can control the upper and lower levels of layer drawing.

L7 uses a queue rendering mechanism. All layers are stored in an array internally. The rendering of each frame will sort the layer array according to the zIndex value, and then traverse the array to render the qualified layers to the scene. middle

### minZoom

<description> *number* **optional** *default:*Mapbox (0-24) Gaode (2-19)</description>

Layer shows minimum zoom level

### maxZoom

<description> *number* **optional** *default:*Mapbox (0-24) Gaode (2-19)</description>

Layer shows maximum zoom level

### autoFit

<description> *bool* **optional** *default:* false</description>

After layer initialization is completed, whether the map will automatically zoom to the layer range.

### pickingBuffer

<description> *bool* **optional** *default:*0</description>

The layer picking cache mechanism, for example, a 1px width line is difficult to pick up (click) with the mouse. By setting this parameter, you can expand the picking range (enlarge the size of the layer object)

### blend

<description> *string* **optional** *default:*'normal'</description>

Layer element blending effects

* normal Normal effect Default When occlusion occurs, only the color of the previous layer will be displayed.
* Additive overlay mode displays the superposition of the colors of the front and rear layers when occlusion occurs.
* subtractive subtraction mode: when occlusion occurs, the subtraction of the colors of the front and rear layers is displayed.
* max maximum value When occlusion occurs, the maximum value of the layer color rgb is displayed.

### enablePropagation

<description> *boolean* **optional** *default:*'false'</description>Layer events, by default only respond to the top layer, setting to true will allow events to be transmitted transparently

<embed src="@/docs/api/common/layer/mask_options.en.md"></embed>
